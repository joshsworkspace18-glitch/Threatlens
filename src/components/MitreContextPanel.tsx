import React, { useState } from 'react';
import {
  Radio,
  Bot,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Share2
} from 'lucide-react';
import { MitreTacticGroup, IoCIndicator } from '../types';

interface MitreContextPanelProps {
  tactics: MitreTacticGroup[];
  iocs: IoCIndicator[];
  selectedIocForAi: IoCIndicator | null;
  onSelectIoc: (ioc: IoCIndicator) => void;
  onAttachAnalysisToCase?: (analysis: string, iocValue: string) => void;
}

export const MitreContextPanel: React.FC<MitreContextPanelProps> = ({
  tactics,
  iocs,
  selectedIocForAi,
  onSelectIoc,
  onAttachAnalysisToCase
}) => {
  const [activeIoc, setActiveIoc] = useState<IoCIndicator>(selectedIocForAi || iocs[0]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);
  const [attachedSuccess, setAttachedSuccess] = useState<boolean>(false);

  // Sync when prop changes
  React.useEffect(() => {
    if (selectedIocForAi) {
      setActiveIoc(selectedIocForAi);
    }
  }, [selectedIocForAi]);

  const handleGenerateAiContext = async (targetIoc: IoCIndicator) => {
    setIsLoadingAi(true);
    setAttachedSuccess(false);
    try {
      const res = await fetch('/api/ai/contextualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicatorId: targetIoc.id,
          indicatorValue: targetIoc.value
        })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis);
    } catch (err) {
      console.error('Failed to generate AI context:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleCopy = () => {
    if (aiAnalysis) {
      navigator.clipboard.writeText(aiAnalysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAttach = () => {
    if (aiAnalysis && onAttachAnalysisToCase) {
      onAttachAnalysisToCase(aiAnalysis, activeIoc.value);
      setAttachedSuccess(true);
      setTimeout(() => setAttachedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#38bdf8]" />
            <h2 className="text-sm font-bold text-[#e2e8f0] font-mono uppercase tracking-[0.5px]">
              LLM-Assisted MITRE ATT&CK Contextualization
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Correlates honeypot shell captures and behavioral anomalies with MITRE Enterprise Tactics and automated threat reasoning.
          </p>
        </div>

        {/* IoC Picker for AI Analysis */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-[11px] font-mono text-[#94a3b8] whitespace-nowrap">Target IoC:</span>
          <select
            value={activeIoc.id}
            onChange={e => {
              const found = iocs.find(i => i.id === e.target.value);
              if (found) {
                setActiveIoc(found);
                handleGenerateAiContext(found);
              }
            }}
            className="bg-[#08090a] border border-[#24272e] text-xs font-mono text-[#38bdf8] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#38bdf8]"
          >
            {iocs.map(i => (
              <option key={i.id} value={i.id}>
                {i.value} ({i.fusionScore}% - {i.riskLevel})
              </option>
            ))}
          </select>
          <button
            onClick={() => handleGenerateAiContext(activeIoc)}
            disabled={isLoadingAi}
            className="px-3 py-1.5 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-mono text-xs font-bold flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? 'Synthesizing...' : 'Synthesize Context'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left is MITRE Matrix, Right is AI Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Mapping UI (MITRE Matrix) - 7 cols */}
        <div className="lg:col-span-7 bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-[#24272e] pb-2.5">
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              <h3 className="text-xs font-bold font-mono text-[#94a3b8] uppercase tracking-[1px]">
                Enterprise ATT&CK Tactics Alignment
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              {tactics.reduce((acc, t) => acc + t.techniques.length, 0)} Correlated Techniques
            </span>
          </div>

          {/* Matrix Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-y-auto max-h-[640px] pr-1">
            {tactics.map(tactic => (
              <div
                key={tactic.tacticId}
                className="bg-[#08090a] border border-[#24272e] rounded p-2.5 flex flex-col space-y-2"
              >
                {/* Tactic Header */}
                <div className="border-b border-[#24272e] pb-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#16181f] text-[#38bdf8] border border-[#24272e]">
                    {tactic.tacticId}
                  </span>
                  <h4 className="text-xs font-bold text-[#e2e8f0] font-mono mt-1">
                    {tactic.tacticName}
                  </h4>
                </div>

                {/* Techniques List in Tactic */}
                <div className="space-y-1.5 flex-1">
                  {tactic.techniques.map(tech => {
                    const isSelected = selectedTechniqueId === tech.id;
                    const isTaggedToActiveIoc = tech.associatedIoCs.includes(activeIoc.value);

                    return (
                      <div
                        key={tech.id}
                        onClick={() => setSelectedTechniqueId(isSelected ? null : tech.id)}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#38bdf8]/10 border-[#38bdf8]'
                            : isTaggedToActiveIoc
                            ? 'bg-[#16181f] border-[#38bdf8]/50'
                            : 'bg-[#111216] border-[#24272e] hover:border-[#38bdf8]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`font-bold ${isTaggedToActiveIoc ? 'text-[#38bdf8]' : 'text-[#94a3b8]'}`}>
                            {tech.id}
                          </span>
                          <span className="px-1 py-0.2 rounded bg-[#08090a] text-[#94a3b8] text-[9px] border border-[#24272e]">
                            {tech.detectedCount} hits
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#e2e8f0] mt-1 line-clamp-1">
                          {tech.name}
                        </div>
                        <p className="text-[10px] text-[#94a3b8] mt-0.5 line-clamp-2">
                          {tech.description}
                        </p>

                        {/* Associated IoCs Chips */}
                        <div className="mt-1.5 pt-1 border-t border-[#24272e] flex flex-wrap gap-1">
                          {tech.associatedIoCs.map((iocVal, idx) => (
                            <span
                              key={idx}
                              onClick={e => {
                                e.stopPropagation();
                                const found = iocs.find(i => i.value === iocVal);
                                if (found) {
                                  setActiveIoc(found);
                                  handleGenerateAiContext(found);
                                }
                              }}
                              className={`text-[9px] font-mono px-1 py-0.2 rounded transition-colors ${
                                iocVal === activeIoc.value
                                  ? 'bg-[#38bdf8] text-black font-bold'
                                  : 'bg-[#08090a] text-[#94a3b8] hover:text-[#38bdf8] border border-[#24272e]'
                              }`}
                            >
                              {iocVal.length > 14 ? `${iocVal.substring(0, 12)}..` : iocVal}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights & Reasoning Panel - 5 cols */}
        <div className="lg:col-span-5 bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5 flex flex-col h-[700px]">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-[#24272e] pb-2.5">
            <div className="flex items-center space-x-2">
              <Bot className="w-3.5 h-3.5 text-[#38bdf8]" />
              <h3 className="text-xs font-bold font-mono text-[#94a3b8] uppercase tracking-[1px]">
                AI Threat Intelligence Insights
              </h3>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopy}
                disabled={!aiAnalysis}
                title="Copy Analysis"
                className="p-1 rounded bg-[#08090a] hover:bg-[#16181f] text-[#94a3b8] hover:text-[#e2e8f0] border border-[#24272e] transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
              </button>
              {onAttachAnalysisToCase && (
                <button
                  onClick={handleAttach}
                  disabled={!aiAnalysis}
                  className="px-2 py-1 text-[10px] font-mono rounded bg-[#08090a] hover:bg-[#16181f] text-[#38bdf8] border border-[#24272e] flex items-center space-x-1 disabled:opacity-40"
                >
                  <FileCheck2 className="w-3 h-3" />
                  <span>{attachedSuccess ? 'Attached!' : 'Add to Case'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Target Banner */}
          <div className="mt-2.5 p-2 rounded bg-[#08090a] border border-[#24272e] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#94a3b8]">Target: </span>
              <span className="font-bold text-[#38bdf8]">{activeIoc.value}</span>
            </div>
            <span className="text-[#e2e8f0] bg-[#16181f] px-1.5 py-0.2 rounded border border-[#24272e] text-[10px]">
              {activeIoc.threatActorAttribution || 'Unattributed'}
            </span>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto mt-2.5 pr-1 text-xs leading-relaxed font-sans text-[#cbd5e1] space-y-2.5">
            {isLoadingAi ? (
              <div className="h-full flex flex-col items-center justify-center space-y-2 text-[#94a3b8] font-mono">
                <Sparkles className="w-6 h-6 text-[#38bdf8] animate-spin" />
                <p className="text-xs">Synthesizing behavioral patterns via Gemini AI...</p>
                <span className="text-[10px] text-[#94a3b8]/70">
                  Cross-referencing honeypot captures, shell commands & ASN topology
                </span>
              </div>
            ) : aiAnalysis ? (
              <div className="p-3 bg-[#08090a] rounded border border-[#24272e] space-y-2.5 whitespace-pre-line font-sans text-xs">
                {aiAnalysis}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#94a3b8] font-mono space-y-2.5">
                <Bot className="w-8 h-8 text-[#94a3b8]/50" />
                <p className="text-xs">
                  No automated synthesis generated yet for <span className="text-[#e2e8f0] font-bold">{activeIoc.value}</span>.
                </p>
                <button
                  onClick={() => handleGenerateAiContext(activeIoc)}
                  className="px-3 py-1.5 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-mono font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Threat Contextualization</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Footer */}
          <div className="pt-2 mt-2 border-t border-[#24272e] text-[10px] font-mono text-[#94a3b8] flex items-center justify-between">
            <span>Model: gemini-2.5-flash (Threat Intelligence Specialized)</span>
            <span>Evidence-Backed Reasoning</span>
          </div>
        </div>
      </div>
    </div>
  );
};
