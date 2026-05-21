import React from "react";
import { useIntl } from "react-intl";
import { mockSystemSummary as sys } from "../../data/mockData";

function formatValue(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function PowerCard({ intl, label, className, todayValue, totalValue }) {
  return (
    <div className={`dashboard-power-card ${className}`}>
      <div className="dashboard-power-card-label">{label}</div>
      <div className="dashboard-power-card-body">
        <div className="dashboard-power-card-item">
          <span className="dashboard-power-card-item-label">
            {intl.formatMessage({ id: "dashboard_common_today" })}
          </span>
          <div className="dashboard-power-card-item-value">
            <div className="dashboard-power-card-item-value-val">
              {formatValue(todayValue)}
            </div>
            <div className="dashboard-power-card-item-value-unit">kW</div>
          </div>
        </div>
        <div className="dashboard-power-card-divider" />
        <div className="dashboard-power-card-item">
          <span className="dashboard-power-card-item-label">
            {intl.formatMessage({ id: "dashboard_common_total" })}
          </span>
          <div className="dashboard-power-card-item-value">
            <div className="dashboard-power-card-item-value-val">
              {formatValue(totalValue)}
            </div>
            <div className="dashboard-power-card-item-value-unit">kWh</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Infor2() {
  const intl = useIntl();

  return (
    <>
      <PowerCard
        intl={intl}
        label={intl.formatMessage({ id: "dashboard_kpi_charge" })}
        className="charge-card"
        todayValue={Math.max(0, -sys.batteryPower)}
        totalValue={sys.todayCharge}
      />
      <PowerCard
        intl={intl}
        label={intl.formatMessage({ id: "dashboard_kpi_discharge" })}
        className="discharge-card"
        todayValue={Math.max(0, sys.batteryPower)}
        totalValue={sys.todayDischarge}
      />
    </>
  );
}
