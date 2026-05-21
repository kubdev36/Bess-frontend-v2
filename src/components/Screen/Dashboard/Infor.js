import React from "react";
import { useIntl } from "react-intl";
import StatusBadge from "../../Modal/StatusBadge";
import { mockSystemSummary as sys } from "../../data/mockData";

export default function Infor() {
  const intl = useIntl();

  return (
    <>
      <div className="dashboard-power-card dashboard-metric-card soc-card">
        <div className="dashboard-power-card-label">SOC</div>
        <div className="dashboard-power-card-body dashboard-metric-card-body">
          <div className="dashboard-metric-card-header">
            <span className="dashboard-metric-card-title">
              {intl.formatMessage({ id: "dashboard_kpi_battery_status" })}
            </span>
            <div className="dashboard-metric-card-status">
              <StatusBadge
                status={sys.batteryPower < 0 ? "Charging" : "Discharging"}
                size="small"
              />
            </div>
          </div>
          <div className="dashboard-metric-card-value">
            <span>{sys.soc}%</span>
          </div>
          <div className="dashboard-metric-card-progress">
            <div className="progress-bar">
              <div
                className="progress-bar-fill green"
                style={{ width: `${Math.min(100, Math.max(0, sys.soc))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-power-card dashboard-metric-card soh-card">
        <div className="dashboard-power-card-label">SOH</div>
        <div className="dashboard-power-card-body dashboard-metric-card-body">
          <div className="dashboard-metric-card-header">
            <span className="dashboard-metric-card-title">
              {intl.formatMessage({ id: "dashboard_kpi_battery_health" })}
            </span>
          </div>
          <div className="dashboard-metric-card-value">
            <span>{sys.soh}%</span>
          </div>
          <div className="dashboard-metric-card-progress">
            <div className="progress-bar">
              <div
                className="progress-bar-fill blue"
                style={{ width: `${Math.min(100, Math.max(0, sys.soh))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-power-card dashboard-metric-card power-output-card">
        <div className="dashboard-power-card-label">P</div>
        <div className="dashboard-power-card-body dashboard-metric-card-body">
          <div className="dashboard-metric-card-header">
            <span className="dashboard-metric-card-title">
              {intl.formatMessage({ id: "dashboard_kpi_power" })}
            </span>
          </div>
          <div className="dashboard-metric-card-value">
            <span>{sys.batteryPower}</span>
            <small>kW</small>
          </div>
        </div>
      </div>
    </>
  );
}
