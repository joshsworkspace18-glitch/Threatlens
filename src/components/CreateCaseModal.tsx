import React, { useState } from 'react';
import { X, FolderPlus, ShieldAlert } from 'lucide-react';
import { IoCIndicator, RiskLevel } from '../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: {
    title: string;
    description: string;
    severity: RiskLevel;
    sector: string;
    iocIds: string[];
  }) => void;
  availableIocs: IoCIndicator[];
  preselectedIoc?: IoCIndicator | null;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableIocs,
  preselectedIoc
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [sector, setSector] = useState('Critical Infrastructure / Energy');
  const [selectedIocIds, setSelectedIocIds] = useState<string[]>(
    preselectedIoc ? [preselectedIoc.id] : []
  );

  React.useEffect(() => {
    if (preselectedIoc && !selectedIocIds.includes(preselectedIoc.id)) {
      setSelectedIocIds([preselectedIoc.id]);
    }
  }, [preselectedIoc]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      severity,
      sector,
      iocIds: selectedIocIds
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  const toggleIocSelection = (id: string) => {
    setSelectedIocIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#111216] border border-[#24272e] rounded-[6px] shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#24272e] pb-3">
          <div className="flex items-center space-x-2">
            <FolderPlus className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-bold font-mono text-[#e2e8f0] uppercase tracking-[0.5px]">
              Initiate Investigation Case
            </h3>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#e2e8f0]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          <div>
            <label className="text-[#94a3b8] block mb-1 text-[11px]">Investigation Title:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Operation DarkBeacon: Fast-Flux C2 Probing"
              className="w-full bg-[#08090a] border border-[#24272e] rounded px-3 py-1.5 text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#94a3b8] block mb-1 text-[11px]">Severity Rating:</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as RiskLevel)}
                className="w-full bg-[#08090a] border border-[#24272e] rounded px-2.5 py-1.5 text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="CRITICAL">CRITICAL (Priority 1)</option>
                <option value="HIGH">HIGH (Priority 2)</option>
                <option value="MEDIUM">MEDIUM (Priority 3)</option>
                <option value="LOW">LOW (Priority 4)</option>
              </select>
            </div>

            <div>
              <label className="text-[#94a3b8] block mb-1 text-[11px]">Target Sector:</label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full bg-[#08090a] border border-[#24272e] rounded px-2.5 py-1.5 text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="Critical Infrastructure / Energy">Critical Infrastructure</option>
                <option value="Banking & Financial Services">Banking & Finance</option>
                <option value="Healthcare & Pharmaceuticals">Healthcare</option>
                <option value="Defense Industrial Base">Defense & Gov</option>
                <option value="Technology & Telecommunications">Technology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#94a3b8] block mb-1 text-[11px]">Operational Scope & Hypothesis:</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Outline initial telemetry, targeted subnets, and attribution hypotheses..."
              className="w-full bg-[#08090a] border border-[#24272e] rounded px-3 py-1.5 text-[#cbd5e1] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] font-sans text-xs"
            />
          </div>

          {/* Attach Indicators */}
          <div>
            <label className="text-[#94a3b8] block mb-1 text-[11px]">
              Attach Initial Indicators ({selectedIocIds.length} Selected):
            </label>
            <div className="max-h-36 overflow-y-auto bg-[#08090a] rounded p-2 border border-[#24272e] space-y-1">
              {availableIocs.map(ioc => {
                const isChecked = selectedIocIds.includes(ioc.id);
                return (
                  <div
                    key={ioc.id}
                    onClick={() => toggleIocSelection(ioc.id)}
                    className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                      isChecked ? 'bg-[#16181f] border border-[#38bdf8]/40' : 'hover:bg-[#111216]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="accent-[#38bdf8]"
                      />
                      <span className="font-bold text-[#e2e8f0]">{ioc.value}</span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] uppercase">{ioc.riskLevel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2.5 border-t border-[#24272e]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#08090a] hover:bg-[#16181f] text-[#cbd5e1] border border-[#24272e] font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-mono text-xs font-bold transition-colors shadow-sm"
            >
              Open Investigation Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
