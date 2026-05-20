import React from 'react';
import { LuBatteryCharging, LuDownload, LuZap } from 'react-icons/lu';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatusBadge from '../../components/shared/StatusBadge';
import { mockHourlyData, mockPCSFaults, mockSystemSummary as sys } from '../../data/mockData';
import './PCSPage.scss';

export default function PCSPage() {
  return (
    <div className="pcs animate-fadeIn">
      <div className="card pcs-overview">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-base">
            <span className="text-2xl font-bold">PCS-001</span>
            <StatusBadge status={sys.pcsStatus} />
          </div>
          <div className="flex items-center gap-lg">
            <div className="pcs-stat"><span className="text-sm text-secondary">Efficiency</span><span className="font-bold text-lg">{sys.pcsEfficiency}%</span></div>
            <div className="pcs-stat"><span className="text-sm text-secondary">Temperature</span><span className="font-bold text-lg">{sys.pcsTemperature} degC</span></div>
            <div className="pcs-stat"><span className="text-sm text-secondary">Power Factor</span><span className="font-bold text-lg">{sys.pcsPowerFactor}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-2 mt-base">
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <LuZap style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              AC Side
            </span>
          </div>
          <div className="pcs-params">
            {[
              ['AC Power', `${sys.pcsACPower} kW`],
              ['AC Voltage', `${sys.pcsACVoltage} V`],
              ['AC Current', `${sys.pcsACCurrent} A`],
              ['Frequency', `${sys.pcsFrequency} Hz`],
              ['Power Factor', sys.pcsPowerFactor],
            ].map(([k, v]) => (
              <div key={k} className="pcs-param-row">
                <span className="text-secondary">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <LuBatteryCharging style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              DC Side
            </span>
          </div>
          <div className="pcs-params">
            {[
              ['DC Power', `${sys.pcsDCPower} kW`],
              ['DC Voltage', `${sys.pcsDCVoltage} V`],
              ['DC Current', `${sys.pcsDCCurrent} A`],
            ].map(([k, v]) => (
              <div key={k} className="pcs-param-row">
                <span className="text-secondary">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2 mt-base">
        <div className="card">
          <div className="card-header"><span className="card-title">AC/DC Power</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="batteryPower" name="DC Power" stroke="#0EA5E9" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="gridPower" name="AC Power" stroke="#1677FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Temperature</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" name="PCS Temp" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-base">
        <div className="card-header">
          <span className="card-title">Fault Code History</span>
          <button className="btn btn-ghost btn-sm">
            <LuDownload />
            Export
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Time</th><th>Code</th><th>Name</th><th>Level</th><th>Status</th><th>Description</th></tr></thead>
            <tbody>
              {mockPCSFaults.map((f) => (
                <tr key={f.id}>
                  <td className="text-sm">{f.time}</td>
                  <td className="font-medium">{f.code}</td>
                  <td>{f.name}</td>
                  <td><StatusBadge status={f.level} /></td>
                  <td><StatusBadge status={f.status} /></td>
                  <td className="text-sm text-secondary">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
