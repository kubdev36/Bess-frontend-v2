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
import "./EnergyReport.scss";
import { useIntl } from "react-intl";


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
  "today",
  "yesterday",
  "last7days",
  "this_month",
  "this_year",
  "custom_range",
];

export default function EnergyReport() {
  const [preset, setPreset] = useState("Last 7 days");
  const lang = useIntl();

  // const rows = useMemo(() => {
  //   if (preset === "Today") return mockEnergyReport.slice(0, 1);
  //   if (preset === "Yesterday") return mockEnergyReport.slice(1, 2);
  //   if (preset === "Last 7 days") return mockEnergyReport.slice(0, 7);
  //   if (preset === "This month") return mockEnergyReport.slice(0, 30);
  //   if (preset === "This year") return mockEnergyReport;
  //   return mockEnergyReport.slice(0, 14);
  // }, [preset]);
 const rows = useMemo(() => {
    const now = new Date();

  return mockEnergyReport.filter((item) => {
    const d = new Date(item.date);

    switch (preset) {
      case "today":
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );

      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        return (
          d.getDate() === yesterday.getDate() &&
          d.getMonth() === yesterday.getMonth() &&
          d.getFullYear() === yesterday.getFullYear()
        );
      }

      case "last7days": {
        const last7 = new Date();
        last7.setDate(now.getDate() - 7);

        return d >= last7;
      }

      case "this_month":
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );

      case "this_year":
        return d.getFullYear() === now.getFullYear();

      case "custom_range":
        return true;

      default:
        return true;
    }
  });
  }, [preset, mockEnergyReport]);
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
        <div className="DAT_Report_Toolbar_Title">{lang.formatMessage({ id: "energy_report" })}</div>

        <div className="DAT_Report_Toolbar_Actions">
          <div className="DAT_Report_Toolbar_Actions_Opt">
            {presets.map((item) => (
              <button
                key={item}
                className={`DAT_Report_Toolbar_Actions_Opt_Btn ${preset === item ? "Active" : ""}`}
                onClick={() => {
                  setPreset(item);
                }}
              >
                {lang.formatMessage({ id: item })}
              </button>
            ))}
          </div>
          <button className="DAT_Report_Toolbar_Actions_Excel">{lang.formatMessage({ id: "export_excel" })}</button>
          <button className="DAT_Report_Toolbar_Actions_PDF">{lang.formatMessage({ id: "export_pdf" })}</button>
        </div>
      </div>

      <div className="DAT_Report_Stat">
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "total_charge" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.charge} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "total_discharge" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.discharge} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "round_trip" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{avgEfficiency}%</span>
        </div>

        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "dashboard_chart_series_grid_import" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.gridImport} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "grid_export" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.gridExport} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "load_consumption" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.load} kWh</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "cycle_count" })}</span>
          <span className="DAT_Report_Stat_Box_Value">{summary.cycles}</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "cost_saving" })}</span>
          <span className="DAT_Report_Stat_Box_Value">${costSaving}</span>
        </div>
        <div className="DAT_Report_Stat_Box">
          <span className="DAT_Report_Stat_Box_Label">{lang.formatMessage({ id: "revenue" })}</span>
          <span className="DAT_Report_Stat_Box_Value">${revenue}</span>
        </div>
      </div>

      <div className="DAT_Report_Chart">
        <div className="DAT_Report_Chart_Container">
          <div className="DAT_Report_Chart_Container_Header">
            {lang.formatMessage({ id: "charge" })} / {lang.formatMessage({ id: "discharge" })}
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
                    label: lang.formatMessage({ id: "charge" }),
                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.charge),

                    backgroundColor: "rgba(14, 165, 233, 1)",
                    borderRadius: 4,
                  },

                  {
                    label: lang.formatMessage({ id: "discharge" }),
                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.discharge),

                    backgroundColor: "rgba(139, 92, 246, 1)",
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
                  datalabels: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: "rgba(229, 234, 242, 1)",
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
                      color: "rgba(229, 234, 242, 1)",
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
            {lang.formatMessage({ id: "efficiency" })} / {lang.formatMessage({ id: "load_trend" })}
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <Line
              data={{
                labels: rows
                  .slice()
                  .reverse()
                  .map((item) => item.date),

                datasets: [
                  {
                    label: lang.formatMessage({ id: "efficiency" }),

                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.efficiency),

                    borderColor: "rgba(22, 119, 255, 1)",
                    backgroundColor: "rgba(22, 119, 255, 0.12)",

                    fill: true,
                    tension: 0.4,
                  },

                  {
                    label: lang.formatMessage({ id: "load" }),

                    data: rows
                      .slice()
                      .reverse()
                      .map((item) => item.load),

                    borderColor: "rgba(20, 184, 166, 1)",
                    backgroundColor: "rgba(20, 184, 166, 0.12)",

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
                  datalabels: {
                    display: false,
                  },
                },


                scales: {
                  x: {
                    grid: {
                      color: "rgba(229, 234, 242, 1)",
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
                      color: "rgba(229, 234, 242, 1)",
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
          <span className="DAT_Report_Detail_Header_Title">{lang.formatMessage({ id: "detailed_report_table" })}</span>
          <span className="DAT_Report_Detail_Header_Subtitle">{rows.length} {lang.formatMessage({ id: "records" })}</span>
        </div>
        {rows.length ? (
          <div className="DAT_Report_Detail_Container">
            <table >
              <thead>
                <tr>
                  <th>{lang.formatMessage({ id: "date" })}</th>
                  <th>{lang.formatMessage({ id: "charge" })}</th>
                  <th>{lang.formatMessage({ id: "discharge" })}</th>
                  <th>{lang.formatMessage({ id: "dashboard_chart_series_grid_import" })}</th>
                  <th>{lang.formatMessage({ id: "grid_export" })}</th>
                  <th>{lang.formatMessage({ id: "load" })}</th>
                  <th>{lang.formatMessage({ id: "efficiency" })}</th>
                  <th>{lang.formatMessage({ id: "cycle_count" })}</th>
                  <th>{lang.formatMessage({ id: "cost_saving" })}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>{row.charge} kWh</td>
                    <td>{row.discharge} kWh</td>
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
