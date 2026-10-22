import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Terminal,
  Activity,
  Server,
  Lock,
  Bot,
  Plus,
  Radio,
  Clock,
  Globe,
  Share2,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { IoCIndicator, RiskLevel } from '../types';

interface IocDetailModalProps {
  ioc: IoCIndicator | null;
  onClose: () => void;
  onTriggerAi: (ioc: IoCIndicator) => void;
  onAttachCase: (ioc: IoCIndicator) => void;
}

export const IocDetailModal: React.FC<IocDetailModalProps> = ({
  ioc,
  onClose,
  onTriggerAi,
  onAttachCase
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'behavioral' | 'ports' | 'auth' | 'commands' | 'mitre'>('behavioral');

  if (!ioc) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ioc.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'fusion-badge badge-critical';
      case 'HIGH':
        return 'fusion-badge badge-high';
      case 'MEDIUM':
        return 'fusion-badge badge-medium';
      default:
        return 'fusion-badge badge-low';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111216] border border-[#24272e] rounded-[6px] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#24272e] bg-[#08090a] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={getRiskBadge(ioc.riskLevel)}>
                {ioc.riskLevel} RISK
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111216] text-[#94a3b8] border border-[#24272e] uppercase">
                {ioc.type}
              </span>
              <span className="text-xs font-mono text-[#38bdf8]">
                Fusion Confidence: {ioc.fusionScore}%
              </span>
            </div>

            <div className="flex items-center space-x-2.5 mt-2">
              <h2 className="text-lg font-bold font-mono text-[#e2e8f0] break-all">
                {ioc.value}
              </h2>
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-1 rounded bg-[#111216] hover:bg-[#16181f] text-[#94a3b8] hover:text-[#e2e8f0] border border-[#24272e] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="text-xs text-[#94a3b8] font-mono mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Origin: {ioc.country} ({ioc.asn})</span>
              <span>Sensor: {ioc.honeypotSource}</span>
              <span>First Seen: {ioc.firstSeen}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTriggerAi(ioc)}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-[#111216] hover:bg-[#16181f] text-[#38bdf8] border border-[#38bdf8]/40 flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Contextualize</span>
            </button>
            <button
              onClick={() => onAttachCase(ioc)}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Case</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#16181f] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center space-x-1 px-5 pt-2.5 bg-[#08090a] border-b border-[#24272e] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('behavioral')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'behavioral'
                ? 'border-[#38bdf8] text-[#38bdf8] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            Connection Metrics
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'commands'
                ? 'border-[#38bdf8] text-[#38bdf8] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            <span>Shell Commands</span>
            <span className="px-1.5 rounded bg-[#ef4444]/15 text-[#ef4444] text-[10px] border border-[#ef4444]/20">
              {ioc.executedCommands.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'auth'
                ? 'border-[#38bdf8] text-[#38bdf8] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            <span>Failed Auths</span>
            <span className="px-1.5 rounded bg-[#111216] text-[#94a3b8] text-[10px] border border-[#24272e]">
              {ioc.failedAuthAttempts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ports')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'ports'
                ? 'border-[#38bdf8] text-[#38bdf8] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            <span>Port Activity</span>
            <span className="px-1.5 rounded bg-[#111216] text-[#94a3b8] text-[10px] border border-[#24272e]">
              {ioc.portActivity.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('mitre')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'mitre'
                ? 'border-[#38bdf8] text-[#38bdf8] font-bold'
                : 'border-transparent text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            MITRE Mappings ({ioc.mitreMappings.length})
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CONNECTION METRICS & FUSION DECOMPOSITION */}
          {activeTab === 'behavioral' && (
            <div className="space-y-4">
              {/* Score Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#08090a] p-3.5 rounded border border-[#24272e]">
                  <div className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-[0.5px]">
                    Infrastructure Risk Score
                  </div>
                  <div className="text-xl font-bold font-mono text-[#38bdf8] mt-1.5">
                    {ioc.infrastructureScore}%
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-1">
                    Autonomous System reputation, fast-flux history & BGP topology.
                  </p>
                </div>
                <div className="bg-[#08090a] p-3.5 rounded border border-[#24272e]">
                  <div className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-[0.5px]">
                    Behavioral Risk Score
                  </div>
                  <div className="text-xl font-bold font-mono text-[#f59e0b] mt-1.5">
                    {ioc.behavioralScore}%
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-1">
                    Normalized honeypot interaction, command execution & payload severity.
                  </p>
                </div>
                <div className="bg-[#08090a] p-3.5 rounded border border-[#38bdf8]/40 bg-[#38bdf8]/5">
                  <div className="text-[11px] font-mono text-[#38bdf8] uppercase font-bold tracking-[0.5px]">
                    Ensemble Fusion Confidence
                  </div>
                  <div className="text-xl font-bold font-mono text-[#e2e8f0] mt-1.5">
                    {ioc.fusionScore}%
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-1">
                    Graph Neural Network cross-node correlation confidence value.
                  </p>
                </div>
              </div>

              {/* Connection Profile */}
              <div className="bg-[#08090a] p-3.5 rounded border border-[#24272e] space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-[1px]">
                  Network Connection Dynamics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#94a3b8] block text-[11px]">Protocol Signature:</span>
                    <span className="text-[#e2e8f0] font-semibold">{ioc.connectionPatterns.protocol}</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block text-[11px]">Concurrent Sessions:</span>
                    <span className="text-[#e2e8f0] font-semibold">{ioc.connectionPatterns.sessionsCount}</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block text-[11px]">Avg Session Duration:</span>
                    <span className="text-[#e2e8f0] font-semibold">{ioc.connectionPatterns.durationAvgSec}s</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block text-[11px]">Burst Profile:</span>
                    <span className="text-[#38bdf8] font-semibold">{ioc.connectionPatterns.burstPattern}</span>
                  </div>
                </div>
              </div>

              {/* Associated Tags */}
              <div>
                <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-[0.5px] block mb-2">
                  Behavioral & Intelligence Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ioc.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-mono rounded bg-[#08090a] text-[#cbd5e1] border border-[#24272e]"
                    >
                      {tag}
                    </span>
                  ))}
                  {ioc.cveAssociations?.map((cve, idx) => (
                    <span
                      key={`cve-${idx}`}
                      className="px-2 py-0.5 text-xs font-mono rounded bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30"
                    >
                      {cve}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXECUTED COMMANDS */}
          {activeTab === 'commands' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-[0.5px]">
                  Captured Shell Sessions (Honeypot Trap)
                </h4>
                <span className="text-xs text-[#94a3b8] font-mono">
                  Ordered by execution sequence
                </span>
              </div>

              {ioc.executedCommands.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#94a3b8] bg-[#08090a] rounded border border-[#24272e]">
                  No interactive commands executed in honeypot sandbox for this indicator.
                </div>
              ) : (
                <div className="space-y-2 font-mono">
                  {ioc.executedCommands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="bg-[#08090a] border border-[#24272e] rounded p-3 space-y-1.5 hover:border-[#38bdf8]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#94a3b8]">[{cmd.timestamp}]</span>
                        <div className="flex items-center space-x-2">
                          {cmd.category && (
                            <span className="px-1.5 py-0.2 rounded bg-[#111216] text-[#94a3b8] text-[10px] border border-[#24272e]">
                              {cmd.category}
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              cmd.riskScore > 90
                                ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                                : 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30'
                            }`}
                          >
                            Risk: {cmd.riskScore}/100
                          </span>
                        </div>
                      </div>
                      <div className="text-[#38bdf8] text-xs bg-[#111216] p-2 rounded border border-[#24272e] break-all font-mono">
                        $ {cmd.command}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAILED AUTH ATTEMPTS */}
          {activeTab === 'auth' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-[0.5px]">
                  Brute Force & Credential Stuffing Intercepts
                </h4>
                <span className="text-xs text-[#94a3b8] font-mono">
                  {ioc.failedAuthAttempts.length} Interceptions
                </span>
              </div>

              {ioc.failedAuthAttempts.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#94a3b8] bg-[#08090a] rounded border border-[#24272e]">
                  No failed authentication attempts registered.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#08090a] text-[#94a3b8] uppercase text-[10px] border-b border-[#24272e]">
                      <tr>
                        <th className="py-2 px-3">Time</th>
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3">Username Injected</th>
                        <th className="py-2 px-3">Password / Hash Payload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24272e]">
                      {ioc.failedAuthAttempts.map((attempt, idx) => (
                        <tr key={idx} className="hover:bg-[#16181f]">
                          <td className="py-2 px-3 text-[#94a3b8]">{attempt.timestamp}</td>
                          <td className="py-2 px-3 text-[#38bdf8]">{attempt.service}</td>
                          <td className="py-2 px-3 font-bold text-[#e2e8f0]">{attempt.username}</td>
                          <td className="py-2 px-3 text-[#ef4444] font-mono bg-[#ef4444]/5 rounded">
                            {attempt.passwordSnippet}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PORT ACTIVITY */}
          {activeTab === 'ports' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-[0.5px]">
                Observed Port Ingress Probes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ioc.portActivity.map((port, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#08090a] border border-[#24272e] rounded space-y-1 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#38bdf8]">Port {port.port}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          port.status === 'OPEN'
                            ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                            : port.status === 'HONEYPOT_EMULATED'
                            ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30'
                            : 'bg-[#111216] text-[#94a3b8]'
                        }`}
                      >
                        {port.status}
                      </span>
                    </div>
                    <div className="text-[#cbd5e1] text-[11px] truncate">
                      {port.service}
                    </div>
                    <div className="text-[10px] text-[#94a3b8] pt-1 border-t border-[#24272e]">
                      Total Hits: {port.hits.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MITRE ATT&CK MAPPINGS */}
          {activeTab === 'mitre' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-[0.5px]">
                Tagged ATT&CK Tactics & Techniques
              </h4>
              <div className="space-y-2 font-mono">
                {ioc.mitreMappings.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#08090a] border border-[#24272e] rounded space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.2 rounded bg-[#111216] text-[#38bdf8] border border-[#24272e] text-[10px]">
                          {m.tactic} ({m.tacticId})
                        </span>
                        <span className="font-bold text-[#e2e8f0]">
                          {m.technique} [{m.techniqueId}]
                        </span>
                      </div>
                      <span className="text-[#38bdf8] text-[11px] font-bold">
                        {m.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-[#94a3b8] font-sans text-xs pt-1">
                      Evidence: {m.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#24272e] bg-[#08090a] flex items-center justify-between text-xs font-mono text-[#94a3b8]">
          <div>
            Threat Cluster: <span className="text-[#e2e8f0]">{ioc.gnnClusterId || 'Independent Node'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-[#111216] hover:bg-[#16181f] text-[#cbd5e1] border border-[#24272e] transition-colors font-mono text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
