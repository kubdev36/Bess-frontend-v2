import React, { useMemo, useState } from 'react';
import { ConfirmModal } from '../../components/shared/Modal';
import { mockParameters } from '../../data/mockData';
import './ParameterPage.css';

const tabs = ['battery', 'pcs', 'grid', 'alarm', 'control'];

export default function ParameterPage() {
  const [activeTab, setActiveTab] = useState('battery');
  const [form, setForm] = useState(mockParameters);
  const [showConfirm, setShowConfirm] = useState(false);

  const changedFields = useMemo(() => {
    const changes = [];

    Object.entries(form).forEach(([section, value]) => {
      if (Array.isArray(value)) return;
      Object.entries(value).forEach(([key, current]) => {
        if (mockParameters[section][key] !== current) {
          changes.push({
            label: `${section}.${key}`,
            oldValue: String(mockParameters[section][key]),
            newValue: String(current),
          });
        }
      });
    });

    return changes;
  }, [form]);

  const renderObjectFields = section =>
    Object.entries(form[section]).map(([key, value]) => (
      <div key={key} className="form-group">
        <label className="form-label">{key}</label>
        <input
          className={`form-input ${mockParameters[section][key] !== value ? 'changed' : ''}`}
          value={String(value)}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              [section]: {
                ...prev[section],
                [key]: e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value,
              },
            }))
          }
        />
      </div>
    ));

  return (
    <div className="page-stack animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">Parameter Settings</div>
            <div className="card-subtitle">Chỉnh sửa thông số vận hành, ngưỡng cảnh báo và giới hạn điều khiển.</div>
          </div>
          <div className="page-toolbar-actions">
            <button className="btn btn-secondary" onClick={() => setForm(mockParameters)}>Reset Default</button>
            <button className="btn btn-primary" onClick={() => setShowConfirm(true)} disabled={!changedFields.length}>Save Changes</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'battery' && 'Battery Parameters'}
            {tab === 'pcs' && 'PCS Parameters'}
            {tab === 'grid' && 'Grid Parameters'}
            {tab === 'alarm' && 'Alarm Parameters'}
            {tab === 'control' && 'Control Limits'}
          </button>
        ))}
      </div>

      {activeTab !== 'alarm' ? (
        <div className="card">
          <div className="form-grid-2">{renderObjectFields(activeTab)}</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Enabled</th>
                  <th>Level</th>
                  <th>Threshold</th>
                  <th>Delay</th>
                  <th>Notify</th>
                </tr>
              </thead>
              <tbody>
                {form.alarm.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.enabled ? 'Yes' : 'No'}</td>
                    <td>{item.level}</td>
                    <td>{item.threshold}</td>
                    <td>{item.delay}s</td>
                    <td>{item.notify ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => setShowConfirm(false)}
        title="Confirm Parameter Changes"
        message="Review old value and new value before saving."
        changes={changedFields}
        requirePassword
        confirmText="Save Parameters"
      />
    </div>
  );
}
