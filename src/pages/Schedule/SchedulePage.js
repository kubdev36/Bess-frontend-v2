import React, { useMemo, useState } from 'react';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import { mockSchedules } from '../../data/mockData';
import './SchedulePage.css';

const initialForm = {
  name: '',
  start: '',
  end: '',
  mode: 'Charge',
  power: '',
  socMin: '',
  socMax: '',
  repeat: 'Daily',
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(
    mockSchedules.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? 'Admin' : 'Op User',
      createdAt: `2026-05-${String(10 + index).padStart(2, '0')} 08:30`,
    }))
  );
  const [filterMode, setFilterMode] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(
    () =>
      schedules.filter(item => {
        if (filterMode !== 'All' && item.mode !== filterMode) return false;
        if (filterStatus !== 'All' && item.status !== filterStatus) return false;
        return true;
      }),
    [filterMode, filterStatus, schedules]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = item => {
    setEditing(item);
    setForm({
      name: item.name,
      start: item.start,
      end: item.end,
      mode: item.mode,
      power: item.power ?? '',
      socMin: item.socMin ?? '',
      socMax: item.socTarget ?? '',
      repeat: item.repeat,
    });
    setShowModal(true);
  };

  const saveSchedule = () => {
    if (!form.name || !form.start || !form.end) return;

    if (editing) {
      setSchedules(prev =>
        prev.map(item =>
          item.id === editing.id
            ? {
                ...item,
                name: form.name,
                start: form.start,
                end: form.end,
                mode: form.mode,
                power: form.power ? Number(form.power) : null,
                socMin: form.socMin ? Number(form.socMin) : null,
                socTarget: form.socMax ? Number(form.socMax) : null,
                repeat: form.repeat,
              }
            : item
        )
      );
    } else {
      setSchedules(prev => [
        {
          id: prev.length + 1,
          name: form.name,
          start: form.start,
          end: form.end,
          mode: form.mode,
          power: form.power ? Number(form.power) : null,
          socTarget: form.socMax ? Number(form.socMax) : null,
          socMin: form.socMin ? Number(form.socMin) : null,
          repeat: form.repeat,
          status: 'Enabled',
          createdBy: 'Admin',
          createdAt: '2026-05-19 15:30',
        },
        ...prev,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="page-stack animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">Schedule Management</div>
            <div className="card-subtitle">Tạo lịch sạc, xả, standby, backup, peak shaving và maintenance.</div>
          </div>
          <div className="page-toolbar-actions">
            <select className="form-select" style={{ width: 160 }} value={filterMode} onChange={e => setFilterMode(e.target.value)}>
              <option value="All">All Modes</option>
              <option value="Charge">Charge</option>
              <option value="Discharge">Discharge</option>
              <option value="Standby">Standby</option>
              <option value="Peak Shaving">Peak Shaving</option>
              <option value="Backup">Backup</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select className="form-select" style={{ width: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
            <button className="btn btn-primary" onClick={openCreate}>Create Schedule</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th>Mode</th>
                <th>Target Power</th>
                <th>SOC Min</th>
                <th>SOC Max</th>
                <th>Repeat</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>SCH-{String(item.id).padStart(3, '0')}</td>
                  <td>{item.name}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>
                  <td><StatusBadge status={item.mode} /></td>
                  <td>{item.power ? `${item.power} kW` : '-'}</td>
                  <td>{item.socMin ?? '-'}</td>
                  <td>{item.socTarget ?? '-'}</td>
                  <td>{item.repeat}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>{item.createdBy}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Edit</button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setSchedules(prev =>
                            prev.map(row =>
                              row.id === item.id ? { ...row, status: row.status === 'Enabled' ? 'Disabled' : 'Enabled' } : row
                            )
                          )
                        }
                      >
                        {item.status === 'Enabled' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Schedule' : 'Create Schedule'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveSchedule}>Save Schedule</button>
          </>
        }
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Schedule Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Mode</label>
            <select className="form-select" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
              <option>Charge</option>
              <option>Discharge</option>
              <option>Standby</option>
              <option>Peak Shaving</option>
              <option>Backup</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input className="form-input" type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input className="form-input" type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Target Power (kW)</label>
            <input className="form-input" value={form.power} onChange={e => setForm({ ...form, power: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Repeat Type</label>
            <select className="form-select" value={form.repeat} onChange={e => setForm({ ...form, repeat: e.target.value })}>
              <option>Once</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">SOC Min (%)</label>
            <input className="form-input" value={form.socMin} onChange={e => setForm({ ...form, socMin: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">SOC Max (%)</label>
            <input className="form-input" value={form.socMax} onChange={e => setForm({ ...form, socMax: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
