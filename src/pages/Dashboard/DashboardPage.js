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
import KPICard from "../../components/shared/KPICard";
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

function PowerTrendCard({ title, subtitle, defaultMode = "day" }) {
  const [mode, setMode] = useState(defaultMode);

  const chartData = useMemo(() => {
    if (mode === "month") {
      return mockEnergyReport
        .slice()
        .reverse()
        .map((item) => ({
          time: item.date.slice(5),
          batteryPower: item.discharge,
          gridPower: item.gridImport,
          pvPower: item.pv,
          loadPower: item.load,
        }));
    }

    return mockHourlyData;
  }, [mode]);

  const modeSubtitle =
    mode === "day" ? `${subtitle} Theo dữ liệu trong ngày.` : `${subtitle} Theo dữ liệu theo tháng.`;

  return (
    <div className="card">
      <div className="card-header dashboard-chart-header">
        <div>
          <span className="card-title">{title}</span>
          <div className="card-subtitle">{modeSubtitle}</div>
        </div>
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
        <div className="kpi-grid kpi-grid-compact">
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
          <KPICard
            icon={<LuSun />}
            title="PV Power"
            value={sys.pvPower}
            unit="kW"
          />
          <KPICard
            icon={<LuCable />}
            title="Grid Power"
            value={sys.gridPower}
            unit="kW"
            status={sys.gridStatus}
          />
        </div>
      </section>

      <section className="dashboard-section mt-base">
        <div className="card dashboard-visual-card">
          <div className="card-header">
            <div>
              <span className="card-title">BESS Visual Board</span>
              <div className="card-subtitle">
                Mô hình trực quan theo hệ thống BESS: Grid, PV, PCS, Battery và
                Load.
              </div>
            </div>
          </div>

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
