import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { ThreatFeed } from './components/ThreatFeed';
import { GnnCanvas } from './components/GnnCanvas';
import { IocTable } from './components/IocTable';
import { IocDetailModal } from './components/IocDetailModal';
import { MitreContextPanel } from './components/MitreContextPanel';
import { CaseWorkbench } from './components/CaseWorkbench';
import { CreateCaseModal } from './components/CreateCaseModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { SensorAdminView } from './components/SensorAdminView';

import {
  MOCK_DASHBOARD_STATS,
  MOCK_IOCS,
  MOCK_THREAT_FEED,
  MOCK_GNN_NODES,
  MOCK_GNN_EDGES,
  MOCK_CASES,
  MOCK_MITRE_TACTICS,
  MOCK_USER_PROFILE
} from './mockData';

import {
  DashboardStats,
  IoCIndicator,
  ThreatFeedItem,
  GNNNode,
  GNNEdge,
  InvestigationCase,
  MitreTacticGroup,
  UserProfile,
  UserRole,
  RiskLevel
} from './types';

export default function App() {
  // Authentication & Clearance State
  const [user, setUser] = useState<UserProfile>(MOCK_USER_PROFILE);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'iocs' | 'mitre' | 'cases' | 'admin'>('overview');

  // Core Data State
  const [stats, setStats] = useState<DashboardStats>(MOCK_DASHBOARD_STATS);
  const [iocs, setIocs] = useState<IoCIndicator[]>(MOCK_IOCS);
  const [feedItems, setFeedItems] = useState<ThreatFeedItem[]>(MOCK_THREAT_FEED);
  const [gnnNodes, setGnnNodes] = useState<GNNNode[]>(MOCK_GNN_NODES);
  const [gnnEdges, setGnnEdges] = useState<GNNEdge[]>(MOCK_GNN_EDGES);
  const [cases, setCases] = useState<InvestigationCase[]>(MOCK_CASES);
  const [mitreTactics, setMitreTactics] = useState<MitreTacticGroup[]>(MOCK_MITRE_TACTICS);

  // Modal & Selection States
  const [selectedIocForModal, setSelectedIocForModal] = useState<IoCIndicator | null>(null);
  const [selectedIocForAi, setSelectedIocForAi] = useState<IoCIndicator | null>(MOCK_IOCS[0]);
  const [selectedGnnNodeId, setSelectedGnnNodeId] = useState<string | undefined>(undefined);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(MOCK_CASES[0].id);

  // Global Dialog Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [preselectedIocForCase, setPreselectedIocForCase] = useState<IoCIndicator | null>(null);

  // Toast / System Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Hydrate from API on mount
  useEffect(() => {
    const loadBootstrapData = async () => {
      try {
        const res = await fetch('/api/bootstrap');
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.iocs) setIocs(data.iocs);
          if (data.feedItems) setFeedItems(data.feedItems);
          if (data.cases) setCases(data.cases);
          if (data.gnnTopology) {
            setGnnNodes(data.gnnTopology.nodes);
            setGnnEdges(data.gnnTopology.edges);
          }
          if (data.mitreTactics) setMitreTactics(data.mitreTactics);
        }
      } catch (err) {
        // Fallback gracefully to pre-seeded mockData
        console.warn('Backend API bootstrap unavailable, using high-fidelity local dataset:', err);
      }
    };

    loadBootstrapData();
  }, []);

  // Role toggle handler
  const handleRoleChange = (role: UserRole) => {
    setUser(prev => ({
      ...prev,
      role,
      name: role === 'ADMIN' ? 'SOC Engineering Lead (Admin)' : 'Senior Cyber Threat Analyst'
    }));
    showToast(`Role switched to ${role}. Permissions updated.`);
    if (role === 'ANALYST' && activeTab === 'admin') {
      setActiveTab('overview');
    }
  };

  // Simulate Honeypot Inbound Telemetry Trigger
  const handleSimulateInbound = async () => {
    try {
      const res = await fetch('/api/telemetry/simulate', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const newFeed = data.feedItem as ThreatFeedItem;
        setFeedItems(prev => [newFeed, ...prev]);
        setStats(prev => ({
          ...prev,
          activeHoneypotAlerts: prev.activeHoneypotAlerts + 1,
          totalIoCsMonitored: prev.totalIoCsMonitored + 1
        }));
        showToast(`New Honeypot Hit Ingested: ${newFeed.indicator} (${newFeed.honeypotName})`);
      }
    } catch (err) {
      // Local simulation fallback
      const randomIps = ['185.196.10.44', '91.240.118.82', '194.26.29.114', '45.154.255.89'];
      const ip = randomIps[Math.floor(Math.random() * randomIps.length)];
      const fallbackItem: ThreatFeedItem = {
        id: `sim-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        indicator: ip,
        type: 'ip',
        honeypotName: 'Cowrie-SSH-Trap-03',
        normalizedSeverity: 'HIGH',
        rawEvent: `Interactive auth bypass probe on port 2222 with credential enumeration`,
        countryCode: 'NL',
        port: 2222
      };
      setFeedItems(prev => [fallbackItem, ...prev]);
      setStats(prev => ({ ...prev, activeHoneypotAlerts: prev.activeHoneypotAlerts + 1 }));
      showToast(`Inbound honeypot hit simulated: ${ip}`);
    }
  };

  // Handle clicking indicator from feed or graph
  const handleSelectIndicatorByValue = (val: string) => {
    const found = iocs.find(i => i.value === val);
    if (found) {
      setSelectedIocForModal(found);
    } else {
      showToast(`Inspecting raw feed indicator: ${val}`);
    }
  };

  // Handle GNN Node Selection
  const handleSelectGnnNode = (nodeId: string) => {
    setSelectedGnnNodeId(nodeId);
    const foundNode = gnnNodes.find(n => n.id === nodeId);
    if (foundNode && foundNode.type === 'ioc') {
      const foundIoc = iocs.find(i => i.id === foundNode.id || i.value === foundNode.label);
      if (foundIoc) {
        setSelectedIocForModal(foundIoc);
      }
    }
  };

  // Contextualize via AI trigger
  const handleTriggerAiFromIoc = (ioc: IoCIndicator) => {
    setSelectedIocForAi(ioc);
    setSelectedIocForModal(null);
    setActiveTab('mitre');
    showToast(`AI Threat Contextualization loaded for ${ioc.value}`);
  };

  // Attach IoC to Case
  const handleAttachIocToCase = (ioc: IoCIndicator) => {
    setPreselectedIocForCase(ioc);
    setIsCreateCaseModalOpen(true);
    setSelectedIocForModal(null);
  };

  // Create Case Handler
  const handleCreateCase = (caseData: {
    title: string;
    description: string;
    severity: RiskLevel;
    sector: string;
    iocIds: string[];
  }) => {
    const newCaseNumber = `CASE-2026-00${cases.length + 1}`;
    const newCase: InvestigationCase = {
      id: `case-${Date.now()}`,
      caseNumber: newCaseNumber,
      title: caseData.title,
      description: caseData.description,
      status: 'NEW',
      priority: caseData.severity === 'CRITICAL' ? 1 : caseData.severity === 'HIGH' ? 2 : 3,
      severity: caseData.severity,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      assignee: user.name,
      sector: caseData.sector,
      iocIds: caseData.iocIds,
      timelineEvents: [
        {
          id: `evt-${Date.now()}`,
          timestamp: 'Just now',
          title: 'Case Initiated from Telemetry',
          details: `Investigation case opened with initial scope: ${caseData.title}. Attached ${caseData.iocIds.length} candidate indicators.`,
          stage: 'Initial Scope',
          severity: caseData.severity,
          sourceIoC: caseData.iocIds[0] || undefined
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setActiveTab('cases');
    setStats(prev => ({ ...prev, pendingCases: prev.pendingCases + 1 }));
    showToast(`Case ${newCaseNumber} created successfully.`);
  };

  // Add event to timeline
  const handleAddTimelineEvent = (caseId: string, eventData: any) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          const newEvent = {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
            title: eventData.title,
            details: eventData.details,
            stage: eventData.stage,
            severity: eventData.severity,
            sourceIoC: eventData.sourceIoC,
            analystNote: eventData.analystNote
          };
          return {
            ...c,
            updatedAt: 'Just now',
            timelineEvents: [...c.timelineEvents, newEvent]
          };
        }
        return c;
      })
    );
    showToast('Evidence logged to investigation timeline.');
  };

  // Update Case Status
  const handleUpdateCaseStatus = (caseId: string, status: InvestigationCase['status']) => {
    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, status, updatedAt: 'Just now' } : c))
    );
    showToast(`Case status updated to ${status}`);
  };

  // Update Case Priority
  const handleUpdateCasePriority = (caseId: string, priority: number) => {
    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, priority, updatedAt: 'Just now' } : c))
    );
    showToast(`Priority adjusted to P${priority}`);
  };

  // Attach AI Analysis to Case
  const handleAttachAnalysisToCase = (analysisText: string, iocValue: string) => {
    if (!cases[0]) return;
    handleAddTimelineEvent(cases[0].id, {
      title: `Gemini AI Threat Contextualization: ${iocValue}`,
      details: analysisText.substring(0, 300) + '... (Full intelligence dossier attached)',
      stage: 'AI Threat Synthesis',
      severity: 'HIGH',
      sourceIoC: iocValue,
      analystNote: 'Automated synthesis verified by analyst; cross-referenced with honeypot captures.'
    });
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#e2e8f0] flex flex-col font-sans selection:bg-[#38bdf8] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111216] border border-[#38bdf8] text-[#38bdf8] px-3.5 py-2 rounded shadow-2xl text-xs font-mono flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] inline-block animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Main Navigation */}
      <Header
        user={user}
        onRoleChange={handleRoleChange}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        honeypotAlertCount={stats.activeHoneypotAlerts}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* VIEW 1: UNIFIED DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Stat Cards */}
            <StatCards
              stats={stats}
              onNavigateToIocs={() => setActiveTab('iocs')}
              onNavigateToCases={() => setActiveTab('cases')}
            />

            {/* Split Row: Threat Feed & GNN Topology Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Threat Feed (5 cols) */}
              <div className="lg:col-span-5">
                <ThreatFeed
                  feedItems={feedItems}
                  onSelectIndicator={handleSelectIndicatorByValue}
                  onSimulateInbound={handleSimulateInbound}
                />
              </div>

              {/* GNN Graph Infrastructure Map (7 cols) */}
              <div className="lg:col-span-7">
                <GnnCanvas
                  nodes={gnnNodes}
                  edges={gnnEdges}
                  onSelectNode={handleSelectGnnNode}
                  selectedNodeId={selectedGnnNodeId}
                />
              </div>
            </div>

            {/* Active Pipeline Preview Table */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-[#e2e8f0] uppercase tracking-[0.5px]">
                    Monitored Indicators of Compromise (IoC Pipeline)
                  </h3>
                  <p className="text-[11px] text-[#94a3b8]">
                    Calculated via Infrastructure Graph Scoring + Behavioral Honeypot Telemetry
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('iocs')}
                  className="text-xs font-mono text-[#38bdf8] hover:text-[#38bdf8]/80 hover:underline"
                >
                  View Full Pipeline &rarr;
                </button>
              </div>

              <IocTable
                iocs={iocs}
                onSelectIoc={ioc => setSelectedIocForModal(ioc)}
                onContextualizeAi={handleTriggerAiFromIoc}
                onAddToCase={handleAttachIocToCase}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: IOC PIPELINE & RISK SCORING PANEL */}
        {activeTab === 'iocs' && (
          <div className="space-y-3.5">
            <div className="border-b border-[#24272e] pb-2.5">
              <h2 className="text-base font-bold font-mono text-[#e2e8f0] uppercase tracking-[0.5px]">
                IoC Pipeline & Risk Scoring Engine
              </h2>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Explore indicators with decomposed Infrastructure & Behavioral sub-scores, unified Fusion Risk Confidence, and raw honeypot artifacts.
              </p>
            </div>

            <IocTable
              iocs={iocs}
              onSelectIoc={ioc => setSelectedIocForModal(ioc)}
              onContextualizeAi={handleTriggerAiFromIoc}
              onAddToCase={handleAttachIocToCase}
            />
          </div>
        )}

        {/* VIEW 3: LLM-ASSISTED MITRE ATT&CK CONTEXTUALIZATION */}
        {activeTab === 'mitre' && (
          <MitreContextPanel
            tactics={mitreTactics}
            iocs={iocs}
            selectedIocForAi={selectedIocForAi}
            onSelectIoc={ioc => setSelectedIocForAi(ioc)}
            onAttachAnalysisToCase={handleAttachAnalysisToCase}
          />
        )}

        {/* VIEW 4: CASE MANAGEMENT & TIMELINE INVESTIGATION */}
        {activeTab === 'cases' && (
          <CaseWorkbench
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={id => setSelectedCaseId(id)}
            onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)}
            onUpdateCaseStatus={handleUpdateCaseStatus}
            onUpdateCasePriority={handleUpdateCasePriority}
            onAddTimelineEvent={handleAddTimelineEvent}
            allIocs={iocs}
            onInspectIoc={ioc => setSelectedIocForModal(ioc)}
          />
        )}

        {/* VIEW 5: SENSOR OPS (ADMIN VIEW) */}
        {activeTab === 'admin' && user.role === 'ADMIN' && <SensorAdminView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#24272e] bg-[#08090a] py-3.5 text-center text-xs font-mono text-[#94a3b8]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ThreatLens &bull; Unified IoC & Honeypot Telemetry Investigation Platform</span>
          <span className="text-[#64748b]">Enterprise SOC Clearance Level 4 &bull; TLP:AMBER</span>
        </div>
      </footer>

      {/* Modals */}
      {selectedIocForModal && (
        <IocDetailModal
          ioc={selectedIocForModal}
          onClose={() => setSelectedIocForModal(null)}
          onTriggerAi={handleTriggerAiFromIoc}
          onAttachCase={handleAttachIocToCase}
        />
      )}

      {isCreateCaseModalOpen && (
        <CreateCaseModal
          isOpen={isCreateCaseModalOpen}
          onClose={() => {
            setIsCreateCaseModalOpen(false);
            setPreselectedIocForCase(null);
          }}
          onSubmit={handleCreateCase}
          availableIocs={iocs}
          preselectedIoc={preselectedIocForCase}
        />
      )}

      {isReportModalOpen && (
        <ExecutiveReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          stats={stats}
          iocs={iocs}
          cases={cases}
        />
      )}
    </div>
  );
}
