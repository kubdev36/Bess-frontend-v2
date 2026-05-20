import React, { useMemo, useState } from 'react';
import Modal from '../../components/shared/Modal';
import StatusBadge from '../../components/shared/StatusBadge';
import { mockCommands } from '../../data/mockData';
import './CommandHistoryPage.css';

export default function CommandHistoryPage() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selected, setSelected] = useState(null);

  const rows = useMemo(
    () =>
      mockCommands.filter(item => {
        if (filterStatus !== 'All' && item.status !== filterStatus) return false;
        if (filterType !== 'All' && item.type !== filterType) return false;
        return true;
      }),
    [filterStatus, filterType]
  );

  const commandTypes = [...new Set(mockCommands.map(item => item.type))];

  return (
    <div className="page-stack animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">Command History</div>
            <div className="card-subtitle">Theo dõi mọi lệnh điều khiển, trạng thái gửi lệnh và kết quả xử lý.</div>
          </div>
          <div className="page-toolbar-actions">
            <select className="form-select" style={{ width: 160 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {commandTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select className="form-select" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Failed">Failed</option>
              <option value="Timeout">Timeout</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="btn btn-ghost btn-sm">Export</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Command ID</th>
                <th>Time</th>
                <th>User</th>
                <th>Role</th>
                <th>Type</th>
                <th>Device</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Status</th>
                <th>Result</th>
                <th>IP</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(item => (
                <tr key={item.id} className={item.status === 'Failed' ? 'highlight-danger' : ''} onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
                  <td>CMD-{String(item.id).padStart(4, '0')}</td>
                  <td>{item.time}</td>
                  <td>{item.user}</td>
                  <td>{item.role}</td>
                  <td>{item.type}</td>
                  <td>{item.device}</td>
                  <td>{item.oldValue}</td>
                  <td>{item.newValue}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>{item.message || '-'}</td>
                  <td>{item.ip}</td>
                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? `Command CMD-${String(selected.id).padStart(4, '0')}` : ''}>
        {selected && (
          <div className="detail-list">
            <div className="detail-item"><span className="detail-item-label">Time</span><span className="detail-item-value">{selected.time}</span></div>
            <div className="detail-item"><span className="detail-item-label">User</span><span className="detail-item-value">{selected.user}</span></div>
            <div className="detail-item"><span className="detail-item-label">Type</span><span className="detail-item-value">{selected.type}</span></div>
            <div className="detail-item"><span className="detail-item-label">Status</span><span className="detail-item-value"><StatusBadge status={selected.status} /></span></div>
            <div className="detail-item"><span className="detail-item-label">Reason</span><span className="detail-item-value">{selected.reason}</span></div>
            <div className="detail-item"><span className="detail-item-label">Result Message</span><span className="detail-item-value">{selected.message || '-'}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
