import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  ShieldAlert,
  Bot,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { DashboardStats, IoCIndicator, InvestigationCase } from '../types';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DashboardStats;
  iocs: IoCIndicator[];
  cases: InvestigationCase[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  stats,
  iocs,
  cases
}) => {
  const [copied, setCopied] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiReport = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: cases[0]?.id
        })
      });
      const data = await res.json();
      setAiReport(data.report);
    } catch (err) {
      console.error('Failed to generate executive report:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'ThreatLens Unified IoC Investigation Platform',
      stats,
      topCriticalIoCs: iocs.filter(i => i.riskLevel === 'CRITICAL').slice(0, 5),
      activeCases: cases.map(c => ({
        id: c.caseNumber,
        title: c.title,
        severity: c.severity,
        status: c.status
      })),
      aiExecutiveSummary: aiReport
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThreatLens_Executive_Brief_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const markdownContent = `# THREATLENS EXECUTIVE CYBER INTELLIGENCE BRIEF
Generated: ${new Date().toUTCString()}
Classification: STRICTLY CONFIDENTIAL // TLP:AMBER

## 1. Executive Telemetry Overview
- Monitored Indicators: ${stats.totalIoCsMonitored}
- High-Risk Indicators: ${stats.highRiskIoCs}
- Honeypot Intrusion Alerts: ${stats.activeHoneypotAlerts}
- Active Case Docket: ${stats.pendingCases}
- GNN Fusion Threat Score: ${stats.avgFusionRiskScore}%

## 2. Critical Threat Clusters
${iocs
  .filter(i => i.riskLevel === 'CRITICAL')
  .map(
    i => `- **${i.value}** (${i.type.toUpperCase()}) | Fusion: ${i.fusionScore}% | Actor: ${i.threatActorAttribution || 'Unattributed'} | ASN: ${i.asn}`
  )
  .join('\n')}

## 3. Active Incident Response Cases
${cases
  .map(
    c => `- [${c.status}] **${c.caseNumber}**: ${c.title} (Severity: ${c.severity}, Sector: ${c.sector})`
  )
  .join('\n')}

## 4. Automated Threat Synthesis
${aiReport || 'Run AI Synthesis for deep contextualization.'}
`;
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-[#111216] border border-[#24272e] rounded-[6px] shadow-2xl p-5 sm:p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto print:border-none print:shadow-none print:p-0 print:text-black print:bg-white">
        {/* Report Header Bar */}
        <div className="flex items-start justify-between border-b border-[#24272e] pb-3 print:border-black">
          <div>
            <div className="flex items-center space-x-2">
              <span className="fusion-badge badge-critical uppercase tracking-[0.5px] print:border-black print:text-black">
                TLP:AMBER // STRICTLY CONFIDENTIAL
              </span>
              <span className="text-xs font-mono text-[#94a3b8] print:text-gray-600">
                ThreatLens Strategic Intelligence Brief
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-[#e2e8f0] mt-1 print:text-black">
              Executive Threat & Containment Briefing
            </h2>
            <p className="text-[11px] text-[#94a3b8] font-mono mt-0.5 print:text-gray-600">
              Correlated from Real-Time Honeypot Telemetry & Graph Neural Network Analysis
            </p>
          </div>

          <div className="flex items-center space-x-1.5 print:hidden">
            <button
              onClick={handlePrint}
              title="Print or Save PDF"
              className="px-2.5 py-1 rounded bg-[#08090a] hover:bg-[#16181f] text-[#cbd5e1] text-xs font-mono flex items-center space-x-1.5 transition-colors border border-[#24272e]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleExportJson}
              title="Export JSON Dossier"
              className="px-2.5 py-1 rounded bg-[#08090a] hover:bg-[#16181f] text-[#cbd5e1] text-xs font-mono flex items-center space-x-1.5 transition-colors border border-[#24272e]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              title="Copy Markdown Brief"
              className="px-2.5 py-1 rounded bg-[#08090a] hover:bg-[#16181f] text-[#cbd5e1] text-xs font-mono flex items-center space-x-1.5 transition-colors border border-[#24272e]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#16181f]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Executive Generator Trigger */}
        <div className="bg-[#08090a] border border-[#24272e] rounded p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-[#111216] border border-[#24272e] text-[#38bdf8]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#e2e8f0] font-mono">
                Gemini LLM Executive Contextualization
              </h4>
              <p className="text-[11px] text-[#94a3b8] font-sans">
                Synthesize high-level business impact, attacker motives, and CISO containment priorities.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="px-3 py-1.5 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm shrink-0 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAi ? 'Synthesizing...' : 'Generate Executive Summary'}</span>
          </button>
        </div>

        {/* AI Report Section (if generated) */}
        {aiReport && (
          <div className="bg-[#08090a] border border-[#24272e] rounded p-4 space-y-2.5 font-sans text-xs text-[#cbd5e1] leading-relaxed print:text-black print:bg-white print:border-black">
            <div className="flex items-center space-x-2 text-[#38bdf8] font-mono font-bold text-xs uppercase tracking-[0.5px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Strategic Executive Summary</span>
            </div>
            <div className="whitespace-pre-line text-[#cbd5e1] print:text-black">
              {aiReport}
            </div>
          </div>
        )}

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:grid-cols-4">
          <div className="bg-[#08090a] p-3 rounded border border-[#24272e] print:border-black print:bg-gray-50">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block print:text-black">
              Monitored IoCs
            </span>
            <span className="text-lg font-bold font-mono text-[#e2e8f0] print:text-black">
              {stats.totalIoCsMonitored}
            </span>
          </div>
          <div className="bg-[#08090a] p-3 rounded border border-[#24272e] print:border-black print:bg-gray-50">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block print:text-black">
              High-Risk Cluster
            </span>
            <span className="text-lg font-bold font-mono text-[#ef4444] print:text-black">
              {stats.highRiskIoCs}
            </span>
          </div>
          <div className="bg-[#08090a] p-3 rounded border border-[#24272e] print:border-black print:bg-gray-50">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block print:text-black">
              Honeypot Alerts
            </span>
            <span className="text-lg font-bold font-mono text-[#f59e0b] print:text-black">
              {stats.activeHoneypotAlerts}
            </span>
          </div>
          <div className="bg-[#08090a] p-3 rounded border border-[#24272e] print:border-black print:bg-gray-50">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block print:text-black">
              Ensemble Risk Conf.
            </span>
            <span className="text-lg font-bold font-mono text-[#38bdf8] print:text-black">
              {stats.avgFusionRiskScore}%
            </span>
          </div>
        </div>

        {/* Top Critical Indicators Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold font-mono text-[#94a3b8] uppercase tracking-[1px] print:text-black">
            Top Priority Critical Indicators (Threat Telemetry)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-[#24272e] print:border-black">
              <thead className="bg-[#08090a] text-[#94a3b8] text-[10px] uppercase border-b border-[#24272e] print:text-black print:bg-gray-100">
                <tr>
                  <th className="p-2">Indicator Value</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Attributed Cluster</th>
                  <th className="p-2">Origin ASN</th>
                  <th className="p-2 text-right">Fusion Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24272e] print:divide-black">
                {iocs
                  .filter(i => i.riskLevel === 'CRITICAL' || i.fusionScore >= 80)
                  .slice(0, 5)
                  .map(ioc => (
                    <tr key={ioc.id} className="print:text-black hover:bg-[#16181f]">
                      <td className="p-2 font-bold text-[#e2e8f0] print:text-black">{ioc.value}</td>
                      <td className="p-2 uppercase text-[#94a3b8] print:text-black">{ioc.type}</td>
                      <td className="p-2 text-[#38bdf8] print:text-black">
                        {ioc.threatActorAttribution || 'Heuristic Cluster'}
                      </td>
                      <td className="p-2 text-[#94a3b8] print:text-black">{ioc.asn}</td>
                      <td className="p-2 text-right font-bold text-[#ef4444] print:text-black">
                        {ioc.fusionScore}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immediate Containment Actions Checklist */}
        <div className="bg-[#08090a] p-3.5 rounded border border-[#24272e] space-y-2 print:border-black print:bg-white">
          <h4 className="text-xs font-bold font-mono text-[#38bdf8] uppercase tracking-[0.5px] print:text-black">
            Recommended Containment & Mitigation Directives
          </h4>
          <ul className="space-y-1.5 text-xs text-[#cbd5e1] font-sans print:text-black">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5 print:text-black" />
              <span>
                <strong>Perimeter Ingress Block:</strong> Implement automated firewall drops on AS48092, AS49505, and AS20847 for inbound SSH (22) and Telnet (23).
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5 print:text-black" />
              <span>
                <strong>Host Revocation:</strong> Invalidate exposed credential pairs identified in Cowrie honeypot traps (e.g., <code className="text-[#38bdf8] font-mono">admin:admin1234</code>, <code className="text-[#38bdf8] font-mono">root:toor</code>).
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5 print:text-black" />
              <span>
                <strong>Endpoint Telemetry Sweep:</strong> Hunt for dropper payload hash <code className="text-[#38bdf8] font-mono">e3b0c44298fc1c149afbf4c8996fb924...</code> across all DMZ Windows endpoints.
              </span>
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#24272e] text-[10px] font-mono text-[#94a3b8] flex items-center justify-between print:text-black">
          <span>Signed: SOC Threat Intelligence Engineering Unit</span>
          <span>ThreatLens Automated Pipeline</span>
        </div>
      </div>
    </div>
  );
};
