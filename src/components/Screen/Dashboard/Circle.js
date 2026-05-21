import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { mockSystemSummary as sys } from "../../data/mockData";

const DONUT_COLORS = {
  grid: "#ef4444",
  battery: "#22C55E",
};

const RADIAN = Math.PI / 180;

function DonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="donut-tooltip">
      <div style={{ fontWeight: 700, color: d.payload.color }}>{d.name}</div>
      <div>{d.value} kW</div>
    </div>
  );
}

export default function Circle() {
  const intl = useIntl();
  const data = useMemo(
    () =>
      [
        {
          name: intl.formatMessage({ id: "dashboard_energy_grid" }),
          value: Math.abs(sys.gridPower),
          color: DONUT_COLORS.grid,
        },
        {
          name: intl.formatMessage({ id: "dashboard_energy_battery" }),
          value: Math.abs(sys.batteryPower),
          color: DONUT_COLORS.battery,
        },
      ].filter((d) => d.value > 0),
    [intl],
  );

  const total = useMemo(
    () =>
      [
        Math.abs(sys.gridPower),
        Math.abs(sys.pvPower),
        Math.abs(sys.batteryPower),
      ].reduce((sum, value) => sum + value, 0),
    [],
  );

  return (
    <div className="power-donut-card card">
      <div className="card-header">
        <div>
          <span className="card-title">
            {intl.formatMessage({ id: "dashboard_donut_title" })}
          </span>
        </div>
      </div>

      <div className="power-donut-chart-wrap">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={DonutLabel}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="power-donut-center">
          <div className="power-donut-center-value">{total}</div>
          <div className="power-donut-center-label">
            {intl.formatMessage({ id: "dashboard_donut_total_load" })}
          </div>
        </div>
      </div>

      <div className="power-donut-legend">
        {data.map((d, index) => (
          <div className="power-donut-legend-item" key={index}>
            <span
              className="power-donut-legend-dot"
              style={{ background: d.color }}
            />
            <span className="power-donut-legend-name">{d.name}</span>
            <span className="power-donut-legend-val">{d.value} kW</span>
          </div>
        ))}
      </div>
    </div>
  );
}
