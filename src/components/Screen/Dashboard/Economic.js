import React, { useMemo } from "react";
import { LuCircleDollarSign, LuLeaf } from "react-icons/lu";
import { useIntl } from "react-intl";
import { mockEnergyReport } from "../../data/mockData";

const GRID_PRICE = 2500;
const FIT_PRICE = 1943;
const CO2_FACTOR = 0.52;

function formatMoney(value, locale) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export default function EconomicBenefitCard() {
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
      label: intl.formatMessage({ id: "dashboard_economic_revenue" }),
      value: formatMoney(stats.revenue, intl.locale),
      unit: "VND",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      icon: <LuLeaf />,
      label: intl.formatMessage({ id: "dashboard_economic_co2" }),
      value: (stats.co2 / 1000).toFixed(1),
      unit: intl.formatMessage({ id: "dashboard_economic_tons" }),
      color: "#059669",
      bg: "#d1fae5",
    },
  ];

  return (
    <div className="economic-card card">
      <div className="card-header">
        <div>
          <span className="card-title">
            {intl.formatMessage({ id: "dashboard_economic_title" })}
          </span>
          <div className="card-subtitle">
            {intl.formatMessage({ id: "dashboard_economic_last_30_days" })}
          </div>
        </div>
      </div>
      <div className="economic-grid">
        {items.map((item, index) => (
          <div className="economic-item" key={index}>
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
                <div className="economic-item-value-val">{item.value}</div>
                <div className="economic-item-value-unit">{item.unit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
