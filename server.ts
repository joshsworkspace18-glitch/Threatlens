import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  MOCK_IOCS,
  MOCK_GNN_NODES,
  MOCK_GNN_EDGES,
  MOCK_THREAT_FEED_ITEMS,
  MOCK_CASES,
  MOCK_MITRE_TACTIC_GROUPS,
  INITIAL_STATS,
  INITIAL_USER
} from './src/mockData';
import { IoCIndicator, InvestigationCase, ThreatFeedItem, TimelineEvent } from './src/types';

// In-memory state store for interactive operations
let iocs: IoCIndicator[] = [...MOCK_IOCS];
let cases: InvestigationCase[] = [...MOCK_CASES];
let threatFeed: ThreatFeedItem[] = [...MOCK_THREAT_FEED_ITEMS];
let userProfile = { ...INITIAL_USER };

// Helper to get Gemini client lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'ThreatLens Unified IoC Platform', time: new Date().toISOString() });
  });

  // Current User Profile & Role Switcher
  app.get('/api/user', (_req: Request, res: Response) => {
    res.json(userProfile);
  });

  app.post('/api/user/role', (req: Request, res: Response) => {
    const { role } = req.body;
    if (role === 'ANALYST' || role === 'ADMIN') {
      userProfile.role = role;
      res.json({ success: true, profile: userProfile });
    } else {
      res.status(400).json({ error: 'Invalid role. Must be ANALYST or ADMIN' });
    }
  });

  // Dashboard Stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    const highRisk = iocs.filter(i => i.riskLevel === 'CRITICAL' || i.riskLevel === 'HIGH').length;
    const avgScore = Number((iocs.reduce((sum, i) => sum + i.fusionScore, 0) / (iocs.length || 1)).toFixed(1));
    const pending = cases.filter(c => c.status !== 'CLOSED').length;

    res.json({
      ...INITIAL_STATS,
      highRiskIoCs: highRisk,
      avgFusionRiskScore: avgScore,
      pendingCases: pending,
      activeHoneypotAlerts: threatFeed.length * 24
    });
  });

  // IoC Indicators
  app.get('/api/iocs', (req: Request, res: Response) => {
    const { search, type, risk, minScore } = req.query;
    let filtered = [...iocs];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.value.toLowerCase().includes(q) ||
        i.asn.toLowerCase().includes(q) ||
        i.country.toLowerCase().includes(q) ||
        (i.threatActorAttribution && i.threatActorAttribution.toLowerCase().includes(q)) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (type && typeof type === 'string' && type !== 'all') {
      filtered = filtered.filter(i => i.type === type);
    }

    if (risk && typeof risk === 'string' && risk !== 'all') {
      filtered = filtered.filter(i => i.riskLevel === risk);
    }

    if (minScore && !isNaN(Number(minScore))) {
      filtered = filtered.filter(i => i.fusionScore >= Number(minScore));
    }

    res.json(filtered);
  });

  app.get('/api/iocs/:id', (req: Request, res: Response) => {
    const ioc = iocs.find(i => i.id === req.params.id || i.value === req.params.id);
    if (!ioc) {
      return res.status(404).json({ error: 'IoC not found' });
    }
    res.json(ioc);
  });

  // GNN Graph topology
  app.get('/api/gnn-graph', (_req: Request, res: Response) => {
    res.json({
      nodes: MOCK_GNN_NODES,
      edges: MOCK_GNN_EDGES
    });
  });

  // Threat Feed
  app.get('/api/threat-feed', (_req: Request, res: Response) => {
    res.json(threatFeed);
  });

  // Ingest or trigger a simulated live honeypot telemetry event
  app.post('/api/threat-feed/simulate', (req: Request, res: Response) => {
    const randomIoc = iocs[Math.floor(Math.random() * iocs.length)];
    const services = ['Cowrie-Telnet-01', 'Dionaea-SMB-04', 'Conpot-ICS-02', 'HoneyPy-SSH-01'];
    const selectedService = services[Math.floor(Math.random() * services.length)];

    const newItem: ThreatFeedItem = {
      id: `feed-${Date.now()}`,
      timestamp: `${new Date().toISOString().substring(11, 19)} UTC`,
      indicator: req.body.indicator || randomIoc.value,
      type: randomIoc.type,
      honeypotName: selectedService,
      rawEvent: req.body.rawEvent || `Inbound anomaly detected: ${randomIoc.tags[0] || 'Malicious Payload'} probe from ${randomIoc.country}`,
      normalizedSeverity: randomIoc.riskLevel,
      port: randomIoc.portActivity[0]?.port || 22,
      payloadPreview: `Automated trigger from ${randomIoc.asn}`,
      countryCode: randomIoc.countryCode
    };

    threatFeed.unshift(newItem);
    if (threatFeed.length > 50) {
      threatFeed.pop();
    }

    res.json({ success: true, item: newItem });
  });

  // Cases Management
  app.get('/api/cases', (_req: Request, res: Response) => {
    res.json(cases);
  });

  app.post('/api/cases', (req: Request, res: Response) => {
    const { title, description, severity, sector, iocIds } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newCase: InvestigationCase = {
      id: `case-${Date.now()}`,
      caseNumber: `CASE-2026-${String(cases.length + 87).padStart(3, '0')}`,
      title,
      description: description || 'No detailed case summary provided.',
      severity: severity || 'HIGH',
      status: 'NEW',
      priority: severity === 'CRITICAL' ? 1 : severity === 'HIGH' ? 2 : 3,
      assignee: userProfile.name,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      updatedAt: 'Just now',
      sector: sector || 'Enterprise Network',
      iocIds: iocIds || [],
      timelineEvents: [
        {
          id: `tle-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          stage: 'Case Inception',
          title: 'Case Created by Analyst',
          details: `Case initiated for investigation of correlated indicators: ${(iocIds || []).join(', ') || 'Manual investigation'}`,
          severity: severity || 'HIGH'
        }
      ]
    };

    cases.unshift(newCase);
    res.status(201).json(newCase);
  });

  app.patch('/api/cases/:id', (req: Request, res: Response) => {
    const targetCase = cases.find(c => c.id === req.params.id);
    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (req.body.status) targetCase.status = req.body.status;
    if (req.body.severity) targetCase.severity = req.body.severity;
    if (req.body.priority !== undefined) targetCase.priority = req.body.priority;
    if (req.body.assignee) targetCase.assignee = req.body.assignee;
    if (req.body.iocIds) targetCase.iocIds = req.body.iocIds;
    targetCase.updatedAt = 'Just now';

    res.json(targetCase);
  });

  app.post('/api/cases/:id/timeline', (req: Request, res: Response) => {
    const targetCase = cases.find(c => c.id === req.params.id);
    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const { title, details, stage, severity, sourceIoC, analystNote, tactics } = req.body;
    const newEvent: TimelineEvent = {
      id: `tle-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      stage: stage || 'Investigation Note',
      title: title || 'Analyst Evidence Attached',
      details: details || 'Evidence correlated during active investigation workbench session.',
      severity: severity || 'MEDIUM',
      sourceIoC,
      analystNote,
      tactics: tactics || []
    };

    targetCase.timelineEvents.push(newEvent);
    targetCase.updatedAt = 'Just now';
    res.status(201).json({ success: true, event: newEvent, updatedCase: targetCase });
  });

  // MITRE ATT&CK Matrix Data
  app.get('/api/mitre', (_req: Request, res: Response) => {
    res.json(MOCK_MITRE_TACTIC_GROUPS);
  });

  // LLM-Assisted MITRE ATT&CK Contextualization Endpoint
  app.post('/api/ai/contextualize', async (req: Request, res: Response) => {
    const { indicatorId, indicatorValue } = req.body;
    const ioc = iocs.find(i => i.id === indicatorId || i.value === indicatorValue) || iocs[0];

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are a Principal Threat Intelligence Analyst and Cyber Defense Engineer for ThreatLens platform.
Analyze the following Indicator of Compromise (IoC) with telemetry data:
Indicator: ${ioc.value} (Type: ${ioc.type})
ASN/Infra: ${ioc.asn}, Country: ${ioc.country}
Infrastructure Score: ${ioc.infrastructureScore}/100, Behavioral Score: ${ioc.behavioralScore}/100, Fusion Score: ${ioc.fusionScore}/100
Tags: ${ioc.tags.join(', ')}
Honeypot: ${ioc.honeypotSource}
Executed Commands: ${JSON.stringify(ioc.executedCommands.map(c => c.command))}
Failed Auths: ${JSON.stringify(ioc.failedAuthAttempts.map(a => `${a.username}:${a.passwordSnippet} on ${a.service}`))}
MITRE Mappings: ${JSON.stringify(ioc.mitreMappings.map(m => `${m.tactic} -> ${m.technique} (${m.techniqueId})`))}

Provide a structured, evidence-based threat contextualization in clear, high-density intelligence style with:
1. Threat Actor & Campaign Attribution Assessment
2. Behavioral Synthesis & Weaponization Breakdown (explaining honeypot shell captures and intent)
3. MITRE ATT&CK Alignment & Critical Pivot Points
4. Immediate Defensibility & Firewall Containment Recommendations`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        return res.json({
          source: 'gemini-3.8-flash',
          analysis: aiResponse.text,
          ioc: ioc
        });
      } catch (err: any) {
        console.error('Gemini API contextualize error, using fallback:', err?.message);
      }
    }

    // High-fidelity fallback intelligence
    const fallbackAnalysis = `### ThreatLens Cyber Threat Intelligence Synthesis
**Indicator:** \`${ioc.value}\` | **Confidence:** ${ioc.fusionScore}% (${ioc.riskLevel}) | **Cluster:** ${ioc.threatActorAttribution || 'Undetermined APT'}

#### 1. Attribution & Operational Context
Telemetry normalized from **${ioc.honeypotSource}** strongly correlates with tactics associated with **${ioc.threatActorAttribution || 'High-Risk Threat Cluster'}**. Host infrastructure resides in **${ioc.asn}** (${ioc.country}), characterized by known bulletproof hosting resilience and high turnover IP subnets.

#### 2. Honeypot Behavioral Mechanics & Exploit Telemetry
* **Ingress Vector:** Systematic multi-port probes spanning ${ioc.portActivity.map(p => `Port ${p.port} (${p.service})`).join(', ')}.
* **Authentication Weaponization:** Captured ${ioc.failedAuthAttempts.length} distinct brute-force iterations attempting common administrative credentials (${ioc.failedAuthAttempts.slice(0, 2).map(a => `${a.username}`).join(', ')}).
* **Execution Footprint:** Shell entrapment recorded privileged shell invocations:
  \`${ioc.executedCommands[0]?.command || 'curl -s payload staging'}\`
  This demonstrates post-exploitation reconnaissance targeting kernel architecture and process hierarchies.

#### 3. Correlated MITRE ATT&CK Matrix
* **${ioc.mitreMappings[0]?.tactic || 'Initial Access'} (${ioc.mitreMappings[0]?.techniqueId || 'T1190'})**: ${ioc.mitreMappings[0]?.technique || 'Exploitation of public perimeter interface'}.
* **${ioc.mitreMappings[1]?.tactic || 'Execution'} (${ioc.mitreMappings[1]?.techniqueId || 'T1059.004'})**: Piped command interpreter delivery bypassing standard disk writes.
* **${ioc.mitreMappings[2]?.tactic || 'Command and Control'} (${ioc.mitreMappings[2]?.techniqueId || 'T1071.001'})**: Beaconing channel with synchronized heartbeat telemetry.

#### 4. Containment Recommendations (SOC Tier 2/3)
1. **Perimeter Firewall Rule:** Instate immediate egress and ingress drop on border edge firewalls for CIDR block corresponding to ${ioc.asn}.
2. **Endpoint SIEM Query:** Sweep internal EDR sensor logs for child process spawning matching \`${ioc.executedCommands[0]?.command?.split(' ')[0] || 'sh'}\` originating from network connections.
3. **Pki/DNS Quarantine:** Sinkhole queries directed to associated fast-flux domains on internal recursive DNS resolvers.`;

    res.json({
      source: 'threatlens-intelligence-engine',
      analysis: fallbackAnalysis,
      ioc: ioc
    });
  });

  // Executive Summary Report Generation Endpoint
  app.post('/api/ai/executive-report', async (req: Request, res: Response) => {
    const { caseId, scope } = req.body;
    const selectedCase = cases.find(c => c.id === caseId) || cases[0];
    const highRiskIocs = iocs.filter(i => i.riskLevel === 'CRITICAL' || i.riskLevel === 'HIGH');

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are a Chief Information Security Officer (CISO) and Lead Incident Commander.
Generate an Executive Summary Threat Intelligence & Incident Report for executive leadership:
Case: ${selectedCase.caseNumber} - ${selectedCase.title}
Target Sector: ${selectedCase.sector}
Severity: ${selectedCase.severity} | Status: ${selectedCase.status}
Active Correlated Indicators: ${highRiskIocs.map(i => `${i.value} (${i.type}, Fusion: ${i.fusionScore}%, ASN: ${i.asn})`).join('; ')}
Timeline Milestones: ${selectedCase.timelineEvents.map(e => `[${e.timestamp}] ${e.stage}: ${e.title}`).join(' -> ')}

Format this as an ultra-clean, professional executive report suitable for board briefings and technical directors:
- Executive Overview (High-level summary, business impact)
- Threat Landscape & Attack Vector Mechanics
- Critical IoC Exposure Table
- Timeline of Significant Events
- Strategic & Tactical Containment Roadmap (Immediate, 24h, 7-Day actions)`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        return res.json({
          source: 'gemini-3.8-flash',
          report: aiResponse.text,
          caseNumber: selectedCase.caseNumber,
          generatedAt: new Date().toISOString()
        });
      } catch (err: any) {
        console.error('Gemini API executive report error, using fallback:', err?.message);
      }
    }

    // High-fidelity fallback report
    const fallbackReport = `# EXECUTIVE THREAT INTELLIGENCE & INCIDENT SUMMARY
**Report Identifier:** TL-EXECUTIVE-${selectedCase.caseNumber}
**Date of Dispatch:** ${new Date().toUTCString()}
**Classification:** TLP:AMBER+STRICT | SOC Command Center Briefing
**Target Entity Scope:** ${selectedCase.sector}

---

### 1. EXECUTIVE SUMMARY & RISK POSTURE
Over the last 72 hours, the ThreatLens Unified Investigation Platform intercepted high-confidence adversary activity targeting operational perimeter environments. Analysis of real-time honeypot sensors (Cowrie, Dionaea, and Conpot) confirmed coordinated exploitation attempts matching the tactical playbook of advanced threat groups.

* **Current Threat Classification:** ${selectedCase.severity} SEVERITY (Level ${selectedCase.priority} Criticality)
* **Average Platform Fusion Confidence:** ${INITIAL_STATS.avgFusionRiskScore}% (Empirically verified via Graph Neural Network cross-node correlation)
* **Status of Current Case:** ${selectedCase.status} (Lead Investigator: ${selectedCase.assignee})

---

### 2. CORE ATTACK CHAIN & BEHAVIORAL MECHANICS
1. **Perimeter Reconnaissance & Exploit Staging:** Adversary deployed automated scans from bulletproof ASN clusters (principally ${highRiskIocs[0]?.asn || 'AS44050'}), probing exposed edge gateways (Ports 22, 23, 445, 502).
2. **Privileged Ingress & Command Injection:** Honeypot telemetry recorded malicious shell execution designed to circumvent standard host inspection, followed by in-memory DLL reflective loading.
3. **C2 Beacon Infrastructure:** Communication was multiplexed over dynamic DNS infrastructure utilizing fast-flux record rotation to mitigate domain takedown mechanisms.

---

### 3. HIGH-PRIORITY INDICATOR EXPOSURE SUMMARY
| Indicator | Type | Fusion Score | ASN / Infrastructure | Risk Tier |
| :--- | :--- | :--- | :--- | :--- |
${highRiskIocs.slice(0, 5).map(i => `| \`${i.value}\` | ${i.type.toUpperCase()} | ${i.fusionScore}% | ${i.asn.split(' ')[0]} | **${i.riskLevel}** |`).join('\n')}

---

### 4. INVESTIGATION TIMELINE HIGHLIGHTS
${selectedCase.timelineEvents.map(e => `* **${e.timestamp}** [${e.stage}]: ${e.title} — *${e.details.substring(0, 110)}...*`).join('\n')}

---

### 5. STRATEGIC & TACTICAL MITIGATION ROADMAP
* **Immediate Containment (0 - 4 Hours):**
  - Enact perimeter edge drop filters on AS44050 and associated /24 subnets.
  - Terminate all external administrative interfaces on ports 8040, 8080, and legacy Telnet.
* **Near-Term Defense (4 - 24 Hours):**
  - Execute automated host-based sweeps for SHA-256 hashes \`7b9c31fa7d88...\` across all Windows and Linux servers.
  - Revoke all credentials observed in honeypot authentication attempts.
* **Strategic Hardening (Next 7 Days):**
  - Implement continuous Honeypot Telemetry ingestion into GNN infrastructure clustering models.
  - Enforce hardware MFA tokens for all engineers and OT operations personnel.

*Generated by ThreatLens Threat Intelligence Engine | Verified by Cyber Defense Unit*`;

    res.json({
      source: 'threatlens-intelligence-engine',
      report: fallbackReport,
      caseNumber: selectedCase.caseNumber,
      generatedAt: new Date().toISOString()
    });
  });

  // Admin utilities: Honeypot sensor control and mock rules export
  app.get('/api/admin/sensors', (_req: Request, res: Response) => {
    res.json([
      { id: 'sens-01', name: 'Cowrie-Telnet-01', region: 'Frankfurt (eu-central-1)', status: 'HEALTHY', protocol: 'SSH/Telnet:22/23', hits24h: 38420 },
      { id: 'sens-02', name: 'Dionaea-SMB-04', region: 'Tokyo (ap-northeast-1)', status: 'HEALTHY', protocol: 'SMB/FTP/MSSQL:445', hits24h: 18910 },
      { id: 'sens-03', name: 'Conpot-ICS-02', region: 'Dallas (us-central-1)', status: 'HEALTHY', protocol: 'Modbus/S7/IEC-104:502', hits24h: 7420 },
      { id: 'sens-04', name: 'Glastopf-HTTP-03', region: 'London (eu-west-2)', status: 'HEALTHY', protocol: 'HTTP/HTTPS/DoH:80/443', hits24h: 52190 },
      { id: 'sens-05', name: 'HoneyPy-SSH-01', region: 'Singapore (ap-southeast-1)', status: 'HEALTHY', protocol: 'SSH/RDP:22/3389', hits24h: 14280 }
    ]);
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ThreatLens Platform] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ThreatLens Server] Failed to start:', err);
  process.exit(1);
});
