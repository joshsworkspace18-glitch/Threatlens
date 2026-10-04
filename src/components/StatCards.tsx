import React from 'react';
import {
  AlertOctagon,
  Radio,
  FolderGit2,
  Gauge,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DashboardStats } from '../types';

interface StatCardsProps {
  stats: DashboardStats;
  onNavigateToIocs: () => void;
  onNavigateToCases: () => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  stats,
  onNavigateToIocs,
  onNavigateToCases
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. High-Risk IoCs */}
      <div
        id="stat-card-high-risk-iocs"
        onClick={onNavigateToIocs}
        className="group relative bg-[#111216] hover:bg-[#16181f] border border-[#24272e] hover:border-[#ef4444]/60 rounded-[6px] p-3.5 transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-[#94a3b8] tracking-[1px] font-mono">
            High-Risk Indicators
          </span>
          <div className="p-1.5 rounded bg-red-950/40 border border-red-900/60 text-[#ef4444]">
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#ef4444] tracking-tight">
            {stats.highRiskIoCs}
          </span>
          <span className="inline-flex items-center text-[10px] font-semibold text-[#ef4444] bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/60 font-mono">
            <TrendingUp className="w-3 h-3 mr-1" />
            +14% in 24h
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#94a3b8] border-t border-[#24272e] pt-2 font-mono">
          <span>CRITICAL: 18</span>
          <span>HIGH: 24</span>
          <span className="text-[#38bdf8] group-hover:underline">Filter IoCs &rarr;</span>
        </div>
      </div>

      {/* 2. Active Honeypot Alerts */}
      <div
        id="stat-card-active-honeypots"
        className="relative bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-[#94a3b8] tracking-[1px] font-mono">
            Honeypot Alerts
          </span>
          <div className="relative p-1.5 rounded bg-amber-950/40 border border-amber-900/60 text-[#f59e0b]">
            <Radio className="w-3.5 h-3.5" />
            <span className="absolute top-0.5 right-0.5 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f59e0b]"></span>
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#f59e0b] tracking-tight">
            {stats.activeHoneypotAlerts}
          </span>
          <span className="text-[10px] font-mono text-[#22c55e] bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded flex items-center">
            <Zap className="w-3 h-3 mr-1 inline" /> 14 Sensors Live
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#94a3b8] border-t border-[#24272e] pt-2 font-mono">
          <span>Cowrie: 88</span>
          <span>Dionaea: 54</span>
          <span>Conpot: 45</span>
        </div>
      </div>

      {/* 3. Pending Cases */}
      <div
        id="stat-card-pending-cases"
        onClick={onNavigateToCases}
        className="group relative bg-[#111216] hover:bg-[#16181f] border border-[#24272e] hover:border-[#38bdf8]/60 rounded-[6px] p-3.5 transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-[#94a3b8] tracking-[1px] font-mono">
            Active Cases
          </span>
          <div className="p-1.5 rounded bg-sky-950/40 border border-sky-900/60 text-[#38bdf8]">
            <FolderGit2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-[#38bdf8] tracking-tight">
            {stats.pendingCases}
          </span>
          <span className="text-[10px] text-[#38bdf8] font-medium font-mono bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-800/50">
            2 P1 Critical
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#94a3b8] border-t border-[#24272e] pt-2 font-mono">
          <span>IN_PROGRESS: 4</span>
          <span>NEW: 2</span>
          <span className="text-[#38bdf8] group-hover:underline">Open Cases &rarr;</span>
        </div>
      </div>

      {/* 4. Average Fusion Risk Score */}
      <div
        id="stat-card-fusion-risk-score"
        className="relative bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-[#94a3b8] tracking-[1px] font-mono">
            Fusion Risk Score
          </span>
          <div className="p-1.5 rounded bg-slate-800/80 border border-[#24272e] text-[#e2e8f0]">
            <Gauge className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-[#e2e8f0] tracking-tight">
              {stats.avgFusionRiskScore}
            </span>
            <span className="text-[11px] font-mono text-[#94a3b8]">/100</span>
          </div>
          <span className="text-[10px] font-mono text-[#38bdf8] bg-[#111216] border border-[#38bdf8]/40 px-1.5 py-0.5 rounded">
            GNN Ensemble
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2.5 w-full bg-[#1e222a] rounded-full h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] h-1 rounded-full"
            style={{ width: `${stats.avgFusionRiskScore}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#94a3b8] font-mono">
          <span>Infra: 81.2%</span>
          <span>Behavior: 77.6%</span>
        </div>
      </div>
    </div>
  );
};
