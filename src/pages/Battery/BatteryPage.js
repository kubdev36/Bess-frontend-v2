import React, { useState } from 'react';
import { LuBadgeCheck, LuSearch } from 'react-icons/lu';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatusBadge from '../../components/shared/StatusBadge';
import { mockAlarms, mockContainers } from '../../data/mockData';
import './BatteryPage.css';

export default function BatteryPage() {
  const [selectedContainer, setSelectedContainer] = useState(mockContainers[0]);
  const [selectedRack, setSelectedRack] = useState(null);
  const [searchRack, setSearchRack] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredRacks = selectedContainer.racks.filter((r) => {
    const matchSearch = r.id.toLowerCase().includes(searchRack.toLowerCase());
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const batteryAlarms = mockAlarms.filter((a) => a.device === 'Battery' || a.device === 'BMS').slice(0, 8);

  const rackChartData = selectedRack
    ? Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        voltage: selectedRack.voltage + Math.sin(i / 4) * 5,
        temperature: selectedRack.temperature + Math.sin(i / 6) * 3,
        soc: selectedRack.soc + Math.sin(i / 3.8) * 5,
      }))
    : [];

  const getCellColor = (cell) => {
    if (cell.status === 'High') return '#EF4444';
    if (cell.status === 'Low') return '#F59E0B';
    const ratio = (cell.voltage - 3.0) / 0.35;
    const g = Math.round(180 + ratio * 75);
    return `rgb(34, ${Math.min(255, g)}, 94)`;
  };

  return (
    <div className="battery-page animate-fadeIn">
      <div className="grid grid-3">
        {mockContainers.map((c) => (
          <div
            key={c.id}
            className={`card battery-container-card ${selectedContainer.id === c.id ? 'selected' : ''}`}
            onClick={() => {
              setSelectedContainer(c);
              setSelectedRack(null);
            }}
          >
            <div className="flex items-center justify-between mb-sm">
              <span className="font-semibold text-lg">{c.name}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="battery-container-stats">
              <div><span className="text-secondary text-sm">Racks:</span> <span className="font-semibold">{c.racks.length}</span></div>
              <div><span className="text-secondary text-sm">SOC:</span> <span className="font-semibold">{c.soc}%</span></div>
              <div><span className="text-secondary text-sm">SOH:</span> <span className="font-semibold">{c.soh}%</span></div>
              <div><span className="text-secondary text-sm">Temp:</span> <span className="font-semibold">{c.temperature} degC</span></div>
            </div>
            {selectedContainer.id === c.id && (
              <div className="battery-selected-check">
                <LuBadgeCheck />
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card mt-base">
        <div className="card-header">
          <span className="card-title">Rack List - {selectedContainer.name}</span>
          <div className="flex items-center gap-sm">
            <div className="form-input-icon-wrapper" style={{ width: 180 }}>
              <span className="form-input-icon"><LuSearch /></span>
              <input
                className="form-input"
                style={{ height: 36 }}
                placeholder="Search rack..."
                value={searchRack}
                onChange={(e) => setSearchRack(e.target.value)}
              />
            </div>
            <select className="form-select" style={{ width: 130, height: 36 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Normal">Normal</option>
              <option value="Warning">Warning</option>
              <option value="Fault">Fault</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Rack</th><th>Status</th><th>Voltage</th><th>Current</th><th>SOC</th><th>SOH</th><th>Temp</th><th>Cycles</th></tr></thead>
            <tbody>
              {filteredRacks.map((r) => (
                <tr
                  key={r.id}
                  className={`${selectedRack?.id === r.id ? 'highlight-warning' : ''} ${r.status === 'Warning' ? 'highlight-warning' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedRack(r)}
                >
                  <td className="font-medium">{r.id}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{r.voltage}V</td>
                  <td>{r.current}A</td>
                  <td>{r.soc}%</td>
                  <td>{r.soh}%</td>
                  <td>{r.temperature} degC</td>
                  <td>{r.cycles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRack && (
        <div className="grid grid-2 mt-base">
          <div className="card">
            <div className="card-header"><span className="card-title">{selectedRack.id} Detail</span></div>
            <div className="rack-detail-grid">
              {[
                ['Voltage', `${selectedRack.voltage}V`],
                ['Current', `${selectedRack.current}A`],
                ['SOC', `${selectedRack.soc}%`],
                ['SOH', `${selectedRack.soh}%`],
                ['Max Cell V', `${selectedRack.maxCellV}V`],
                ['Min Cell V', `${selectedRack.minCellV}V`],
                ['Delta V', `${selectedRack.deltaV}V`],
                ['Max Temp', `${selectedRack.maxTemp} degC`],
                ['Cycles', selectedRack.cycles],
              ].map(([k, v]) => (
                <div key={k} className="rack-detail-item">
                  <span className="text-secondary text-sm">{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Cell Matrix</span></div>
            <div className="cell-matrix">
              {selectedRack.cells.map((cell) => (
                <div
                  key={cell.id}
                  className="cell-item"
                  style={{ background: getCellColor(cell) }}
                  title={`${cell.id}\nVoltage: ${cell.voltage}V\nTemp: ${cell.temperature} degC\nStatus: ${cell.status}`}
                >
                  <span className="cell-id">{cell.id.split('-').pop()}</span>
                  <span className="cell-voltage">{cell.voltage}V</span>
                </div>
              ))}
            </div>
            <div className="cell-legend mt-sm">
              <span><span className="cell-legend-dot" style={{ background: '#22C55E' }}></span> Normal</span>
              <span><span className="cell-legend-dot" style={{ background: '#F59E0B' }}></span> Low</span>
              <span><span className="cell-legend-dot" style={{ background: '#EF4444' }}></span> High</span>
            </div>
          </div>
        </div>
      )}

      {selectedRack && (
        <div className="grid grid-2 mt-base">
          <div className="card">
            <div className="card-header"><span className="card-title">Rack Trends</span></div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rackChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="voltage" name="Voltage" stroke="#1677FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="temperature" name="Temp" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Battery Alarms</span></div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Time</th><th>Level</th><th>Message</th><th>Status</th></tr></thead>
                <tbody>
                  {batteryAlarms.map((a) => (
                    <tr key={a.id}>
                      <td className="text-sm">{a.time.slice(11)}</td>
                      <td><StatusBadge status={a.level} /></td>
                      <td className="text-sm">{a.message}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
