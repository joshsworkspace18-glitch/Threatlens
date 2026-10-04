export type IndicatorType = 'ip' | 'domain' | 'hash' | 'url';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type UserRole = 'ANALYST' | 'ADMIN';

export interface FailedAuthAttempt {
  timestamp: string;
  username: string;
  passwordSnippet: string;
  service: string;
}

export interface PortActivity {
  port: number;
  service: string;
  hits: number;
  status: 'OPEN' | 'FILTERED' | 'HONEYPOT_EMULATED';
}

export interface ExecutedCommand {
  timestamp: string;
  command: string;
  riskScore: number;
  category?: string;
}

export interface MitreMapping {
  tactic: string;
  tacticId: string;
  technique: string;
  techniqueId: string;
  confidence: number;
  evidence: string;
}

export interface ConnectionPatterns {
  protocol: string;
  sessionsCount: number;
  durationAvgSec: number;
  payloadTransferredKb: number;
  burstPattern: 'Sustained' | 'Periodic Beacon' | 'Volumetric Burst' | 'Stealth Low-Frequency';
}

export interface IoCIndicator {
  id: string;
  value: string;
  type: IndicatorType;
  infrastructureScore: number; // 0 - 100
  behavioralScore: number;     // 0 - 100
  fusionScore: number;         // 0 - 100 (weighted ensemble)
  riskLevel: RiskLevel;
  asn: string;
  country: string;
  countryCode: string;
  firstSeen: string;
  lastActive: string;
  honeypotSource: string;
  tags: string[];
  connectionPatterns: ConnectionPatterns;
  failedAuthAttempts: FailedAuthAttempt[];
  portActivity: PortActivity[];
  executedCommands: ExecutedCommand[];
  mitreMappings: MitreMapping[];
  gnnClusterId?: string;
  threatActorAttribution?: string;
  cveAssociations?: string[];
}

export interface GNNNode {
  id: string;
  label: string;
  type: 'ioc' | 'asn' | 'pdns' | 'malware' | 'c2';
  riskScore: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  details?: string;
  degree?: number;
}

export interface GNNEdge {
  id: string;
  source: string;
  target: string;
  relation: 'hosted_on' | 'resolves_to' | 'drops_hash' | 'shares_cert' | 'beacon_target';
  confidence: number;
}

export interface ThreatFeedItem {
  id: string;
  timestamp: string;
  indicator: string;
  type: IndicatorType;
  honeypotName: string;
  rawEvent: string;
  normalizedSeverity: RiskLevel;
  port: number;
  payloadPreview?: string;
  countryCode: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  stage: string;
  title: string;
  details: string;
  severity: RiskLevel;
  sourceIoC?: string;
  tactics?: string[];
  analystNote?: string;
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  severity: RiskLevel;
  status: 'NEW' | 'IN_PROGRESS' | 'CONTAINED' | 'CLOSED';
  priority: number; // 1 (highest) to 4 (lowest)
  assignee: string;
  createdAt: string;
  updatedAt: string;
  iocIds: string[];
  sector: string;
  timelineEvents: TimelineEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clearance: string;
  unit: string;
  activeSessionExpiry: string;
}

export interface MitreTacticGroup {
  tacticId: string;
  tacticName: string;
  description: string;
  techniques: {
    id: string;
    name: string;
    description: string;
    detectedCount: number;
    associatedIoCs: string[];
  }[];
}

export interface DashboardStats {
  highRiskIoCs: number;
  activeHoneypotAlerts: number;
  pendingCases: number;
  avgFusionRiskScore: number;
  totalIoCsMonitored: number;
  honeypotsOnline: number;
}
