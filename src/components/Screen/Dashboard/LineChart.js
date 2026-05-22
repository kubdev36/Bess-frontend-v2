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

const PowerTrendChart = ({
  titleId,
  subtitleId,
  defaultMode = "day",
}) => {
  const lang = useIntl();
  const [mode, setMode] = useState(defaultMode);
  const [selectedDate, setSelectedDate] = useState(defaultChartDate);

  const trendModes = useMemo(
    () => [
      { key: "day", label: lang.formatMessage({ id: "dashboard_common_day" }) },
      {
        key: "month",
        label: lang.formatMessage({ id: "dashboard_common_month" }),
      },
    ],
    [lang],
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
    <div className="DAT_LineChart_Card">
      <div className="DAT_LineChart_Card_Header">
        <div className="DAT_LineChart_Card_Header_Content">
          <span className="DAT_LineChart_Card_Header_Content_Title">
            {lang.formatMessage({ id: titleId })}
          </span>
        </div>
        <div className="DAT_LineChart_Card_Header_Controls">
          <input
            type="date"
            className="DAT_LineChart_Card_Header_Controls_DateInput"
            value={selectedDate}
            min={mockEnergyReport[mockEnergyReport.length - 1]?.date}
            max={mockEnergyReport[0]?.date}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <div className="DAT_LineChart_Card_Header_Controls_Switcher">
            {trendModes.map((item) => (
              <button
                key={item.key}
                type="button"
                className="DAT_LineChart_Card_Header_Controls_Switcher_Button"
                aria-pressed={mode === item.key}
                onClick={() => setMode(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="DAT_LineChart_Card_Body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 234, 242, 1)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="batteryPower"
              name={
                mode === "day"
                  ? lang.formatMessage({ id: "dashboard_chart_series_battery" })
                  : lang.formatMessage({ id: "dashboard_chart_series_discharge" })
              }
              stroke="rgba(14, 165, 233, 1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gridPower"
              name={
                mode === "day"
                  ? lang.formatMessage({ id: "dashboard_chart_series_grid" })
                  : lang.formatMessage({ id: "dashboard_chart_series_grid_import" })
              }
              stroke="rgba(22, 119, 255, 1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="loadPower"
              name={lang.formatMessage({ id: "dashboard_chart_series_load" })}
              stroke="rgba(34, 197, 94, 1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PowerTrendChart;
