import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Filter,
  Sliders,
  Info,
  ExternalLink,
  Cpu,
  Share2
} from 'lucide-react';
import { GNNNode, GNNEdge } from '../types';

interface GnnCanvasProps {
  nodes: GNNNode[];
  edges: GNNEdge[];
  onSelectNode: (nodeId: string) => void;
  selectedNodeId?: string;
}

interface SimulatedNode extends GNNNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const GnnCanvas: React.FC<GnnCanvasProps> = ({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [minConfidence, setMinConfidence] = useState<number>(0.7);
  const [activeInspectorNode, setActiveInspectorNode] = useState<GNNNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<SimulatedNode | null>(null);

  // Simulation nodes state ref
  const simNodesRef = useRef<SimulatedNode[]>([]);

  // Initialize simulation positions
  useEffect(() => {
    const width = 600;
    const height = 440;
    const centerX = width / 2;
    const centerY = height / 2;

    simNodesRef.current = nodes.map((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 110 + (i % 3) * 45;
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: node.type === 'ioc' ? 14 : node.type === 'asn' ? 16 : 12
      };
    });
  }, [nodes]);

  // Color mapping by node type matching Elegant Dark system
  const getNodeColor = useCallback((type: string, risk: number) => {
    switch (type) {
      case 'ioc':
        return risk > 85 ? '#ef4444' : '#38bdf8';
      case 'asn':
        return '#f59e0b';
      case 'pdns':
        return '#38bdf8';
      case 'malware':
        return '#ef4444';
      case 'c2':
        return '#ec4899';
      default:
        return '#94a3b8';
    }
  }, []);

  // Animation & Physics Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const simNodes = simNodesRef.current;

      // Filtered edges
      const activeEdges = edges.filter(e => e.confidence >= minConfidence);

      // Force-directed physics calculation
      if (simNodes.length > 0) {
        const repulsionStrength = 320;
        const springLength = 110;
        const springStrength = 0.035;
        const damping = 0.86;

        // Repulsion between all node pairs
        for (let i = 0; i < simNodes.length; i++) {
          for (let j = i + 1; j < simNodes.length; j++) {
            const n1 = simNodes[i];
            const n2 = simNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 260) {
              const force = repulsionStrength / (dist * dist);
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              n1.vx -= fx;
              n1.vy -= fy;
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Spring forces along edges
        activeEdges.forEach(edge => {
          const source = simNodes.find(n => n.id === edge.source);
          const target = simNodes.find(n => n.id === edge.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const displacement = dist - springLength;
            const fx = (dx / dist) * displacement * springStrength;
            const fy = (dy / dist) * displacement * springStrength;
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
          }
        });

        // Center gravity & update positions
        const centerX = width / 2;
        const centerY = height / 2;
        simNodes.forEach(node => {
          if (node !== draggedNode) {
            // Gravity towards center
            node.vx += (centerX - node.x) * 0.003;
            node.vy += (centerY - node.y) * 0.003;

            // Apply damping
            node.vx *= damping;
            node.vy *= damping;

            node.x += node.vx;
            node.y += node.vy;

            // Bound checking
            const margin = 40;
            node.x = Math.max(margin, Math.min(width - margin, node.x));
            node.y = Math.max(margin, Math.min(height - margin, node.y));
          }
        });
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Save context for pan/zoom
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw subtle cyber grid matching #08090a and #24272e
      ctx.strokeStyle = 'rgba(36, 39, 46, 0.6)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = -200; x < width + 200; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -200);
        ctx.lineTo(x, height + 200);
        ctx.stroke();
      }
      for (let y = -200; y < height + 200; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-200, y);
        ctx.lineTo(width + 200, y);
        ctx.stroke();
      }

      // Draw Edges
      activeEdges.forEach(edge => {
        const source = simNodes.find(n => n.id === edge.source);
        const target = simNodes.find(n => n.id === edge.target);
        if (!source || !target) return;

        // Skip if either is filtered
        if (filterType !== 'all') {
          if (source.type !== filterType && target.type !== filterType) return;
        }

        const isHighConfidence = edge.confidence >= 0.9;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = isHighConfidence
          ? 'rgba(56, 189, 248, 0.6)'
          : 'rgba(36, 39, 46, 0.9)';
        ctx.lineWidth = isHighConfidence ? 1.5 : 1;
        ctx.stroke();

        // Edge relation label midway
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(edge.relation.replace('_', ' '), midX, midY - 3);
      });

      // Draw Nodes
      simNodes.forEach(node => {
        if (filterType !== 'all' && node.type !== filterType) return;

        const isSelected = selectedNodeId === node.id || activeInspectorNode?.id === node.id;
        const color = getNodeColor(node.type, node.riskScore);

        // Halo / Glow if selected or critical
        if (isSelected || node.riskScore > 90) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? 'rgba(6, 182, 212, 0.25)'
            : 'rgba(239, 68, 68, 0.2)';
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Node Type Icon Marker
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const typeLetter = node.type.substring(0, 1).toUpperCase();
        ctx.fillText(typeLetter, node.x, node.y);

        // Label below node
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
        ctx.textBaseline = 'top';
        const displayLabel =
          node.label.length > 20 ? `${node.label.substring(0, 18)}..` : node.label;
        ctx.fillText(displayLabel, node.x, node.y + node.radius + 4);

        // Risk badge
        ctx.font = '8px JetBrains Mono, monospace';
        ctx.fillStyle = node.riskScore > 85 ? '#f87171' : '#94a3b8';
        ctx.fillText(`${node.riskScore}%`, node.x, node.y + node.radius + 16);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [edges, filterType, minConfidence, selectedNodeId, activeInspectorNode, zoom, pan, draggedNode, getNodeColor]);

  // Handle ResizeObserver for Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight || 440;
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Mouse Interaction (Drag, Pan, Click)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked on a node
    const clickedNode = simNodesRef.current.find(node => {
      if (filterType !== 'all' && node.type !== filterType) return false;
      const dx = node.x - clickX;
      const dy = node.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 5;
    });

    if (clickedNode) {
      setDraggedNode(clickedNode);
      setActiveInspectorNode(clickedNode);
      onSelectNode(clickedNode.id);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (draggedNode) {
      const rect = canvas.getBoundingClientRect();
      draggedNode.x = (e.clientX - rect.left - pan.x) / zoom;
      draggedNode.y = (e.clientY - rect.top - pan.y) / zoom;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
    } else if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsDraggingCanvas(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative bg-[#111216] border border-[#24272e] rounded-[6px] flex flex-col h-[480px] overflow-hidden">
      {/* Canvas Top Bar */}
      <div className="px-3.5 py-2.5 border-b border-[#24272e] flex items-center justify-between flex-wrap gap-2 z-10 bg-[#111216]">
        <div className="flex items-center space-x-2">
          <Share2 className="w-3.5 h-3.5 text-[#38bdf8]" />
          <h3 className="text-xs font-bold uppercase text-[#94a3b8] tracking-[1px] font-mono">
            GNN Infrastructure Topology
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#08090a] text-[#38bdf8] border border-[#24272e]">
            Confidence: 94.2%
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          {/* Node Type Selector */}
          <div className="flex items-center bg-[#08090a] rounded p-0.5 border border-[#24272e] text-xs">
            {['all', 'ioc', 'asn', 'pdns', 'malware', 'c2'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
                  filterType === type
                    ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-bold'
                    : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-0.5 bg-[#08090a] p-0.5 rounded border border-[#24272e]">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.2))}
              title="Zoom In"
              className="p-1 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#16181f]"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
              title="Zoom Out"
              className="p-1 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#16181f]"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={handleResetView}
              title="Reset View"
              className="p-1 rounded text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#16181f]"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div ref={containerRef} className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing bg-[#08090a]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#111216]/90 backdrop-blur-md p-2 rounded border border-[#24272e] text-[10px] font-mono space-y-1 pointer-events-none shadow-md">
          <div className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-wider">
            Topology Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block"></span>
              <span className="text-[#cbd5e1]">IoC Node</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block"></span>
              <span className="text-[#cbd5e1]">ASN Origin</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] inline-block"></span>
              <span className="text-[#cbd5e1]">pDNS Domain</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ec4899] inline-block"></span>
              <span className="text-[#cbd5e1]">Malware Hash</span>
            </div>
          </div>
        </div>

        {/* Node stats pill matching user design snippet: NODES: 42 | EDGES: 108 */}
        <div className="absolute bottom-2.5 right-2.5 font-mono text-[10px] text-[#94a3b8] bg-[#08090a]/80 px-2 py-1 rounded border border-[#24272e] pointer-events-none">
          NODES: {nodes.length} | EDGES: {edges.filter(e => e.confidence >= minConfidence).length} | DENSITY: 0.14
        </div>

        {/* Node Inspector Drawer */}
        {activeInspectorNode && (
          <div className="absolute top-2.5 right-2.5 w-72 bg-[#111216]/95 backdrop-blur-md p-3 rounded border border-[#38bdf8]/50 shadow-xl text-xs space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#08090a] text-[#38bdf8] border border-[#24272e] uppercase">
                  {activeInspectorNode.type}
                </span>
                <h4 className="font-mono font-bold text-[#e2e8f0] mt-1 break-all">
                  {activeInspectorNode.label}
                </h4>
              </div>
              <button
                onClick={() => setActiveInspectorNode(null)}
                className="text-[#94a3b8] hover:text-[#e2e8f0] p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 font-mono text-[10px] text-[#cbd5e1] border-t border-[#24272e] pt-2">
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">Risk Score:</span>
                <span className={`font-bold ${activeInspectorNode.riskScore > 80 ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
                  {activeInspectorNode.riskScore}% Confidence
                </span>
              </div>
              {activeInspectorNode.details && (
                <div className="text-[#94a3b8] font-sans text-[11px] bg-[#08090a] p-1.5 rounded border border-[#24272e]">
                  {activeInspectorNode.details}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectNode(activeInspectorNode.id)}
              className="w-full py-1 rounded bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-mono font-bold text-[11px] flex items-center justify-center space-x-1 transition-colors"
            >
              <span>Inspect in IoC Pipeline</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Confidence threshold footer */}
      <div className="px-3.5 py-2 border-t border-[#24272e] bg-[#111216] flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
        <div className="flex items-center space-x-2">
          <span>Min Edge Confidence:</span>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={minConfidence}
            onChange={e => setMinConfidence(parseFloat(e.target.value))}
            className="w-20 accent-[#38bdf8] cursor-pointer"
          />
          <span className="text-[#38bdf8] font-bold">{Math.round(minConfidence * 100)}%</span>
        </div>
        <div>
          Correlated GNN Infrastructure Graph
        </div>
      </div>
    </div>
  );
};
