import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { mockEnergyReport } from "../../data/mockData";
import "./EnergyReportPage.scss";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
);

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
    <div className="DAT_Report">
      <div className="DAT_Report_Toolbar">
        <div className="DAT_Report_Toolbar_Title">Energy Report</div>
        <div className="DAT_Report_Toolbar_Subtitle">
          Theo dõi sạc, xả, PV, grid import/export và hiệu suất hệ thống.
        </div>
        <div className="DAT_Report_Toolbar_Actions">
          <div className="DAT_Report_Toolbar_Actions_Opt">
            {presets.map((item) => (
              <button
                key={item}
                className={`DAT_Report_Toolbar_Actions_Opt_Btn ${preset === item ? "Active" : ""}`}
                onClick={() => setPreset(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="DAT_Report_Toolbar_Actions_Excel">Export Excel</button>
          <button className="DAT_Report_Toolbar_Actions_PDF">Export PDF</button>
        </div>
      </div>

      <div className="DAT_Report_Stat">
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Total Charge Energy</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.charge} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Total Discharge Energy</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.discharge} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Round-trip Efficiency</span>
          <span className="DAT_Report_Stat_Box_Value">{avgEfficiency}%</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">PV Energy</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.pv} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Grid Import</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.gridImport} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Grid Export</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.gridExport} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Load Consumption</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.load} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Cycle Count</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.cycles}</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Cost Saving</span>
          <span className="DAT_Report_Stat_Box_Value">${costSaving}</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">Revenue</span>
          <span className="DAT_Report_Stat_Box_Value">${revenue}</span>
        </div>
      </div>

      <div className="DAT_Report_Chart">
        <div className="DAT_Report_Chart_Container">
          <div className="DAT_Report_Chart_Container_Header">
            Charge / Discharge / PV
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <Bar
              data={{
                labels: rows
                  .slice()
                  .reverse()
                  .map((item) => item.date),

                datasets: [
                  {
                    label: "charge",
                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.charge),

                    backgroundColor: "#0EA5E9",
                    borderRadius: 4,
                  },

                  {
                    label: "discharge",
                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.discharge),

                    backgroundColor: "#8B5CF6",
                    borderRadius: 4,
                  },

                  {
                    label: "pv",
                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.pv),

                    backgroundColor: "#22C55E",
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },

                scales: {
                  x: {
                    grid: {
                      color: "#E5EAF2",
                      borderDash: [3, 3],
                    },

                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },

                  y: {
                    beginAtZero: true,

                    grid: {
                      color: "#E5EAF2",
                      borderDash: [3, 3],
                    },

                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="DAT_Report_Chart_Container">
          <div className="DAT_Report_Chart_Container_Header">
            Efficiency / Load Trend
          </div>
          {/* <ResponsiveContainer width="100%" height={280}>
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
          </ResponsiveContainer> */}
          <div style={{ width: "100%", height: 280 }}>
            <Line
              data={{
                labels: rows
                  .slice()
                  .reverse()
                  .map((item) => item.date),

                datasets: [
                  {
                    label: "efficiency",

                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.efficiency),

                    borderColor: "#1677FF",
                    backgroundColor: "rgba(22,119,255,0.12)",

                    fill: true,
                    tension: 0.4,
                  },

                  {
                    label: "load",

                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.load),

                    borderColor: "#14B8A6",
                    backgroundColor: "rgba(20,184,166,0.12)",

                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },

                scales: {
                  x: {
                    grid: {
                      color: "#E5EAF2",
                      borderDash: [3, 3],
                    },

                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },

                  y: {
                    beginAtZero: true,

                    grid: {
                      color: "#E5EAF2",
                      borderDash: [3, 3],
                    },

                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                },

                elements: {
                  point: {
                    radius: 0,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="DAT_Report_Detail">
        <div className="DAT_Report_Detail_Header">
          <span className="DAT_Report_Detail_Header_Title">Detailed Report Table</span>
          <span className="DAT_Report_Detail_Header_Subtitle">{rows.length} records</span>
        </div>
        {rows.length ? (
          <div className="DAT_Report_Detail_Container">
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
          <div className="DAT_Report_Detail_Empty">
            <div className="DAT_Report_Detail_Empty_Icon">📭</div>
            <div className="DAT_Report_Detail_Empty_Text">No report data</div>
            <div className="DAT_Report_Detail_Empty_Sub">Try another time range.</div>
          </div>
        )}
      </div>
    </div>
  );
}
