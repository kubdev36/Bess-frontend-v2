import React from "react";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import "./KPICard.scss";
import StatusBadge from "../Modal/StatusBadge";

export default function KPICard({
  icon,
  title,
  value,
  unit,
  status,
  progress,
  progressColor = "green",
  trend,
  onClick,
  clickable,
}) {
  return (
    <div
      className={`kpi-card ${clickable ? "kpi-card-clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="kpi-card-top">
        <span className="kpi-card-icon">{icon}</span>
        <span className="kpi-card-title">{title}</span>
      </div>
      <div className="kpi-card-value-row">
        <span className="kpi-card-value">{value}</span>
        {unit && <span className="kpi-card-unit">{unit}</span>}
      </div>
      {status && (
        <div className="kpi-card-status">
          <StatusBadge status={status} size="small" />
        </div>
      )}
      {progress !== undefined && (
        <div className="kpi-card-progress">
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${progressColor}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
      {trend && (
        <div
          className={`kpi-card-trend ${trend.direction === "up" ? "trend-up" : "trend-down"}`}
        >
          {trend.direction === "up" ? <LuTrendingUp /> : <LuTrendingDown />}{" "}
          {trend.value}
        </div>
      )}
    </div>
  );
}
