import React, { useMemo } from "react";
import { LuCircleDollarSign, LuLeaf } from "react-icons/lu";
import { useIntl } from "react-intl";
import { mockEnergyReport } from "../../data/mockData";
import "./Economic.scss"
const GRID_PRICE = 2500;
const FIT_PRICE = 1943;
const CO2_FACTOR = 0.52;

const formatMoney = (value, locale) => {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

const EconomicBenefitCard = () => {
  const lang = useIntl();
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
      label: lang.formatMessage({ id: "dashboard_economic_revenue" }),
      value: formatMoney(stats.revenue, lang.locale),
      unit: "VND",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      icon: <LuLeaf />,
      label: lang.formatMessage({ id: "dashboard_economic_co2" }),
      value: (stats.co2 / 1000).toFixed(1),
      unit: lang.formatMessage({ id: "dashboard_economic_tons" }),
      color: "#059669",
      bg: "#d1fae5",
    },
  ];

  return (
    <div className="DAT_Economic_Card card">
      <div className="DAT_Economic_Card_Header">
        <div>
          <span className="DAT_Economic_Card_Header_Title">
            {lang.formatMessage({ id: "dashboard_economic_title" })}
          </span>
          <div className="DAT_Economic_Card_Header_Subtitle">
            {lang.formatMessage({ id: "dashboard_economic_last_30_days" })}
          </div>
        </div>
      </div>
      <div className="DAT_Economic_Card_Grid">
        {items.map((item, index) => (
          <div className="DAT_Economic_Card_Grid_Item" key={index}>
            <div
              className="DAT_Economic_Card_Grid_Item_Icon"
              style={{ background: item.bg, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="DAT_Economic_Card_Grid_Item_Body">
              <div className="DAT_Economic_Card_Grid_Item_Body_Label">{item.label}</div>
              <div
                className="DAT_Economic_Card_Grid_Item_Body_Value"
                style={{ color: item.color }}
              >
                <div className="DAT_Economic_Card_Grid_Item_Body_Value_Val">{item.value}</div>
                <div className="DAT_Economic_Card_Grid_Item_Body_Value_Unit">{item.unit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EconomicBenefitCard;
