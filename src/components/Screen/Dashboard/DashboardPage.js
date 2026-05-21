import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBatteryCharging,
  LuCircleDollarSign,
  LuCloud,
  LuCloudRain,
  LuCloudSnow,
  LuCloudSun,
  LuGauge,
  LuLeaf,
  LuShield,
  LuSun,
} from "react-icons/lu";
import { useIntl } from "react-intl";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import KPICard from "../../KPICard/KPICard";
import StatusBadge from "../../Modal/StatusBadge";
import {
  mockEnergyReport,
  mockHourlyData,
  mockSystemSummary as sys,
} from "../../data/mockData";
import "./DashboardPage.scss";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER;
const WEATHER_CITY = "Ho Chi Minh City";
const GRID_PRICE = 2500;
const FIT_PRICE = 1943;
const CO2_FACTOR = 0.52;

const DONUT_COLORS = {
  grid: "#ef4444",
  pv: "#F59E0B",
  battery: "#22C55E",
  load: "#f43f5e",
};

const defaultChartDate = mockEnergyReport[0]?.date ?? "2026-05-19";

function createDateFromIso(dateValue) {
  const [year, month, day = "01"] = dateValue.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatDateLabel(dateValue, locale) {
  const date = createDateFromIso(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatMonthLabel(dateValue, locale) {
  const date = createDateFromIso(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
  }).format(date);
}

function formatValue(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function formatMoney(value, locale) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function getWeatherIcon(code, isDay, size = 32) {
  const style = { fontSize: size };
  if (code === 1000) {
    return isDay ? <LuSun style={style} /> : <LuCloud style={style} />;
  }
  if (code <= 1009) return <LuCloudSun style={style} />;
  if (code <= 1030) return <LuCloud style={style} />;
  if (code <= 1201) return <LuCloudRain style={style} />;
  if (code <= 1282) return <LuCloudSnow style={style} />;
  return <LuCloudSun style={style} />;
}

function getWeatherBg(code, isDay) {
  if (!isDay) return "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)";
  if (code === 1000) {
    return "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 60%, #bae6fd 100%)";
  }
  if (code <= 1009) return "linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)";
  if (code <= 1030) return "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)";
  if (code <= 1201) return "linear-gradient(135deg, #334155 0%, #475569 100%)";
  return "linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)";
}

const PowerCard = ({ label, className, todayValue, totalValue }) => {
  const intl = useIntl();

  return (
    <div className={`dashboard-power-card ${className}`}>
      <div className="dashboard-power-card-label">{label}</div>
      <div className="dashboard-power-card-body">
        <div className="dashboard-power-card-item">
          <span className="dashboard-power-card-item-label">
            {intl.formatMessage({ id: "dashboard.common.today" })}
          </span>
          <div className="dashboard-power-card-item-value">
            <span>{formatValue(todayValue)}</span>
            <small>kW</small>
          </div>
        </div>
        <div className="dashboard-power-card-divider" />
        <div className="dashboard-power-card-item">
          <span className="dashboard-power-card-item-label">
            {intl.formatMessage({ id: "dashboard.common.total" })}
          </span>
          <div className="dashboard-power-card-item-value">
            <span>{formatValue(totalValue)}</span>
            <small>kWh</small>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricRibbonCard = ({
  label,
  title,
  value,
  unit,
  className,
  progress,
  progressColor,
  status,
}) => (
  <div className={`dashboard-power-card dashboard-metric-card ${className}`}>
    <div className="dashboard-power-card-label">{label}</div>
    <div className="dashboard-power-card-body dashboard-metric-card-body">
      <div className="dashboard-metric-card-header">
        <span className="dashboard-metric-card-title">{title}</span>
        {status ? (
          <div className="dashboard-metric-card-status">
            <StatusBadge status={status} size="small" />
          </div>
        ) : null}
      </div>
      <div className="dashboard-metric-card-value">
        <span>{value}</span>
        {unit ? <small>{unit}</small> : null}
      </div>
      {progress !== undefined ? (
        <div className="dashboard-metric-card-progress">
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${progressColor}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  </div>
);

function WeatherWidget() {
  const intl = useIntl();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const weatherLang = intl.locale.startsWith("vi") ? "vi" : "en";

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(WEATHER_CITY)}&lang=${weatherLang}`,
    )
      .then((r) => r.json())
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, [weatherLang]);

  if (loading) {
    return <div className="weather-widget weather-widget--loading" />;
  }

  if (!weather) {
    return (
      <div className="weather-widget weather-widget--error">
        <LuCloudSun />
        <span>{intl.formatMessage({ id: "dashboard.weather.error" })}</span>
      </div>
    );
  }

  const { current, location } = weather;
  const code = current.condition.code;
  const isDay = current.is_day === 1;

  return (
    <div
      className="weather-widget"
      style={{ background: getWeatherBg(code, isDay) }}
    >
      <div className="weather-widget__orb weather-widget__orb--1" />
      <div className="weather-widget__orb weather-widget__orb--2" />

      <div className="weather-widget__top">
        <div>
          <div className="weather-widget__city">{location.name}</div>
          <div className="weather-widget__condition">{current.condition.text}</div>
        </div>
        <div className="weather-widget__icon-wrap">
          {getWeatherIcon(code, isDay)}
        </div>
      </div>

      <div className="weather-widget__temp">
        {Math.round(current.temp_c)}
        <span className="weather-widget__temp-unit">°C</span>
      </div>
    </div>
  );
}

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

function PowerDonutChart() {
  const intl = useIntl();
  const data = useMemo(
    () =>
      [
        {
          name: intl.formatMessage({ id: "dashboard.energy.grid" }),
          value: Math.abs(sys.gridPower),
          color: DONUT_COLORS.grid,
        },
        {
          name: intl.formatMessage({ id: "dashboard.energy.battery" }),
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
      ].reduce((s, value) => s + value, 0),
    [],
  );

  return (
    <div className="power-donut-card card">
      <div className="card-header">
        <div>
          <span className="card-title">
            {intl.formatMessage({ id: "dashboard.donut.title" })}
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
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="power-donut-center">
          <div className="power-donut-center-value">{total}</div>
          <div className="power-donut-center-label">
            {intl.formatMessage({ id: "dashboard.donut.total_load" })}
          </div>
        </div>
      </div>

      <div className="power-donut-legend">
        {data.map((d, i) => (
          <div className="power-donut-legend-item" key={i}>
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

function EconomicBenefitCard() {
  const intl = useIntl();
  const stats = useMemo(() => {
    const totalDischarge = mockEnergyReport.reduce((s, r) => s + r.discharge, 0);
    const totalPV = mockEnergyReport.reduce((s, r) => s + r.pv, 0);
    const revenue = totalDischarge * GRID_PRICE + totalPV * FIT_PRICE;
    const co2 = (totalDischarge + totalPV) * CO2_FACTOR;
    return { revenue, co2 };
  }, []);

  const items = [
    {
      icon: <LuCircleDollarSign />,
      label: intl.formatMessage({ id: "dashboard.economic.revenue" }),
      value: formatMoney(stats.revenue, intl.locale),
      unit: "VND",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      icon: <LuLeaf />,
      label: intl.formatMessage({ id: "dashboard.economic.co2" }),
      value: (stats.co2 / 1000).toFixed(1),
      unit: intl.formatMessage({ id: "dashboard.economic.tons" }),
      color: "#059669",
      bg: "#d1fae5",
    },
  ];

  return (
    <div className="economic-card card">
      <div className="card-header">
        <div>
          <span className="card-title">
            {intl.formatMessage({ id: "dashboard.economic.title" })}
          </span>
          <div className="card-subtitle">
            {intl.formatMessage({ id: "dashboard.economic.last_30_days" })}
          </div>
        </div>
      </div>
      <div className="economic-grid">
        {items.map((item, i) => (
          <div className="economic-item" key={i}>
            <div
              className="economic-item-icon"
              style={{ background: item.bg, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="economic-item-body">
              <div className="economic-item-label">{item.label}</div>
              <div
                className="economic-item-value"
                style={{ color: item.color }}
              >
                {item.value}
                <small>{item.unit}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PowerTrendCard({ titleId, subtitleId, defaultMode = "day" }) {
  const intl = useIntl();
  const [mode, setMode] = useState(defaultMode);
  const [selectedDate, setSelectedDate] = useState(defaultChartDate);

  const trendModes = useMemo(
    () => [
      { key: "day", label: intl.formatMessage({ id: "dashboard.common.day" }) },
      {
        key: "month",
        label: intl.formatMessage({ id: "dashboard.common.month" }),
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

  const modeSubtitle =
    mode === "day"
      ? intl.formatMessage(
          { id: "dashboard.chart.subtitle_day" },
          {
            subtitle: intl.formatMessage({ id: subtitleId }),
            date: formatDateLabel(selectedDate, intl.locale),
          },
        )
      : intl.formatMessage(
          { id: "dashboard.chart.subtitle_month" },
          {
            subtitle: intl.formatMessage({ id: subtitleId }),
            month: formatMonthLabel(selectedDate, intl.locale),
          },
        );

  return (
    <div className="card">
      <div className="card-header dashboard-chart-header">
        <div>
          <span className="card-title">
            {intl.formatMessage({ id: titleId })}
          </span>
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
            name={intl.formatMessage({
              id:
                mode === "day"
                  ? "dashboard.chart.series.battery"
                  : "dashboard.chart.series.discharge",
            })}
            stroke="#0EA5E9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="gridPower"
            name={intl.formatMessage({
              id:
                mode === "day"
                  ? "dashboard.chart.series.grid"
                  : "dashboard.chart.series.grid_import",
            })}
            stroke="#1677FF"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="loadPower"
            name={intl.formatMessage({ id: "dashboard.chart.series.load" })}
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
  const intl = useIntl();
  const navigate = useNavigate();

  return (
    <div className="dashboard animate-fadeIn">
      <section className="dashboard-section">
        <div className="kpi-grid">
          <MetricRibbonCard
            label="SOC"
            title={intl.formatMessage({ id: "dashboard.kpi.battery_status" })}
            value={`${sys.soc}%`}
            progress={sys.soc}
            progressColor="green"
            className="soc-card"
            status={sys.batteryPower < 0 ? "Charging" : "Discharging"}
          />
          <MetricRibbonCard
            label="SOH"
            title={intl.formatMessage({ id: "dashboard.kpi.battery_health" })}
            value={`${sys.soh}%`}
            progress={sys.soh}
            progressColor="blue"
            className="soh-card"
          />
          <MetricRibbonCard
            label="P"
            title={intl.formatMessage({ id: "dashboard.kpi.power" })}
            value={sys.batteryPower}
            unit="kW"
            className="power-output-card"
          />
          <KPICard
            icon={<LuGauge />}
            title={intl.formatMessage({ id: "dashboard.kpi.battery_status" })}
            value={`${sys.soc}%`}
            progress={sys.soc}
            progressColor="green"
            clickable
            onClick={() => navigate("/battery")}
          />
          <KPICard
            icon={<LuShield />}
            title={intl.formatMessage({ id: "dashboard.kpi.battery_health" })}
            value={`${sys.soh}%`}
            progress={sys.soh}
            progressColor="green"
            clickable
            onClick={() => navigate("/battery")}
          />
          <KPICard
            icon={<LuBatteryCharging />}
            title={intl.formatMessage({ id: "dashboard.kpi.battery_power" })}
            value={sys.batteryPower}
            unit="kW"
            status={sys.batteryPower < 0 ? "Charging" : "Discharging"}
            clickable
            onClick={() => navigate("/battery")}
          />
          <PowerCard
            label={intl.formatMessage({ id: "dashboard.kpi.charge" })}
            className="charge-card"
            todayValue={Math.max(0, -sys.batteryPower)}
            totalValue={sys.todayCharge}
          />
          <PowerCard
            label={intl.formatMessage({ id: "dashboard.kpi.discharge" })}
            className="discharge-card"
            todayValue={Math.max(0, sys.batteryPower)}
            totalValue={sys.todayDischarge}
          />
        </div>
      </section>

      <section className="dashboard-section mt-base">
        <div className="card dashboard-visual-card">
          <div className="visual-layout">
            <div className="visual-layout-main">
              <div className="visual-scene">
                <svg
                  viewBox="0 0 815 560"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <linearGradient
                      id="gradient"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="650"
                      y2="0"
                      spreadMethod="repeat"
                    >
                      <stop offset="0%" stopColor="white" stopOpacity="0" />
                      <stop offset="5%" stopColor="white" stopOpacity="1" />
                      <stop offset="10%" stopColor="white" stopOpacity="0" />
                      <stop offset="30%" stopColor="white" stopOpacity="0" />
                      <stop offset="35%" stopColor="white" stopOpacity="1" />
                      <stop offset="40%" stopColor="white" stopOpacity="0" />
                      <stop offset="60%" stopColor="white" stopOpacity="0" />
                      <stop offset="65%" stopColor="white" stopOpacity="1" />
                      <stop offset="70%" stopColor="white" stopOpacity="0" />
                      <stop offset="90%" stopColor="white" stopOpacity="1" />
                      <stop offset="95%" stopColor="white" stopOpacity="0" />
                      <animate attributeName="x1" attributeType="XML" values="-650; 650" dur="5s" begin="0s" repeatCount="indefinite" />
                      <animate attributeName="x2" attributeType="XML" values="0; 1300" dur="5s" begin="0s" repeatCount="indefinite" />
                    </linearGradient>

                    <mask id="gradient-mask" maskUnits="userSpaceOnUse">
                      <rect x="-2000" y="-2000" width="4000" height="4000" fill="url(#gradient)" />
                    </mask>

                    <linearGradient
                      id="gradient-reverse"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="650"
                      y2="0"
                      spreadMethod="repeat"
                    >
                      <stop offset="0%" stopColor="white" stopOpacity="0" />
                      <stop offset="5%" stopColor="white" stopOpacity="1" />
                      <stop offset="10%" stopColor="white" stopOpacity="0" />
                      <stop offset="30%" stopColor="white" stopOpacity="0" />
                      <stop offset="35%" stopColor="white" stopOpacity="1" />
                      <stop offset="40%" stopColor="white" stopOpacity="0" />
                      <stop offset="60%" stopColor="white" stopOpacity="0" />
                      <stop offset="65%" stopColor="white" stopOpacity="1" />
                      <stop offset="70%" stopColor="white" stopOpacity="0" />
                      <stop offset="90%" stopColor="white" stopOpacity="1" />
                      <stop offset="95%" stopColor="white" stopOpacity="0" />
                      <animate attributeName="x1" attributeType="XML" values="650; -650" dur="5s" begin="0s" repeatCount="indefinite" />
                      <animate attributeName="x2" attributeType="XML" values="1300; 0" dur="5s" begin="0s" repeatCount="indefinite" />
                    </linearGradient>

                    <mask id="gradient-mask-reverse" maskUnits="userSpaceOnUse">
                      <rect x="-2000" y="-2000" width="4000" height="4000" fill="url(#gradient-reverse)" />
                    </mask>

                    <linearGradient
                      id="gradient-vertical"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="300"
                      spreadMethod="repeat"
                    >
                      <stop offset="0%" stopColor="white" stopOpacity="0" />
                      <stop offset="5%" stopColor="white" stopOpacity="1" />
                      <stop offset="10%" stopColor="white" stopOpacity="0" />
                      <stop offset="30%" stopColor="white" stopOpacity="0" />
                      <stop offset="35%" stopColor="white" stopOpacity="1" />
                      <stop offset="40%" stopColor="white" stopOpacity="0" />
                      <stop offset="60%" stopColor="white" stopOpacity="0" />
                      <stop offset="65%" stopColor="white" stopOpacity="1" />
                      <stop offset="70%" stopColor="white" stopOpacity="0" />
                      <stop offset="90%" stopColor="white" stopOpacity="1" />
                      <stop offset="95%" stopColor="white" stopOpacity="0" />
                      <animate attributeName="y1" attributeType="XML" values="-200; 200" dur="5s" begin="0s" repeatCount="indefinite" />
                      <animate attributeName="y2" attributeType="XML" values="100; 500" dur="5s" begin="0s" repeatCount="indefinite" />
                    </linearGradient>

                    <mask id="gradient-mask-vertical" maskUnits="userSpaceOnUse">
                      <rect x="-2000" y="-2000" width="4000" height="4000" fill="url(#gradient-vertical)" />
                    </mask>
                  </defs>

                  <>
                    <rect
                      x="-347.19"
                      y="167.022"
                      width="395.836"
                      height="253.584"
                      style={{
                        fill: "rgb(216, 216, 216)",
                        stroke: "rgb(0, 0, 0)",
                        transformBox: "fill-box",
                        transformOrigin: "50% 50%",
                        strokeWidth: "0px",
                      }}
                      transform="matrix(0.896181, -0.443689, 1.126672, 0.558043, 542.66611, 70.966677)"
                    />
                    <foreignObject x="250" y="110" width="450" height="250">
                      <img src="/pictures/tree_day.png" alt="" width="100%" height="100%" />
                    </foreignObject>
                    <foreignObject x="145" y="100" width="100" height="250">
                      <img src="/pictures/Grid.png" alt="" width="100%" height="100%" />
                    </foreignObject>
                    <foreignObject x="150" y="180" width="500" height="300">
                      <img src="/pictures/Factory.png" alt="" width="100%" height="100%" />
                    </foreignObject>
                  </>

                  <path id="LineA" className="path" d="M 119.941 149.954 L 160.13 150.076" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(0, 0, 0, 0.5)", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "3", overflow: "hidden" }} />
                  <path id="LineA1" className="path" d="M 155.125 210.84 C 157.373 280.604 169.304 304.053 224.993 313.377 C 224.993 313.377 305.421 370.525 314.872 379.42 L 323.997 375.566 L 324.426 428.75" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(0, 0, 0, 0.2)", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", overflow: "hidden" }} />
                  <path id="LineA2" className="path" d="M 155.125 210.84 C 157.373 280.604 169.304 304.053 224.993 313.377 C 224.993 313.377 305.421 370.525 314.872 379.42 L 323.997 375.566 L 324.426 428.75" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(255, 48, 29, 1)", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", overflow: "hidden", mask: "url(#gradient-mask)" }} />
                  <foreignObject x="20" y="100" width="100" height="80">
                    <div className="DAT_DataText" style={{ border: "1px solid rgba(255, 48, 29, 1)" }}>
                      <div className="DAT_DataText_Data">
                        <div className="DAT_DataText_Data_Val">1.90</div>
                        <div className="DAT_DataText_Data_Unit">kW</div>
                      </div>
                      <span style={{ color: "rgba(255, 48, 29, 1)" }}>
                        {intl.formatMessage({ id: "dashboard.energy.grid" })}
                      </span>
                    </div>
                  </foreignObject>

                  <path id="LineB" className="path" d="M 272.337 478.882 L 272.575 426.829" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(0, 0, 0, 0.5)", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "3", overflow: "hidden" }} />
                  <path id="LineB1" className="path" d="M 270.899 422.274 L 319.268 446.595" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(0, 0, 0, 0.2)", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", overflow: "hidden" }} />
                  <path id="LineB2" className="path" d="M 270.899 422.274 L 319.268 446.595" style={{ width: "100%", height: "100%", fill: "none", stroke: "#E4B322", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", overflow: "hidden", mask: "url(#gradient-mask-reverse)" }} />
                  <foreignObject x="265" y="415" width="20" height="20">
                    <div style={{ backgroundColor: "rgba(255, 255, 255, 1)", width: "15px", height: "15px", borderRadius: "50%", border: "solid 2px #E4B322" }} />
                  </foreignObject>
                  <foreignObject x="200" y="480" width="100" height="80">
                    <div className="DAT_DataText" style={{ border: "1px solid #E4B322" }}>
                      <div className="DAT_DataText_Data">
                        <div className="DAT_DataText_Data_Val">2.50</div>
                        <div className="DAT_DataText_Data_Unit">kW</div>
                      </div>
                      <span style={{ color: "#E4B322" }}>
                        {intl.formatMessage({ id: "dashboard.energy.load_consumption" })}
                      </span>
                    </div>
                  </foreignObject>

                  <path id="LineC" className="path" d="M 488.186 424.065 L 559.386 423.993" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(0, 0, 0, 0.5)", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "3", overflow: "hidden" }} />
                  <path id="LineC1" className="path" d="M 343.43 439.664 L 381.893 421.39" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(0, 0, 0, 0.2)", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", overflow: "hidden" }} />
                  <path id="LineC2" className="path" d="M 343.43 439.664 L 381.893 421.39" style={{ width: "100%", height: "100%", fill: "none", stroke: "rgba(32, 128, 245, 1)", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", overflow: "hidden", mask: "url(#gradient-mask-reverse)" }} />
                  <foreignObject x="560" y="410" width="100" height="80">
                    <div className="DAT_DataText" style={{ border: "1px solid rgba(32, 128, 245, 1)" }}>
                      <div className="DAT_DataText_Data">
                        <div className="DAT_DataText_Data_Val">1.87</div>
                        <div className="DAT_DataText_Data_Unit">kW</div>
                      </div>
                      <span style={{ color: "rgba(32, 128, 245, 1)" }}>
                        {intl.formatMessage({ id: "dashboard.energy.storage" })}
                      </span>
                    </div>
                  </foreignObject>

                  <foreignObject
                    x="375"
                    y="375"
                    width="115"
                    height="90"
                    style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
                    transform="matrix(0.935735, -0.056624, 0.023937, 0.9478, -0.92938, -9.527987)"
                  >
                    <img src="/pictures/bess.png" alt="" width="100%" height="100%" />
                  </foreignObject>
                  <foreignObject
                    x="338.009"
                    y="220"
                    width="35"
                    height="50"
                    style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
                    transform="matrix(0.868623, -0.019845, 0.026762, 1.021506, -21.485769, 204.175858)"
                  >
                    <img
                      src="/pictures/Bat.png"
                      alt=""
                      width="100%"
                      height="100%"
                      style={{ transform: "scaleX(-1)" }}
                    />
                  </foreignObject>
                </svg>
              </div>
            </div>

            <div className="visual-layout-side">
              <WeatherWidget />
              <PowerDonutChart />
              <EconomicBenefitCard />
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid mt-base">
        <PowerTrendCard
          titleId="dashboard.chart.title"
          subtitleId="dashboard.chart.main.subtitle"
          defaultMode="day"
        />
        <PowerTrendCard
          titleId="dashboard.chart.title"
          subtitleId="dashboard.chart.secondary.subtitle"
          defaultMode="month"
        />
      </section>
    </div>
  );
}
