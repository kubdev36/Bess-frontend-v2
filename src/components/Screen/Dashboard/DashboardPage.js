import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBatteryCharging,
  LuCable,
  LuFactory,
  LuGauge,
  LuPanelTop,
  LuSettings2,
  LuShield,
  LuSun,
} from "react-icons/lu";
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
import KPICard from "../../KPICard/KPICard";
import {
  mockEnergyReport,
  mockHourlyData,
  mockSystemSummary as sys,
} from "../../data/mockData";
import "./DashboardPage.scss";

const trendModes = [
  { key: "day", label: "Ngày" },
  { key: "month", label: "Tháng" },
];

const defaultChartDate = mockEnergyReport[0]?.date ?? "2026-05-19";

function formatMonthLabel(dateValue) {
  const [year, month] = dateValue.split("-");
  return `${month}/${year}`;
}

function formatValue(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function PowerTrendCard({ title, subtitle, defaultMode = "day" }) {
  const [mode, setMode] = useState(defaultMode);
  const [selectedDate, setSelectedDate] = useState(defaultChartDate);

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

  const modeSubtitle =
    mode === "day"
      ? `${subtitle} Theo dữ liệu ngày ${selectedDate}.`
      : `${subtitle} Theo dữ liệu tháng ${formatMonthLabel(selectedDate)}.`;

  return (
    <div className="card">
      <div className="card-header dashboard-chart-header">
        <div>
          <span className="card-title">{title}</span>
          <div className="card-subtitle">{modeSubtitle}</div>
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
            name={mode === "day" ? "Battery" : "Discharge"}
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="gridPower"
            name={mode === "day" ? "Grid" : "Grid Import"}
            stroke="#1677FF"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pvPower"
            name="PV"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="loadPower"
            name="Load"
            stroke="#22C55E"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard animate-fadeIn">
      <section className="dashboard-section">
        <div className="kpi-grid">
          <KPICard
            icon={<LuGauge />}
            title="SOC"
            value={`${sys.soc}%`}
            progress={sys.soc}
            progressColor="green"
            clickable
            onClick={() => navigate("/battery")}
          />
          <KPICard
            icon={<LuShield />}
            title="SOH"
            value={`${sys.soh}%`}
            progress={sys.soh}
            progressColor="green"
            clickable
            onClick={() => navigate("/battery")}
          />
          <KPICard
            icon={<LuBatteryCharging />}
            title="Battery Power"
            value={sys.batteryPower}
            unit="kW"
            status={sys.batteryPower < 0 ? "Charging" : "Discharging"}
            clickable
            onClick={() => navigate("/battery")}
          />
          <div className="dashboard-power-card charge-card">
            <div className="dashboard-power-card-label">Sạc</div>
            <div className="dashboard-power-card-body">
              <div className="dashboard-power-card-item">
                <span className="dashboard-power-card-item-label">Hôm nay</span>
                <div className="dashboard-power-card-item-value">
                  <span>{formatValue(Math.max(0, -sys.batteryPower))}</span>
                  <small>kW</small>
                </div>
              </div>
              <div className="dashboard-power-card-divider" />
              <div className="dashboard-power-card-item">
                <span className="dashboard-power-card-item-label">Tổng</span>
                <div className="dashboard-power-card-item-value">
                  <span>{formatValue(sys.todayCharge)}</span>
                  <small>kWh</small>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-power-card discharge-card">
            <div className="dashboard-power-card-label">Xả</div>
            <div className="dashboard-power-card-body">
              <div className="dashboard-power-card-item">
                <span className="dashboard-power-card-item-label">Hôm nay</span>
                <div className="dashboard-power-card-item-value">
                  <span>{formatValue(Math.max(0, sys.batteryPower))}</span>
                  <small>kW</small>
                </div>
              </div>
              <div className="dashboard-power-card-divider" />
              <div className="dashboard-power-card-item">
                <span className="dashboard-power-card-item-label">Tổng</span>
                <div className="dashboard-power-card-item-value">
                  <span>{formatValue(sys.todayDischarge)}</span>
                  <small>kWh</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section mt-base">
        <div className="card dashboard-visual-card">
          <div className="visual-layout">
            <div className="visual-layout-main">
              <div className="visual-scene">
                <div className="visual-scene-canvas">
                  <div className="visual-sky"></div>
                  <div className="visual-field"></div>

                  <div className="visual-pole visual-pole-left"></div>
                  <div className="visual-pole visual-pole-right"></div>

                  <div className="visual-info visual-info-left">
                    Grid:{" "}
                    <strong>
                      {sys.gridVoltage} kV / {sys.gridFrequency} Hz
                    </strong>
                  </div>

                  <div className="visual-stack visual-info-center">
                    <div className="visual-info">
                      Trạng thái hệ thống: <strong>{sys.systemStatus}</strong>
                    </div>
                    <div className="visual-info">
                      PCS AC Power: <strong>{sys.pcsACPower} kW</strong>
                    </div>
                    <div className="visual-info">
                      DC Bus: <strong>{sys.batteryVoltage} V</strong>
                    </div>
                  </div>

                  <div className="visual-panel-array">
                    <div className="visual-panel-grid"></div>
                  </div>

                  <div className="visual-inverter">
                    <LuSettings2 />
                  </div>

                  <div className="visual-battery-rack">
                    <div className="visual-battery-cell-row">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="visual-battery-core"></div>
                    <div className="visual-battery-cell-row">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="visual-load-block">
                    <LuFactory />
                  </div>

                  <div className="visual-line visual-line-green"></div>
                  <div className="visual-line visual-line-orange-left"></div>
                  <div className="visual-line visual-line-orange-right"></div>
                  <div className="visual-line visual-line-blue"></div>
                  <div className="visual-line visual-line-red"></div>

                  <div className="visual-label visual-label-pv">
                    <LuPanelTop />
                    <span>PV Array</span>
                  </div>
                  <div className="visual-label visual-label-grid">
                    <LuCable />
                    <span>Grid</span>
                  </div>
                  <div className="visual-label visual-label-pcs">
                    <LuSettings2 />
                    <span>PCS</span>
                  </div>
                  <div className="visual-label visual-label-battery">
                    <LuBatteryCharging />
                    <span>Battery Rack</span>
                  </div>
                  <div className="visual-label visual-label-load">
                    <LuFactory />
                    <span>Tải</span>
                  </div>

                  <div className="visual-info visual-info-bottom-left">
                    Công suất PV: <strong>{sys.pvPower} kW</strong>
                  </div>
                  <div className="visual-stack visual-info-bottom-center">
                    <div className="visual-info">
                      Battery Power: <strong>{sys.batteryPower} kW</strong>
                    </div>
                    <div className="visual-info">
                      SOC / SOH:{" "}
                      <strong>
                        {sys.soc}% / {sys.soh}%
                      </strong>
                    </div>
                  </div>
                  <div className="visual-info visual-info-bottom-right">
                    Tải tiêu thụ: <strong>{sys.loadPower} kW</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="visual-layout-side" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid mt-base">
        <PowerTrendCard
          title="Power Trend"
          subtitle="Xu hướng công suất của Battery, Grid, PV và Load."
          defaultMode="day"
        />
        <PowerTrendCard
          title="Power Trend"
          subtitle="Biểu đồ công suất tại khu vực bên phải."
          defaultMode="month"
        />
      </section>
    </div>
  );
}
