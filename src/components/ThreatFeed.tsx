import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Filter,
  Terminal,
  Radio,
  ExternalLink,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { ThreatFeedItem, IndicatorType } from '../types';

interface ThreatFeedProps {
  feedItems: ThreatFeedItem[];
  onSelectIndicator: (indicatorValue: string) => void;
  onSimulateInbound: () => void;
  isSimulating?: boolean;
}

export const ThreatFeed: React.FC<ThreatFeedProps> = ({
  feedItems,
  onSelectIndicator,
  onSimulateInbound,
  isSimulating = false
}) => {
  const [isLive, setIsLive] = useState(true);
  const [filterType, setFilterType] = useState<IndicatorType | 'all'>('all');

  const filteredItems = feedItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'badge-critical';
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      default:
        return 'badge-low';
    }
  };

  return (
    <div className="bg-[#111216] border border-[#24272e] rounded-[6px] flex flex-col h-[480px]">
      {/* Feed Header */}
      <div className="px-3.5 py-2.5 border-b border-[#24272e] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Radio className="w-3.5 h-3.5 text-[#38bdf8]" />
            {isLive && (
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#38bdf8]"></span>
              </span>
            )}
          </div>
          <h3 className="text-xs font-bold uppercase text-[#94a3b8] tracking-[1px] font-mono">
            Honeypot Inbound Feed
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#16181f] text-[#94a3b8] border border-[#24272e]">
            {feedItems.length} Events
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-[#08090a] rounded p-0.5 border border-[#24272e] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                filterType === 'all' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('ip')}
              className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                filterType === 'ip' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              IP
            </button>
            <button
              onClick={() => setFilterType('domain')}
              className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                filterType === 'domain' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              Domain
            </button>
            <button
              onClick={() => setFilterType('hash')}
              className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                filterType === 'hash' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              Hash
            </button>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsLive(!isLive)}
            title={isLive ? 'Pause Stream' : 'Resume Stream'}
            className="p-1 rounded bg-[#08090a] hover:bg-[#16181f] text-[#94a3b8] border border-[#24272e] transition-colors"
          >
            {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-[#22c55e]" />}
          </button>

          {/* Simulate Event button */}
          <button
            id="btn-simulate-inbound"
            onClick={onSimulateInbound}
            disabled={isSimulating}
            className="px-2 py-1 text-[11px] font-mono rounded bg-[#08090a] hover:bg-[#16181f] border border-[#24272e] text-[#38bdf8] flex items-center space-x-1 transition-all active:scale-95 disabled:opacity-50"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Simulate</span>
          </button>
        </div>
      </div>

      {/* Real-time Ticker / Feed List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1b1e26] p-1.5 space-y-1">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectIndicator(item.indicator)}
            className="group p-2 rounded hover:bg-[#16181f] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`fusion-badge text-[10px] ${getSeverityBadge(
                    item.normalizedSeverity
                  )}`}
                >
                  {item.normalizedSeverity}
                </span>
                <span className="font-mono font-medium text-[#e2e8f0] group-hover:text-[#38bdf8] transition-colors">
                  {item.indicator.length > 32
                    ? `${item.indicator.substring(0, 16)}...${item.indicator.substring(item.indicator.length - 8)}`
                    : item.indicator}
                </span>
                <span className="tag uppercase">
                  {item.type}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-[#94a3b8] font-mono">
                <span>{item.timestamp}</span>
                <span className="text-[#64748b]">[{item.countryCode}]</span>
              </div>
            </div>

            <p className="text-xs text-[#cbd5e1] font-sans line-clamp-1 mb-1">
              {item.rawEvent}
            </p>

            {item.payloadPreview && (
              <div className="bg-[#08090a] rounded p-1 font-mono text-[10px] text-[#38bdf8] border border-[#24272e] flex items-center justify-between">
                <span className="truncate pr-2">{item.payloadPreview}</span>
                <span className="text-[#94a3b8] shrink-0">Port: {item.port}</span>
              </div>
            )}

            <div className="mt-1 flex items-center justify-between text-[10px] text-[#94a3b8] font-mono">
              <span>Sensor: {item.honeypotName}</span>
              <span className="text-[#38bdf8] group-hover:underline flex items-center">
                Investigate <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Footer Bar */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Normalized Honeypot Stream Active</span>
        </div>
        <span>Buffer: {filteredItems.length} records</span>
      </div>
    </div>
  );
};
