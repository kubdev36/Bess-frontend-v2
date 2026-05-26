import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mockEnergyReport } from "../../data/mockData";
import "./EnergyReportPage.scss";

const presets = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "This month",
  "This year",
  "Custom range",
];

export default function EnergyReportPage() {
  const [preset, setPreset] = useState("Last 7 days");

  const rows = useMemo(() => {
    if (preset === "Today") return mockEnergyReport.slice(0, 1);
    if (preset === "Yesterday") return mockEnergyReport.slice(1, 2);
    if (preset === "Last 7 days") return mockEnergyReport.slice(0, 7);
    if (preset === "This month") return mockEnergyReport.slice(0, 30);
    if (preset === "This year") return mockEnergyReport;
    return mockEnergyReport.slice(0, 14);
  }, [preset]);

  const summary = rows.reduce(
    (acc, row) => ({
      charge: acc.charge + row.charge,
      discharge: acc.discharge + row.discharge,
      pv: acc.pv + row.pv,
      gridImport: acc.gridImport + row.gridImport,
      gridExport: acc.gridExport + row.gridExport,
      load: acc.load + row.load,
      efficiency: acc.efficiency + row.efficiency,
      cycles: acc.cycles + row.cycles,
    }),
    {
      charge: 0,
      discharge: 0,
      pv: 0,
      gridImport: 0,
      gridExport: 0,
      load: 0,
      efficiency: 0,
      cycles: 0,
    },
  );

  const avgEfficiency = rows.length
    ? (summary.efficiency / rows.length).toFixed(1)
    : 0;
  const costSaving = Math.round(summary.discharge * 0.12);
  const revenue = Math.round(summary.gridExport * 0.08);

  return (
    <div className="DAT_report">
      <div className="DAT_report_toolbar">
        <div className="DAT_report_toolbar_title">Energy Report</div>
        <div className="DAT_report_toolbar_subtitle">
          Theo dõi sạc, xả, PV, grid import/export và hiệu suất hệ thống.
        </div>
        <div className="DAT_report_toolbar_actions">
          <div className="DAT_report_toolbar_actions_opt">
            {presets.map((item) => (
              <button
                key={item}
                className={`DAT_report_toolbar_actions_opt_btn ${preset === item ? "active" : ""}`}
                onClick={() => setPreset(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="DAT_report_toolbar_actions_excel">Export Excel</button>
          <button className="DAT_report_toolbar_actions_pdf">Export PDF</button>
        </div>
      </div>

      <div className="DAT_report_stat">
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Total Charge Energy</span>
          <span className="DAT_report_stat_box_value">{summary.charge} kWh</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Total Discharge Energy</span>
          <span className="DAT_report_stat_box_value">{summary.discharge} kWh</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Round-trip Efficiency</span>
          <span className="DAT_report_stat_box_value">{avgEfficiency}%</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">PV Energy</span>
          <span className="DAT_report_stat_box_value">{summary.pv} kWh</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Grid Import</span>
          <span className="DAT_report_stat_box_value">{summary.gridImport} kWh</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Grid Export</span>
          <span className="DAT_report_stat_box_value">{summary.gridExport} kWh</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Load Consumption</span>
          <span className="DAT_report_stat_box_value">{summary.load} kWh</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Cycle Count</span>
          <span className="DAT_report_stat_box_value">{summary.cycles}</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Cost Saving</span>
          <span className="DAT_report_stat_box_value">${costSaving}</span>
        </div>
        <div className="DAT_report_stat_box">
          <span className="DAT_report_stat_box_label">Revenue</span>
          <span className="DAT_report_stat_box_value">${revenue}</span>
        </div>
      </div>

      <div className="DAT_report_chart">
        <div className="DAT_report_chart_container">
          <div className="DAT_report_chart_container_header">
            Charge / Discharge / PV
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rows.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="charge" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="discharge" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pv" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="DAT_report_chart_container">
          <div className="DAT_report_chart_container_header">
            Efficiency / Load Trend
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={rows.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#1677FF"
                fill="rgba(22,119,255,0.12)"
              />
              <Area
                type="monotone"
                dataKey="load"
                stroke="#14B8A6"
                fill="rgba(20,184,166,0.12)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="DAT_report_detail">
        <div className="DAT_report_detail_header">
          <span className="DAT_report_detail_header_title">Detailed Report Table</span>
          <span className="DAT_report_detail_header_subtitle">{rows.length} records</span>
        </div>
        {rows.length ? (
          <div className="DAT_report_detail_container">
            <table >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Charge</th>
                  <th>Discharge</th>
                  <th>PV</th>
                  <th>Grid Import</th>
                  <th>Grid Export</th>
                  <th>Load</th>
                  <th>Efficiency</th>
                  <th>Cycle Count</th>
                  <th>Cost Saving</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>{row.charge} kWh</td>
                    <td>{row.discharge} kWh</td>
                    <td>{row.pv} kWh</td>
                    <td>{row.gridImport} kWh</td>
                    <td>{row.gridExport} kWh</td>
                    <td>{row.load} kWh</td>
                    <td>{row.efficiency}%</td>
                    <td>{row.cycles}</td>
                    <td>${Math.round(row.discharge * 0.12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="DAT_report_detail_empty">
            <div className="DAT_report_detail_empty_icon">📭</div>
            <div className="DAT_report_detail_empty_text">No report data</div>
            <div className="DAT_report_detail_empty_sub">Try another time range.</div>
          </div>
        )}
      </div>
    </div>
  );
}
