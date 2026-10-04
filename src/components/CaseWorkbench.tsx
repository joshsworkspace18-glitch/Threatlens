import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  FileText
} from 'lucide-react';
import { InvestigationCase, IoCIndicator, RiskLevel } from '../types';
import { TimelineInvestigation } from './TimelineInvestigation';

interface CaseWorkbenchProps {
  cases: InvestigationCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onOpenCreateCaseModal: () => void;
  onUpdateCaseStatus: (caseId: string, status: InvestigationCase['status']) => void;
  onUpdateCasePriority: (caseId: string, priority: number) => void;
  onAddTimelineEvent: (caseId: string, eventData: any) => void;
  allIocs: IoCIndicator[];
  onInspectIoc: (ioc: IoCIndicator) => void;
}

export const CaseWorkbench: React.FC<CaseWorkbenchProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onOpenCreateCaseModal,
  onUpdateCaseStatus,
  onUpdateCasePriority,
  onAddTimelineEvent,
  allIocs,
  onInspectIoc
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
    return true;
  });

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const getSeverityBadge = (sev: RiskLevel) => {
    switch (sev) {
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

  const getStatusBadge = (status: InvestigationCase['status']) => {
    switch (status) {
      case 'NEW':
        return 'tag text-[#38bdf8] border-[#38bdf8]/30';
      case 'IN_PROGRESS':
        return 'tag text-[#f59e0b] border-[#f59e0b]/30';
      case 'CONTAINED':
        return 'tag text-[#22c55e] border-[#22c55e]/30';
      case 'CLOSED':
        return 'tag text-[#94a3b8] border-[#24272e]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Workbench Header & Quick Actions */}
      <div className="bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="text-sm font-bold font-mono text-[#e2e8f0] uppercase tracking-[0.5px]">
              SOC Investigation Workbench & Case Management
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Track multi-stage intrusion campaigns, cross-correlate honeypot artifacts, and coordinate containment workflows.
          </p>
        </div>

        <button
          id="btn-create-case-trigger"
          onClick={onOpenCreateCaseModal}
          className="px-3 py-1.5 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Investigation Case</span>
        </button>
      </div>

      {/* Main Grid: Left is Case Selector / Filters (4 cols), Right is Active Case Workbench & Timeline (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cases List Sidebar - 4 cols */}
        <div className="lg:col-span-4 bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-[#24272e] pb-2.5">
            <h3 className="text-xs font-bold font-mono text-[#94a3b8] uppercase tracking-[1px]">
              Cases Docket ({filteredCases.length})
            </h3>
            {/* Filter pills */}
            <div className="flex items-center space-x-1 bg-[#08090a] p-0.5 rounded border border-[#24272e] text-[10px] font-mono">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-1.5 py-0.5 rounded ${statusFilter === 'all' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={`px-1.5 py-0.5 rounded ${statusFilter === 'IN_PROGRESS' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('NEW')}
                className={`px-1.5 py-0.5 rounded ${statusFilter === 'NEW' ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
              >
                New
              </button>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-2 overflow-y-auto max-h-[700px] pr-1">
            {filteredCases.map(c => {
              const isSelected = activeCase && activeCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#16181f] border-[#38bdf8]'
                      : 'bg-[#08090a] border-[#24272e] hover:border-[#38bdf8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#38bdf8]">{c.caseNumber}</span>
                    <div className="flex items-center space-x-1">
                      <span className={getStatusBadge(c.status)}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className={getSeverityBadge(c.severity)}>
                        {c.severity}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-[#e2e8f0] line-clamp-1 mb-1 font-sans">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-[#94a3b8] font-sans line-clamp-2 mb-2">
                    {c.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] pt-1.5 border-t border-[#24272e]">
                    <span>{c.sector}</span>
                    <span>{c.timelineEvents.length} Events</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Case Workspace & Timeline - 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {activeCase ? (
            <>
              {/* Active Case Detail Header */}
              <div className="bg-[#111216] border border-[#24272e] rounded-[6px] p-4 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#38bdf8] bg-[#08090a] px-2 py-0.5 rounded border border-[#24272e]">
                        {activeCase.caseNumber}
                      </span>
                      <span className="text-xs font-mono text-[#94a3b8]">
                        Target Sector: <strong className="text-[#e2e8f0]">{activeCase.sector}</strong>
                      </span>
                      <span className="text-xs font-mono text-[#94a3b8]">
                        Updated {activeCase.updatedAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#e2e8f0] mt-1.5 font-mono">
                      {activeCase.title}
                    </h3>
                  </div>

                  {/* Workflow Selectors */}
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    {/* Status Dropdown */}
                    <div>
                      <label className="text-[10px] text-[#94a3b8] block">Status:</label>
                      <select
                        value={activeCase.status}
                        onChange={e =>
                          onUpdateCaseStatus(activeCase.id, e.target.value as InvestigationCase['status'])
                        }
                        className="bg-[#08090a] border border-[#24272e] rounded px-2 py-1 text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CONTAINED">CONTAINED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>

                    {/* Priority Dropdown */}
                    <div>
                      <label className="text-[10px] text-[#94a3b8] block">Priority:</label>
                      <select
                        value={activeCase.priority}
                        onChange={e => onUpdateCasePriority(activeCase.id, Number(e.target.value))}
                        className="bg-[#08090a] border border-[#24272e] rounded px-2 py-1 text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
                      >
                        <option value={1}>P1 - Critical</option>
                        <option value={2}>P2 - High</option>
                        <option value={3}>P3 - Medium</option>
                        <option value={4}>P4 - Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#cbd5e1] font-sans leading-relaxed">
                  {activeCase.description}
                </p>

                {/* Correlated IoC Indicators Chips */}
                <div className="pt-2 border-t border-[#24272e] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="text-[#94a3b8]">Attached Indicators:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCase.iocIds.map((iocId, idx) => {
                        const foundIoc = allIocs.find(i => i.id === iocId || i.value === iocId);
                        const displayVal = foundIoc ? foundIoc.value : iocId;
                        return (
                          <span
                            key={idx}
                            onClick={() => foundIoc && onInspectIoc(foundIoc)}
                            className="px-2 py-0.5 rounded bg-[#08090a] text-[#38bdf8] border border-[#24272e] hover:border-[#38bdf8]/50 cursor-pointer flex items-center space-x-1"
                          >
                            <span>{displayVal}</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-[#94a3b8]">
                    Lead Investigator: <span className="text-[#e2e8f0] font-bold">{activeCase.assignee}</span>
                  </div>
                </div>
              </div>

              {/* Vertical Timeline Component */}
              <TimelineInvestigation
                currentCase={activeCase}
                onAddEvent={evtData => onAddTimelineEvent(activeCase.id, evtData)}
              />
            </>
          ) : (
            <div className="p-12 text-center text-[#94a3b8] font-mono bg-[#111216] rounded-[6px] border border-[#24272e]">
              Select a case from the docket or create a new investigation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
