import React, { useMemo, useState } from 'react';
import Modal from '../../components/shared/Modal';
import StatusBadge from '../../components/shared/StatusBadge';
import { mockOperationLogs } from '../../data/mockData';
import './OperationLogsPage.css';

export default function OperationLogsPage() {
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('All');
  const [result, setResult] = useState('All');
  const [selected, setSelected] = useState(null);

  const modules = [...new Set(mockOperationLogs.map(item => item.module))];

  const rows = useMemo(
    () =>
      mockOperationLogs.filter(item => {
        if (module !== 'All' && item.module !== module) return false;
        if (result !== 'All' && item.result !== result) return false;
        if (search) {
          const keyword = search.toLowerCase();
          return item.description.toLowerCase().includes(keyword) || item.user.toLowerCase().includes(keyword);
        }
        return true;
      }),
    [module, result, search]
  );

  return (
    <div className="page-stack animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">Operation Logs</div>
            <div className="card-subtitle">Lịch sử đăng nhập, điều khiển, thay đổi tham số, lịch vận hành và export.</div>
          </div>
          <div className="page-toolbar-actions">
            <input className="form-input" style={{ width: 220 }} placeholder="Search keyword" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="form-select" style={{ width: 160 }} value={module} onChange={e => setModule(e.target.value)}>
              <option value="All">All Modules</option>
              {modules.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="form-select" style={{ width: 140 }} value={result} onChange={e => setResult(e.target.value)}>
              <option value="All">All Results</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
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
                <th>Log ID</th>
                <th>Time</th>
                <th>User</th>
                <th>Role</th>
                <th>Action Type</th>
                <th>Module</th>
                <th>Description</th>
                <th>IP</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(item => (
                <tr key={item.id} className={item.result === 'Failed' ? 'highlight-danger' : ''} onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
                  <td>LOG-{String(item.id).padStart(4, '0')}</td>
                  <td>{item.time}</td>
                  <td>{item.user}</td>
                  <td>{item.role}</td>
                  <td>{item.action}</td>
                  <td>{item.module}</td>
                  <td>{item.description}</td>
                  <td>{item.ip}</td>
                  <td><StatusBadge status={item.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? `Operation Log LOG-${String(selected.id).padStart(4, '0')}` : ''}>
        {selected && (
          <div className="detail-list">
            <div className="detail-item"><span className="detail-item-label">Description</span><span className="detail-item-value">{selected.description}</span></div>
            <div className="detail-item"><span className="detail-item-label">Result</span><span className="detail-item-value"><StatusBadge status={selected.result} /></span></div>
            <div className="detail-item"><span className="detail-item-label">Old Value</span><span className="detail-item-value">{selected.oldValue || '-'}</span></div>
            <div className="detail-item"><span className="detail-item-label">New Value</span><span className="detail-item-value">{selected.newValue || '-'}</span></div>
            <div className="detail-item"><span className="detail-item-label">Error</span><span className="detail-item-value">{selected.errorMessage || '-'}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
