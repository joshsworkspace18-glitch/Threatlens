import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  Bot,
  Plus,
  Radio,
  Globe,
  Hash,
  Layers
} from 'lucide-react';
import { IoCIndicator, IndicatorType, RiskLevel } from '../types';

interface IocTableProps {
  iocs: IoCIndicator[];
  onSelectIoc: (ioc: IoCIndicator) => void;
  onContextualizeAi: (ioc: IoCIndicator) => void;
  onAddToCase: (ioc: IoCIndicator) => void;
}

export const IocTable: React.FC<IocTableProps> = ({
  iocs,
  onSelectIoc,
  onContextualizeAi,
  onAddToCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<IndicatorType | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'fusionScore' | 'infrastructureScore' | 'behavioralScore'>('fusionScore');
  const [sortDesc, setSortDesc] = useState(true);

  // Filter & Search logic
  const filteredIocs = iocs
    .filter(ioc => {
      if (typeFilter !== 'all' && ioc.type !== typeFilter) return false;
      if (riskFilter !== 'all' && ioc.riskLevel !== riskFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          ioc.value.toLowerCase().includes(q) ||
          ioc.asn.toLowerCase().includes(q) ||
          ioc.country.toLowerCase().includes(q) ||
          (ioc.threatActorAttribution && ioc.threatActorAttribution.toLowerCase().includes(q)) ||
          ioc.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortDesc ? valB - valA : valA - valB;
    });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'badge-critical';
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      case 'LOW':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const getTypeIcon = (type: IndicatorType) => {
    switch (type) {
      case 'ip':
        return <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />;
      case 'domain':
        return <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />;
      case 'hash':
        return <Hash className="w-3.5 h-3.5 text-[#f59e0b]" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-[#94a3b8]" />;
    }
  };

  return (
    <div className="bg-[#111216] border border-[#24272e] rounded-[6px] overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-3 border-b border-[#24272e] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-[#111216]">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              id="search-ioc-input"
              type="text"
              placeholder="Search by IP, Domain, Hash, ASN, Threat Actor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#08090a] border border-[#24272e] rounded text-xs text-[#e2e8f0] placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#38bdf8] font-mono"
            />
          </div>
          <span className="text-[11px] text-[#94a3b8] font-mono whitespace-nowrap">
            {filteredIocs.length} of {iocs.length} IoCs
          </span>
        </div>

        {/* Filter Badges & Sorters */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Type Filter */}
          <div className="flex items-center bg-[#08090a] rounded p-0.5 border border-[#24272e] text-xs">
            {(['all', 'ip', 'domain', 'hash'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
                  typeFilter === t ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center bg-[#08090a] rounded p-0.5 border border-[#24272e] text-xs">
            {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
                  riskFilter === r ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Sort trigger */}
          <button
            onClick={() => {
              if (sortBy === 'fusionScore') {
                setSortDesc(!sortDesc);
              } else {
                setSortBy('fusionScore');
                setSortDesc(true);
              }
            }}
            className="px-2.5 py-1 text-[11px] font-mono rounded bg-[#08090a] border border-[#24272e] hover:border-[#38bdf8]/40 text-[#94a3b8] hover:text-[#e2e8f0] flex items-center space-x-1"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>Sort Fusion {sortDesc ? '▼' : '▲'}</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#111216] text-[#94a3b8] font-mono uppercase text-[10px] border-b border-[#24272e]">
            <tr>
              <th className="py-2.5 px-3">Indicator / Value</th>
              <th className="py-2.5 px-3">Origin / ASN</th>
              <th className="py-2.5 px-3 text-right">Infra Score</th>
              <th className="py-2.5 px-3 text-right">Behavioral</th>
              <th className="py-2.5 px-3">Fusion Risk Confidence</th>
              <th className="py-2.5 px-3">Source Telemetry</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16181e]">
            {filteredIocs.map(ioc => (
              <tr
                key={ioc.id}
                className="hover:bg-[#16181f] transition-colors group cursor-pointer"
                onClick={() => onSelectIoc(ioc)}
              >
                {/* Indicator Value & Type */}
                <td className="py-2.5 px-3">
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5 p-1 rounded bg-[#08090a] border border-[#24272e]">
                      {getTypeIcon(ioc.type)}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[#38bdf8] group-hover:underline transition-colors">
                        {ioc.value}
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="tag uppercase">
                          {ioc.type}
                        </span>
                        {ioc.threatActorAttribution && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40">
                            {ioc.threatActorAttribution}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* ASN / Origin */}
                <td className="py-2.5 px-3">
                  <div className="text-[#e2e8f0] font-mono text-[11px]">
                    {ioc.country} [{ioc.countryCode}]
                  </div>
                  <div className="text-[#94a3b8] text-[10px] font-mono truncate max-w-[180px]">
                    {ioc.asn}
                  </div>
                </td>

                {/* Infrastructure Score */}
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className="text-[#e2e8f0] font-semibold">{ioc.infrastructureScore}%</span>
                  <div className="w-14 bg-[#1e222a] h-1 rounded-full ml-auto mt-1 overflow-hidden">
                    <div
                      className="bg-[#38bdf8] h-1 rounded-full"
                      style={{ width: `${ioc.infrastructureScore}%` }}
                    />
                  </div>
                </td>

                {/* Behavioral Score */}
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className="text-[#e2e8f0] font-semibold">{ioc.behavioralScore}%</span>
                  <div className="w-14 bg-[#1e222a] h-1 rounded-full ml-auto mt-1 overflow-hidden">
                    <div
                      className="bg-[#f59e0b] h-1 rounded-full"
                      style={{ width: `${ioc.behavioralScore}%` }}
                    />
                  </div>
                </td>

                {/* Fusion Risk Confidence Value */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`fusion-badge ${getRiskBadge(
                        ioc.riskLevel
                      )}`}
                    >
                      {ioc.fusionScore}% {ioc.riskLevel}
                    </span>
                  </div>
                  <div className="w-32 bg-[#1e222a] h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-1 rounded-full ${
                        ioc.fusionScore >= 90
                          ? 'bg-[#ef4444]'
                          : ioc.fusionScore >= 75
                          ? 'bg-[#f59e0b]'
                          : ioc.fusionScore >= 50
                          ? 'bg-[#eab308]'
                          : 'bg-[#22c55e]'
                      }`}
                      style={{ width: `${ioc.fusionScore}%` }}
                    />
                  </div>
                </td>

                {/* Source Telemetry */}
                <td className="py-2.5 px-3">
                  <div className="text-[#e2e8f0] text-[11px] font-mono">
                    {ioc.honeypotSource}
                  </div>
                  <div className="text-[#94a3b8] text-[10px] font-mono">
                    Last active: {ioc.lastActive}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-2.5 px-3 text-right">
                  <div
                    className="flex items-center justify-end space-x-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onSelectIoc(ioc)}
                      title="Deep Behavioral Inspection"
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#08090a] hover:bg-[#16181f] text-[#38bdf8] border border-[#24272e] hover:border-[#38bdf8]/40 transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => onContextualizeAi(ioc)}
                      title="AI MITRE Contextualization"
                      className="p-1 text-[10px] rounded bg-[#08090a] hover:bg-[#16181f] text-[#a855f7] border border-[#24272e] transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onAddToCase(ioc)}
                      title="Add to Active Case"
                      className="p-1 text-[10px] rounded bg-[#08090a] hover:bg-[#16181f] text-[#94a3b8] hover:text-[#e2e8f0] border border-[#24272e] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-2.5 border-t border-[#24272e] bg-[#111216] flex items-center justify-between text-[10px] text-[#94a3b8] font-mono">
        <div>
          Ensemble Algorithm: GNN Topology + Honeypot Payload Heuristics
        </div>
        <div>
          Showing {filteredIocs.length} verified indicators
        </div>
      </div>
    </div>
  );
};
