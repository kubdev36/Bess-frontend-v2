import React, { useMemo, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import {
  LuBatteryCharging,
  LuCog,
  LuPower,
  LuRadio,
  LuShield,
} from 'react-icons/lu';
import KPICard from '../../components/shared/KPICard';
import StatusBadge from '../../components/shared/StatusBadge';
import { ConfirmModal } from '../../components/shared/Modal';
import { mockCommands, mockParameters, mockSafetyConditions, mockSystemSummary as sys } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import './ControlPage.css';

const modes = ['Auto', 'Manual', 'Charge', 'Discharge', 'Standby', 'Backup', 'Peak Shaving', 'Maintenance'];

export default function ControlPage() {
  const { checkPassword } = useAuth();
  const [selectedMode, setSelectedMode] = useState(sys.operationMode);
  const [chargeForm, setChargeForm] = useState({ power: '180', duration: '90', socMax: '90', start: '', end: '', note: '' });
  const [dischargeForm, setDischargeForm] = useState({ power: '150', duration: '60', socMin: '20', start: '', end: '', note: '' });
  const [commandModal, setCommandModal] = useState(null);
  const latestCommand = mockCommands[0];

  const safetyBlocked = useMemo(() => mockSafetyConditions.some((item) => !item.met), []);

  const openCommand = (command) => setCommandModal(command);

  const handleConfirm = ({ password }) => {
    if (mockParameters.control.passwordConfirm && !checkPassword(password)) return;
    setCommandModal(null);
  };

  return (
    <div className="page-stack animate-fadeIn">
      <div className="grid grid-5">
        <KPICard icon={<LuPower />} title="System Status" value={sys.systemStatus} status={sys.systemStatus} />
        <KPICard icon={<LuCog />} title="Operation Mode" value={selectedMode} status={selectedMode} />
        <KPICard icon={<LuBatteryCharging />} title="SOC" value={`${sys.soc}%`} progress={sys.soc} />
        <KPICard icon={<LuRadio />} title="Remote Control" value={sys.remoteControl ? 'Enabled' : 'Disabled'} status={sys.remoteControl ? 'Enabled' : 'Disabled'} />
        <KPICard icon={<FaTriangleExclamation />} title="Active Alarms" value={sys.activeAlarms} status={sys.activeAlarms ? 'Warning' : 'Normal'} />
      </div>

      <div className="split-panel">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Operation Mode Selector</span>
            <StatusBadge status={safetyBlocked ? 'Warning' : 'Normal'} />
          </div>
          <div className="mode-grid">
            {modes.map((mode) => (
              <button key={mode} className={`mode-card ${selectedMode === mode ? 'active' : ''}`} onClick={() => setSelectedMode(mode)}>
                <span className="mode-card-title">{mode}</span>
                <span className="mode-card-subtitle">Switch system mode</span>
              </button>
            ))}
          </div>
          <div className="section-divider"></div>
          <div className="page-toolbar-actions">
            <button className="btn btn-primary" disabled={safetyBlocked} onClick={() => openCommand('Start System')}>Start System</button>
            <button className="btn btn-secondary" disabled={safetyBlocked} onClick={() => openCommand('Stop System')}>Stop System</button>
            <button className="btn btn-success" disabled={safetyBlocked} onClick={() => openCommand(`Set Mode: ${selectedMode}`)}>Apply Mode</button>
            <button className="btn btn-danger" onClick={() => openCommand('Emergency Stop')}>Emergency Stop</button>
            <button className="btn btn-ghost" onClick={() => openCommand('Reset Alarm')}>Reset Alarm</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Safety Conditions</span></div>
          <div className="safety-list">
            {mockSafetyConditions.map((item) => (
              <div key={item.label} className="safety-item">
                <span>{item.label}</span>
                <StatusBadge status={item.met ? 'Normal' : 'Fault'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">Charge Battery</span></div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Target Power (kW)</label>
              <input className="form-input" value={chargeForm.power} onChange={(e) => setChargeForm({ ...chargeForm, power: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minute)</label>
              <input className="form-input" value={chargeForm.duration} onChange={(e) => setChargeForm({ ...chargeForm, duration: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">SOC Max (%)</label>
              <input className="form-input" value={chargeForm.socMax} onChange={(e) => setChargeForm({ ...chargeForm, socMax: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="datetime-local" value={chargeForm.start} onChange={(e) => setChargeForm({ ...chargeForm, start: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason / Note</label>
            <input className="form-input" value={chargeForm.note} onChange={(e) => setChargeForm({ ...chargeForm, note: e.target.value })} />
          </div>
          <button
            className="btn btn-primary"
            disabled={safetyBlocked || Number(chargeForm.power) > mockParameters.pcs.maxChargePower || Number(chargeForm.socMax) <= sys.soc}
            onClick={() => openCommand(`Charge Battery ${chargeForm.power} kW`)}
          >
            Charge Battery
          </button>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Discharge Battery</span></div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Target Power (kW)</label>
              <input className="form-input" value={dischargeForm.power} onChange={(e) => setDischargeForm({ ...dischargeForm, power: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minute)</label>
              <input className="form-input" value={dischargeForm.duration} onChange={(e) => setDischargeForm({ ...dischargeForm, duration: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">SOC Min (%)</label>
              <input className="form-input" value={dischargeForm.socMin} onChange={(e) => setDischargeForm({ ...dischargeForm, socMin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="datetime-local" value={dischargeForm.start} onChange={(e) => setDischargeForm({ ...dischargeForm, start: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason / Note</label>
            <input className="form-input" value={dischargeForm.note} onChange={(e) => setDischargeForm({ ...dischargeForm, note: e.target.value })} />
          </div>
          <button
            className="btn btn-success"
            disabled={safetyBlocked || Number(dischargeForm.power) > mockParameters.pcs.maxDischargePower || Number(dischargeForm.socMin) >= sys.soc}
            onClick={() => openCommand(`Discharge Battery ${dischargeForm.power} kW`)}
          >
            Discharge Battery
          </button>
        </div>
      </div>

      <div className="split-panel">
        <div className="card">
          <div className="card-header"><span className="card-title">Latest Command Status</span></div>
          <div className="detail-list">
            <div className="detail-item"><span className="detail-item-label">Command Type</span><span className="detail-item-value">{latestCommand.type}</span></div>
            <div className="detail-item"><span className="detail-item-label">Target Device</span><span className="detail-item-value">{latestCommand.device}</span></div>
            <div className="detail-item"><span className="detail-item-label">Status</span><span className="detail-item-value"><StatusBadge status={latestCommand.status} /></span></div>
            <div className="detail-item"><span className="detail-item-label">Time</span><span className="detail-item-value">{latestCommand.time}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <LuShield style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Control Summary
            </span>
          </div>
          <div className="timeline-list">
            <div className="timeline-item"><span>PCS Status</span><StatusBadge status={sys.pcsStatus} /></div>
            <div className="timeline-item"><span>BMS Status</span><StatusBadge status={sys.bmsStatus} /></div>
            <div className="timeline-item"><span>Grid Status</span><StatusBadge status={sys.gridStatus} /></div>
            <div className="timeline-item"><span>Battery Power</span><strong>{sys.batteryPower} kW</strong></div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!commandModal}
        onClose={() => setCommandModal(null)}
        onConfirm={handleConfirm}
        title={commandModal || 'Confirm Action'}
        message="Please review safety conditions before sending this command."
        requirePassword
        requireReason={mockParameters.control.requireReason}
        danger={commandModal === 'Emergency Stop'}
        confirmText="Send Command"
      />
    </div>
  );
}
