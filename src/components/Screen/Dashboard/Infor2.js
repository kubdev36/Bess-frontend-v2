import React from "react";
import { useIntl } from "react-intl";
import { mockSystemSummary as sys } from "../../data/mockData";

const formatValue = (value) => {
  return Number(value).toFixed(2).replace(/\.00$/, "");
};

const Infor2 = () => {
  const lang = useIntl();

  return (
    <div className="DAT_Infor2">
      <div className="DAT_Infor2_Card_Charge">
        <div className="DAT_Infor2_Card_Charge_Label">
          {lang.formatMessage({ id: "dashboard_kpi_charge" })}
        </div>
        <div className="DAT_Infor2_Card_Charge_Body">
          <div className="DAT_Infor2_Card_Charge_Body_Item">
            <span className="DAT_Infor2_Card_Charge_Body_Item_Label">
              {lang.formatMessage({ id: "dashboard_common_today" })}
            </span>
            <div className="DAT_Infor2_Card_Charge_Body_Item_Value">
              <div className="DAT_Infor2_Card_Charge_Body_Item_Value_Val">
                {formatValue(Math.max(0, -sys.batteryPower))}
              </div>
              <div className="DAT_Infor2_Card_Charge_Body_Item_Value_Unit">kW</div>
            </div>
          </div>
          <div className="DAT_Infor2_Card_Charge_Body_Divider" />
          <div className="DAT_Infor2_Card_Charge_Body_Item">
            <span className="DAT_Infor2_Card_Charge_Body_Item_Label">
              {lang.formatMessage({ id: "dashboard_common_total" })}
            </span>
            <div className="DAT_Infor2_Card_Charge_Body_Item_Value">
              <div className="DAT_Infor2_Card_Charge_Body_Item_Value_Val">
                {formatValue(sys.todayCharge)}
              </div>
              <div className="DAT_Infor2_Card_Charge_Body_Item_Value_Unit">kWh</div>
            </div>
          </div>
        </div>
      </div>

      <div className="DAT_Infor2_Card_Discharge">
        <div className="DAT_Infor2_Card_Discharge_Label">
          {lang.formatMessage({ id: "dashboard_kpi_discharge" })}
        </div>
        <div className="DAT_Infor2_Card_Discharge_Body">
          <div className="DAT_Infor2_Card_Discharge_Body_Item">
            <span className="DAT_Infor2_Card_Discharge_Body_Item_Label">
              {lang.formatMessage({ id: "dashboard_common_today" })}
            </span>
            <div className="DAT_Infor2_Card_Discharge_Body_Item_Value">
              <div className="DAT_Infor2_Card_Discharge_Body_Item_Value_Val">
                {formatValue(Math.max(0, sys.batteryPower))}
              </div>
              <div className="DAT_Infor2_Card_Discharge_Body_Item_Value_Unit">kW</div>
            </div>
          </div>
          <div className="DAT_Infor2_Card_Discharge_Body_Divider" />
          <div className="DAT_Infor2_Card_Discharge_Body_Item">
            <span className="DAT_Infor2_Card_Discharge_Body_Item_Label">
              {lang.formatMessage({ id: "dashboard_common_total" })}
            </span>
            <div className="DAT_Infor2_Card_Discharge_Body_Item_Value">
              <div className="DAT_Infor2_Card_Discharge_Body_Item_Value_Val">
                {formatValue(sys.todayDischarge)}
              </div>
              <div className="DAT_Infor2_Card_Discharge_Body_Item_Value_Unit">kWh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infor2;
