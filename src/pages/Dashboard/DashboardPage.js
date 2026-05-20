import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuActivity,
  LuBadgeAlert,
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
import StatusBadge from "../../components/shared/StatusBadge";
import {
  mockAlarms,
  mockHourlyData,
  mockSystemSummary as sys,
} from "../../data/mockData";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const recentAlarms = useMemo(
    () => mockAlarms.filter((alarm) => alarm.status !== "Cleared").slice(0, 5),
    [],
  );

  return (
    <div className="dashboard-page animate-fadeIn">
      <section className="dashboard-section">
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

          <div className="visual-kpi-row">
            <div className="visual-kpi-box">
              <span className="visual-kpi-icon">
                <LuBatteryCharging />
              </span>
              <div>
                <div className="visual-kpi-label">Dung lượng khả dụng</div>
                <strong>{sys.availableEnergy} MWh</strong>
              </div>
            </div>

            <div className="visual-kpi-box">
              <span className="visual-kpi-icon">
                <LuShield />
              </span>
              <div>
                <div className="visual-kpi-label">Tình trạng pin</div>
                <strong>{sys.soh}% SOH</strong>
              </div>
            </div>

            <div className="visual-kpi-box">
              <span className="visual-kpi-icon">
                <LuBadgeAlert />
              </span>
              <div>
                <div className="visual-kpi-label">Cảnh báo hoạt động</div>
                <strong>{sys.activeAlarms} alarm</strong>
              </div>
            </div>
          </div>

          {/* // hình nền mô tả hệ thống */}
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

      {/* các thông số cơ bản */}
      <section className="dashboard-section mt-base">
        <div className="section-heading">
          <div>
            <h2 className="card-title">Realtime Overview</h2>
            <p className="card-subtitle">
              Các chỉ số chính cần theo dõi nhanh.
            </p>
          </div>
        </div>

        <div className="kpi-grid kpi-grid-compact">
          <KPICard
            icon={<LuActivity />}
            title="System Status"
            value={sys.systemStatus}
            status={sys.systemStatus}
          />
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
          <KPICard
            icon={<LuShield />}
            title="PCS Status"
            value={sys.pcsStatus}
            status={sys.pcsStatus}
          />
        </div>
      </section>

      <section className="dashboard-grid mt-base">
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Power Trend (24h)</span>
              <div className="card-subtitle">
                Xu hướng công suất của Battery, Grid, PV và Load.
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="batteryPower"
                name="Battery"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gridPower"
                name="Grid"
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

        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Alarm Center</span>
              <div className="card-subtitle">
                Các cảnh báo đang hoạt động gần nhất.
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/alarms")}
            >
              Xem tất cả
            </button>
          </div>
          <div className="event-list">
            {recentAlarms.map((alarm) => (
              <div key={alarm.id} className="event-item">
                <div>
                  <div className="event-title">{alarm.message}</div>
                  <div className="event-meta">
                    {alarm.time} | {alarm.device}
                  </div>
                </div>
                <StatusBadge status={alarm.level} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
