import React, { useState } from 'react';
import {
  Server,
  ShieldCheck,
  Power,
  RefreshCw,
  AlertOctagon,
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface SensorNode {
  id: string;
  name: string;
  type: string;
  portRange: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  eventsPerMin: number;
  emulationLevel: 'Low-Interaction' | 'Medium-Interaction' | 'High-Interaction';
  uptime: string;
}

export const SensorAdminView: React.FC = () => {
  const [sensors, setSensors] = useState<SensorNode[]>([
    {
      id: 'sen-01',
      name: 'cowrie-us-east-01',
      type: 'Cowrie (SSH/Telnet Trap)',
      portRange: '22, 23, 2222',
      status: 'ONLINE',
      eventsPerMin: 142,
      emulationLevel: 'Medium-Interaction',
      uptime: '99.98%'
    },
    {
      id: 'sen-02',
      name: 'dionaea-eu-central-02',
      type: 'Dionaea (Malware Dropper / SMB)',
      portRange: '445, 139, 3306, 1433',
      status: 'ONLINE',
      eventsPerMin: 89,
      emulationLevel: 'Low-Interaction',
      uptime: '99.94%'
    },
    {
      id: 'sen-03',
      name: 'conpot-ics-scada-01',
      type: 'Conpot (ICS/SCADA Modbus & S7)',
      portRange: '102, 502, 47808',
      status: 'ONLINE',
      eventsPerMin: 34,
      emulationLevel: 'High-Interaction',
      uptime: '99.89%'
    },
    {
      id: 'sen-04',
      name: 'glutton-multiservice-04',
      type: 'Glutton (All-Port Honeytrap)',
      portRange: '1-65535 (Syn-Proxy)',
      status: 'ONLINE',
      eventsPerMin: 412,
      emulationLevel: 'Low-Interaction',
      uptime: '99.75%'
    }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const toggleSensorStatus = (id: string) => {
    setSensors(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'ONLINE' ? 'STANDBY' : 'ONLINE';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    setNotification('Sensor state modified.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFlushCache = () => {
    setNotification('GNN correlation cache and telemetry buffers flushed.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Admin Banner */}
      <div className="bg-[#111216] border border-[#24272e] rounded-[6px] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#f59e0b]" />
            <h2 className="text-sm font-bold font-mono text-[#e2e8f0] uppercase tracking-[0.5px]">
              Honeypot Sensor Operations & Governance
            </h2>
            <span className="fusion-badge badge-medium">
              Admin Clearance
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Manage honeypot trap nodes, adjust interaction fidelity levels, and inspect ingestion pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleFlushCache}
            className="px-2.5 py-1 rounded bg-[#08090a] hover:bg-[#16181f] text-[#cbd5e1] text-xs font-mono flex items-center space-x-1.5 transition-colors border border-[#24272e]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flush Ingestion Cache</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-2.5 bg-[#08090a] border border-[#22c55e]/40 rounded text-xs font-mono text-[#22c55e] flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sensor Nodes Table */}
      <div className="bg-[#111216] border border-[#24272e] rounded-[6px] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold font-mono text-[#94a3b8] uppercase tracking-[1px]">
          Active Honeypot Trap Cluster Nodes
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border border-[#24272e]">
            <thead className="bg-[#08090a] text-[#94a3b8] uppercase text-[10px] border-b border-[#24272e]">
              <tr>
                <th className="py-2.5 px-3">Sensor Node</th>
                <th className="py-2.5 px-3">Emulated Surface</th>
                <th className="py-2.5 px-3">Port Bindings</th>
                <th className="py-2.5 px-3">Fidelity Level</th>
                <th className="py-2.5 px-3 text-right">Throughput</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24272e]">
              {sensors.map(sensor => (
                <tr key={sensor.id} className="hover:bg-[#16181f] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#e2e8f0]">
                    {sensor.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#cbd5e1]">
                    {sensor.type}
                  </td>
                  <td className="py-2.5 px-3 text-[#38bdf8]">
                    {sensor.portRange}
                  </td>
                  <td className="py-2.5 px-3 text-[#94a3b8]">
                    {sensor.emulationLevel}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#e2e8f0] font-bold">
                    {sensor.eventsPerMin} evt/min
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`fusion-badge ${
                        sensor.status === 'ONLINE'
                          ? 'badge-low'
                          : 'badge-medium text-[#94a3b8]'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => toggleSensorStatus(sensor.id)}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                        sensor.status === 'ONLINE'
                          ? 'bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] border border-[#ef4444]/30'
                          : 'bg-[#22c55e]/15 hover:bg-[#22c55e]/25 text-[#22c55e] border border-[#22c55e]/30'
                      }`}
                    >
                      {sensor.status === 'ONLINE' ? 'Standby' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
