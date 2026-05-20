import React, { useState } from 'react';
import {
  LuArrowLeft,
  LuArrowRight,
  LuBatteryCharging,
  LuFactory,
  LuHouse,
  LuSettings2,
  LuSun,
} from 'react-icons/lu';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import { mockSystemSummary as sys } from '../../data/mockData';
import './PowerFlowPage.css';

const nodes = [
  {
    id: 'grid',
    icon: <LuFactory />,
    label: 'Grid',
    power: sys.gridPower,
    unit: 'kW',
    status: sys.gridStatus,
    details: { Voltage: `${sys.gridVoltage} kV`, Frequency: `${sys.gridFrequency} Hz`, Power: `${sys.gridPower} kW` },
  },
  {
    id: 'pv',
    icon: <LuSun />,
    label: 'PV/Solar',
    power: sys.pvPower,
    unit: 'kW',
    status: sys.pvPower > 0 ? 'Running' : 'Standby',
    details: { Power: `${sys.pvPower} kW`, 'Daily Energy': '120 kWh' },
  },
  {
    id: 'pcs',
    icon: <LuSettings2 />,
    label: 'PCS/Inverter',
    power: sys.pcsACPower,
    unit: 'kW',
    status: sys.pcsStatus,
    details: { 'AC Power': `${sys.pcsACPower} kW`, 'DC Power': `${sys.pcsDCPower} kW`, Efficiency: `${sys.pcsEfficiency}%`, Temp: `${sys.pcsTemperature} degC` },
  },
  {
    id: 'battery',
    icon: <LuBatteryCharging />,
    label: 'Battery',
    power: sys.batteryPower,
    unit: 'kW',
    status: sys.batteryStatus,
    details: { Power: `${sys.batteryPower} kW`, SOC: `${sys.soc}%`, Voltage: `${sys.batteryVoltage} V`, Current: `${sys.batteryCurrent} A` },
  },
  {
    id: 'load',
    icon: <LuHouse />,
    label: 'Load',
    power: sys.loadPower,
    unit: 'kW',
    status: 'Normal',
    details: { Power: `${sys.loadPower} kW` },
  },
];

const statusColors = {
  Normal: '#22C55E',
  Running: '#22C55E',
  Connected: '#22C55E',
  Charging: '#0EA5E9',
  Discharging: '#8B5CF6',
  Fault: '#EF4444',
  Offline: '#94A3B8',
  Standby: '#94A3B8',
};

export default function PowerFlowPage() {
  const [animOn, setAnimOn] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  const clickedNode = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;

  return (
    <div className="powerflow-page animate-fadeIn">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Power Flow Diagram</span>
          <label className="flex items-center gap-sm">
            <span className="text-sm text-secondary">Animation</span>
            <button className={`toggle ${animOn ? 'active' : ''}`} onClick={() => setAnimOn(!animOn)} />
          </label>
        </div>

        <div className="pf-diagram">
          <div className="pf-node-wrapper pf-pv">
            <div className="pf-node" style={{ borderColor: statusColors[nodes[1].status] || '#94A3B8' }} onClick={() => setSelectedNode('pv')}>
              <span className="pf-node-icon">{nodes[1].icon}</span>
              <span className="pf-node-label">{nodes[1].label}</span>
              <span className="pf-node-power">{nodes[1].power} {nodes[1].unit}</span>
              <StatusBadge status={nodes[1].status} size="small" />
            </div>
            <div className={`pf-line pf-line-v ${animOn ? 'pf-animated' : ''}`}>
              <div className="pf-flow-dot" style={{ animationDirection: 'normal' }}></div>
            </div>
          </div>

          <div className="pf-main-row">
            <div className="pf-node" style={{ borderColor: statusColors[nodes[0].status] }} onClick={() => setSelectedNode('grid')}>
              <span className="pf-node-icon">{nodes[0].icon}</span>
              <span className="pf-node-label">{nodes[0].label}</span>
              <span className="pf-node-power">{nodes[0].power} {nodes[0].unit}</span>
              <StatusBadge status={nodes[0].status} size="small" />
            </div>

            <div className={`pf-line pf-line-h ${animOn ? 'pf-animated' : ''}`}>
              <span className="pf-arrow">{sys.gridPower > 0 ? <LuArrowRight /> : <LuArrowLeft />}</span>
              <div className="pf-flow-dot"></div>
            </div>

            <div className="pf-node pf-node-center" style={{ borderColor: statusColors[nodes[2].status] }} onClick={() => setSelectedNode('pcs')}>
              <span className="pf-node-icon">{nodes[2].icon}</span>
              <span className="pf-node-label">{nodes[2].label}</span>
              <span className="pf-node-power">{nodes[2].power} {nodes[2].unit}</span>
              <StatusBadge status={nodes[2].status} size="small" />
            </div>

            <div className={`pf-line pf-line-h ${animOn ? 'pf-animated' : ''}`}>
              <span className="pf-arrow"><LuArrowRight /></span>
              <div className="pf-flow-dot"></div>
            </div>

            <div className="pf-node" style={{ borderColor: statusColors[nodes[4].status] }} onClick={() => setSelectedNode('load')}>
              <span className="pf-node-icon">{nodes[4].icon}</span>
              <span className="pf-node-label">{nodes[4].label}</span>
              <span className="pf-node-power">{nodes[4].power} {nodes[4].unit}</span>
              <StatusBadge status={nodes[4].status} size="small" />
            </div>
          </div>

          <div className="pf-node-wrapper pf-battery">
            <div className={`pf-line pf-line-v ${animOn ? 'pf-animated' : ''}`}>
              <div className="pf-flow-dot" style={{ animationDirection: sys.batteryPower < 0 ? 'normal' : 'reverse' }}></div>
            </div>
            <div className="pf-node" style={{ borderColor: statusColors[nodes[3].status] }} onClick={() => setSelectedNode('battery')}>
              <span className="pf-node-icon">{nodes[3].icon}</span>
              <span className="pf-node-label">{nodes[3].label}</span>
              <span className="pf-node-power">{nodes[3].power} {nodes[3].unit} ({sys.batteryPower < 0 ? 'Charging' : 'Discharging'})</span>
              <span className="pf-node-soc">SOC: {sys.soc}%</span>
              <StatusBadge status={nodes[3].status} size="small" />
            </div>
          </div>
        </div>
      </div>

      <div className="pf-detail-cards mt-base">
        {nodes.map((node) => (
          <div key={node.id} className="card pf-detail-card" onClick={() => setSelectedNode(node.id)}>
            <div className="pf-detail-header">
              <span className="pf-detail-title">
                <span className="pf-detail-title-icon">{node.icon}</span>
                {node.label}
              </span>
              <StatusBadge status={node.status} size="small" />
            </div>
            {Object.entries(node.details).map(([k, v]) => (
              <div key={k} className="pf-detail-row">
                <span className="text-secondary text-sm">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedNode} onClose={() => setSelectedNode(null)} title={clickedNode ? `${clickedNode.label} Details` : ''}>
        {clickedNode && (
          <div className="pf-modal-details">
            {Object.entries(clickedNode.details).map(([k, v]) => (
              <div key={k} className="pf-modal-row">
                <span className="text-secondary">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
            <div className="pf-modal-row mt-base">
              <span className="text-secondary">Status</span>
              <StatusBadge status={clickedNode.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
