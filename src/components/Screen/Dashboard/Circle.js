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

const DonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="DAT_Power_Donut_Tooltip">
      <div style={{ fontWeight: 700, color: d.payload.color }}>{d.name}</div>
      <div className="DAT_Power_Donut_Tooltip_Value">
        <div className="DAT_Power_Donut_Tooltip_Value_Val">{d.value}</div>
        <div className="DAT_Power_Donut_Tooltip_Value_Unit">kW</div>
      </div>
    </div>
  );
}

const Circle = () => {
  const lang = useIntl();
  const data = useMemo(
    () =>
      [
        {
          name: lang.formatMessage({ id: "dashboard_energy_grid" }),
          value: Math.abs(sys.gridPower),
          color: DONUT_COLORS.grid,
        },
        {
          name: lang.formatMessage({ id: "dashboard_energy_battery" }),
          value: Math.abs(sys.batteryPower),
          color: DONUT_COLORS.battery,
        },
      ].filter((d) => d.value > 0),
    [lang],
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
    <div className="DAT_Power_Donut_Card">
      <div className="DAT_Power_Donut_Card_Header">
        <div>
          <span className="DAT_Power_Donut_Card_Header_Title">
            {lang.formatMessage({ id: "dashboard_donut_title" })}
          </span>
        </div>
      </div>

      <div className="DAT_Power_Donut_Chart_Wrap">
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

        <div className="DAT_Power_Donut_Center">
          <div className="DAT_Power_Donut_Center_Value">
            <div className="DAT_Power_Donut_Center_Value_Val">{total}</div>
          </div>
          <div className="DAT_Power_Donut_Center_Label">
            {lang.formatMessage({ id: "dashboard_donut_total_load" })}
          </div>
        </div>
      </div>

      <div className="DAT_Power_Donut_Legend">
        {data.map((d, index) => (
          <div className="DAT_Power_Donut_Legend_Item" key={index}>
            <span
              className="DAT_Power_Donut_Legend_Item_Dot"
              style={{ background: d.color }}
            />
            <span className="DAT_Power_Donut_Legend_Name">{d.name}</span>
            <div className="DAT_Power_Donut_Legend_Value">
              <div className="DAT_Power_Donut_Legend_Value_Val">{d.value}</div>
              <div className="DAT_Power_Donut_Legend_Value_Unit">kW</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Circle;
