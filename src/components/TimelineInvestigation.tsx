import React, { useState } from 'react';
import {
  Clock,
  AlertOctagon,
  ShieldCheck,
  PlusCircle,
  FileText,
  Radio,
  Tag,
  MessageSquare
} from 'lucide-react';
import { TimelineEvent, InvestigationCase, RiskLevel } from '../types';

interface TimelineInvestigationProps {
  currentCase: InvestigationCase;
  onAddEvent: (eventData: {
    title: string;
    details: string;
    stage: string;
    severity: RiskLevel;
    sourceIoC?: string;
    analystNote?: string;
  }) => void;
}

export const TimelineInvestigation: React.FC<TimelineInvestigationProps> = ({
  currentCase,
  onAddEvent
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newStage, setNewStage] = useState('Analyst Finding');
  const [newSeverity, setNewSeverity] = useState<RiskLevel>('HIGH');
  const [newSourceIoC, setNewSourceIoC] = useState('');
  const [newAnalystNote, setNewAnalystNote] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddEvent({
      title: newTitle,
      details: newDetails,
      stage: newStage,
      severity: newSeverity,
      sourceIoC: newSourceIoC || undefined,
      analystNote: newAnalystNote || undefined
    });

    setNewTitle('');
    setNewDetails('');
    setNewSourceIoC('');
    setNewAnalystNote('');
    setShowAddForm(false);
  };

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

  return (
    <div className="bg-[#111216] border border-[#24272e] rounded-[6px] p-4 space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between border-b border-[#24272e] pb-2.5 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#38bdf8]" />
          <div>
            <h3 className="text-xs font-bold font-mono text-[#94a3b8] uppercase tracking-[1px]">
              Correlated Attack Sequence Timeline
            </h3>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              Case {currentCase.caseNumber}: {currentCase.title}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Log Evidence'}</span>
        </button>
      </div>

      {/* Optional In-line Add Event Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateEvent}
          className="bg-[#08090a] p-3.5 rounded border border-[#24272e] space-y-2.5 font-mono text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#38bdf8] uppercase text-[11px]">
              Append Correlated Finding to Timeline
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[#94a3b8] hover:text-[#e2e8f0]"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[#94a3b8] block mb-1 text-[11px]">Stage / Phase:</label>
              <input
                type="text"
                value={newStage}
                onChange={e => setNewStage(e.target.value)}
                className="w-full bg-[#111216] border border-[#24272e] rounded px-2.5 py-1 text-[#e2e8f0]"
                placeholder="e.g. C2 Beacon, Lateral Scan"
                required
              />
            </div>
            <div>
              <label className="text-[#94a3b8] block mb-1 text-[11px]">Severity:</label>
              <select
                value={newSeverity}
                onChange={e => setNewSeverity(e.target.value as RiskLevel)}
                className="w-full bg-[#111216] border border-[#24272e] rounded px-2.5 py-1 text-[#e2e8f0]"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div>
              <label className="text-[#94a3b8] block mb-1 text-[11px]">Correlated IoC (Optional):</label>
              <input
                type="text"
                value={newSourceIoC}
                onChange={e => setNewSourceIoC(e.target.value)}
                className="w-full bg-[#111216] border border-[#24272e] rounded px-2.5 py-1 text-[#e2e8f0]"
                placeholder="e.g. 194.26.29.114"
              />
            </div>
          </div>

          <div>
            <label className="text-[#94a3b8] block mb-1 text-[11px]">Event Title:</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-[#111216] border border-[#24272e] rounded px-2.5 py-1 text-[#e2e8f0]"
              placeholder="e.g. Memory Dump Intercepted on Edge Controller"
              required
            />
          </div>

          <div>
            <label className="text-[#94a3b8] block mb-1 text-[11px]">Technical Observation / Evidence:</label>
            <textarea
              value={newDetails}
              onChange={e => setNewDetails(e.target.value)}
              rows={2}
              className="w-full bg-[#111216] border border-[#24272e] rounded px-2.5 py-1 text-[#cbd5e1] font-sans text-xs"
              placeholder="Describe payload characteristics, network hashes, or observed behavior..."
              required
            />
          </div>

          <div>
            <label className="text-[#94a3b8] block mb-1 text-[11px]">Analyst Mitigation Note:</label>
            <input
              type="text"
              value={newAnalystNote}
              onChange={e => setNewAnalystNote(e.target.value)}
              className="w-full bg-[#111216] border border-[#24272e] rounded px-2.5 py-1 text-[#cbd5e1] font-sans text-xs"
              placeholder="e.g. Host isolated from production network, BGP route withdrawn."
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-3.5 py-1 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-bold transition-colors text-xs font-mono"
            >
              Commit Event to Timeline
            </button>
          </div>
        </form>
      )}

      {/* Vertical Timeline Component */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#24272e]">
        {currentCase.timelineEvents.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#111216] flex items-center justify-center ${
                evt.severity === 'CRITICAL'
                  ? 'bg-[#ef4444]'
                  : evt.severity === 'HIGH'
                  ? 'bg-[#f59e0b]'
                  : evt.severity === 'MEDIUM'
                  ? 'bg-[#eab308]'
                  : 'bg-[#22c55e]'
              }`}
            />

            {/* Timeline Event Card */}
            <div className="bg-[#08090a] border border-[#24272e] group-hover:border-[#38bdf8]/40 rounded p-3 transition-all space-y-1.5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111216] text-[#38bdf8] border border-[#24272e]">
                      {evt.stage}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${getSeverityBadge(
                        evt.severity
                      )}`}
                    >
                      {evt.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#e2e8f0] font-mono mt-1">
                    {evt.title}
                  </h4>
                </div>

                <span className="text-[10px] font-mono text-[#94a3b8]">
                  {evt.timestamp}
                </span>
              </div>

              <p className="text-xs text-[#cbd5e1] font-sans leading-relaxed">
                {evt.details}
              </p>

              {/* Tags, IoC & Tactics */}
              <div className="flex flex-wrap items-center gap-1 pt-1 text-[10px] font-mono">
                {evt.sourceIoC && (
                  <span className="px-1.5 py-0.2 rounded bg-[#111216] text-[#38bdf8] border border-[#24272e] flex items-center space-x-1">
                    <Tag className="w-2.5 h-2.5" />
                    <span>IoC: {evt.sourceIoC}</span>
                  </span>
                )}
                {evt.tactics?.map((tac, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-1.5 py-0.2 rounded bg-[#111216] text-[#cbd5e1] border border-[#24272e]"
                  >
                    {tac}
                  </span>
                ))}
              </div>

              {/* Analyst Note Callout */}
              {evt.analystNote && (
                <div className="mt-1.5 bg-[#16181f] border border-[#24272e] rounded p-2 text-xs text-[#cbd5e1] flex items-start space-x-2 font-sans">
                  <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-[#38bdf8] font-bold block uppercase">
                      Analyst Action Note:
                    </span>
                    <span>{evt.analystNote}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
