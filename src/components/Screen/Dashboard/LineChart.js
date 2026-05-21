import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mockEnergyReport, mockHourlyData } from "../../data/mockData";

const defaultChartDate = mockEnergyReport[0]?.date ?? "2026-05-19";


export default function PowerTrendChart({
  titleId,
  subtitleId,
  defaultMode = "day",
}) {
  const intl = useIntl();
  const [mode, setMode] = useState(defaultMode);
  const [selectedDate, setSelectedDate] = useState(defaultChartDate);

  const trendModes = useMemo(
    () => [
      { key: "day", label: intl.formatMessage({ id: "dashboard_common_day" }) },
      {
        key: "month",
        label: intl.formatMessage({ id: "dashboard_common_month" }),
      },
    ],
    [intl],
  );

  const chartData = useMemo(() => {
    const selectedDay = Number(selectedDate.slice(-2)) || 1;
    if (mode === "month") {
      return mockEnergyReport
        .slice()
        .reverse()
        .filter((item) => item.date.slice(0, 7) === selectedDate.slice(0, 7))
        .map((item) => ({
          time: item.date.slice(8, 10),
          batteryPower: item.discharge + (selectedDay % 4),
          gridPower: item.gridImport + (selectedDay % 3),
          pvPower: item.pv + (selectedDay % 2),
          loadPower: item.load + (selectedDay % 5),
        }));
    }

    return mockHourlyData.map((item, index) => ({
      ...item,
      batteryPower:
        item.batteryPower + Math.round(Math.sin((index + selectedDay) / 4) * 8),
      gridPower:
        item.gridPower + Math.round(Math.cos((index + selectedDay) / 5) * 6),
      pvPower: Math.max(
        0,
        item.pvPower + Math.round(Math.sin((index + selectedDay) / 6) * 4),
      ),
      loadPower:
        item.loadPower + Math.round(Math.cos((index + selectedDay) / 7) * 5),
    }));
  }, [mode, selectedDate]);

  return (
    <div className="card">
      <div className="card-header dashboard-chart-header">
        <div>
          <span className="card-title">
            {intl.formatMessage({ id: titleId })}
          </span>
        </div>
        <div className="dashboard-chart-controls">
          <input
            type="date"
            className="dashboard-chart-date-input"
            value={selectedDate}
            min={mockEnergyReport[mockEnergyReport.length - 1]?.date}
            max={mockEnergyReport[0]?.date}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <div className="dashboard-chart-switcher">
            {trendModes.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`dashboard-chart-switcher-btn ${mode === item.key ? "active" : ""}`}
                onClick={() => setMode(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="batteryPower"
            name={
              mode === "day"
                ? intl.formatMessage({ id: "dashboard_chart_series_battery" })
                : intl.formatMessage({ id: "dashboard_chart_series_discharge" })
            }
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="gridPower"
            name={
              mode === "day"
                ? intl.formatMessage({ id: "dashboard_chart_series_grid" })
                : intl.formatMessage({ id: "dashboard_chart_series_grid_import" })
            }
            stroke="#1677FF"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="loadPower"
            name={intl.formatMessage({ id: "dashboard_chart_series_load" })}
            stroke="#22C55E"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
