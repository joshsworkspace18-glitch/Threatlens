import React from 'react';
import {
  ShieldAlert,
  Sliders,
  FileText,
  UserCheck,
  Server,
  Activity,
  Radar,
  Radio
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface HeaderProps {
  user: UserProfile;
  onRoleChange: (role: UserRole) => void;
  onOpenReportModal: () => void;
  activeTab: 'overview' | 'iocs' | 'mitre' | 'cases' | 'admin';
  setActiveTab: (tab: 'overview' | 'iocs' | 'mitre' | 'cases' | 'admin') => void;
  honeypotAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onRoleChange,
  onOpenReportModal,
  activeTab,
  setActiveTab,
  honeypotAlertCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0a0a0c] to-[#111216] border-b border-[#24272e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#111216] border border-[#38bdf8]/40 text-[#38bdf8]">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22c55e]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-[2px] text-[#38bdf8] font-mono">
                  THREATLENS
                </span>
                <span className="text-[10px] font-light font-mono text-[#94a3b8] opacity-60">
                  V3.4_STABLE
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] hidden lg:block leading-tight">
                Unified IoC & Honeypot Telemetry Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#08090a] p-1 rounded border border-[#24272e]">
            <button
              id="nav-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center space-x-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40 font-semibold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111216]'
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              id="nav-tab-iocs"
              onClick={() => setActiveTab('iocs')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center space-x-1.5 ${
                activeTab === 'iocs'
                  ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40 font-semibold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111216]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>IoC Pipeline</span>
            </button>
            <button
              id="nav-tab-mitre"
              onClick={() => setActiveTab('mitre')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center space-x-1.5 ${
                activeTab === 'mitre'
                  ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40 font-semibold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111216]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>MITRE ATT&CK</span>
            </button>
            <button
              id="nav-tab-cases"
              onClick={() => setActiveTab('cases')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center space-x-1.5 ${
                activeTab === 'cases'
                  ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40 font-semibold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111216]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Case Workbench</span>
            </button>
            {user.role === 'ADMIN' && (
              <button
                id="nav-tab-admin"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-amber-400/80 hover:text-amber-200 hover:bg-[#111216]'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Sensor Ops</span>
              </button>
            )}
          </nav>

          {/* Right Action Utilities & RBAC */}
          <div className="flex items-center space-x-3">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-[#1a1b20] px-3 py-1 rounded-full border border-[#24272e] text-[#94a3b8]">
              <span className="text-[#22c55e]">●</span>
              <span className="font-mono text-[11px] text-[#e2e8f0]">SYSTEM ONLINE</span>
              <span className="opacity-40">|</span>
              <span className="font-mono text-[11px] text-[#94a3b8]">
                ROLE: {user.role === 'ADMIN' ? 'SOC_LEAD' : 'SENIOR_ANALYST'}
              </span>
            </div>

            {/* Executive Report Generator Trigger */}
            <button
              id="btn-generate-report"
              onClick={onOpenReportModal}
              className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black border-none px-3 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm tracking-wide"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EXEC REPORT</span>
            </button>

            {/* Simulated RBAC Toggle */}
            <div className="flex items-center bg-[#111216] border border-[#24272e] rounded p-0.5 text-xs">
              <button
                id="rbac-toggle-analyst"
                onClick={() => onRoleChange('ANALYST')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  user.role === 'ANALYST'
                    ? 'bg-[#1e222a] text-[#38bdf8] font-bold border border-[#38bdf8]/30'
                    : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                Analyst
              </button>
              <button
                id="rbac-toggle-admin"
                onClick={() => onRoleChange('ADMIN')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  user.role === 'ADMIN'
                    ? 'bg-amber-950/70 text-amber-300 font-bold border border-amber-600/40'
                    : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#24272e] overflow-x-auto bg-[#08090a]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'overview' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('iocs')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'iocs' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'
            }`}
          >
            IoC Pipeline
          </button>
          <button
            onClick={() => setActiveTab('mitre')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'mitre' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'
            }`}
          >
            MITRE ATT&CK
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'cases' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'
            }`}
          >
            Cases
          </button>
          {user.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-[#94a3b8]'
              }`}
            >
              Sensor Ops
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
