import React from "react";
import { useIntl } from "react-intl";
import StatusBadge from "../../Modal/StatusBadge";
import { mockSystemSummary as sys } from "../../data/mockData";

const Infor = () => {
  const lang = useIntl();

  return (
    <div className="DAT_Infor">
      <div className="DAT_Infor_Card_SOC">
        <div className="DAT_Infor_Card_SOC_Label">
          {lang.formatMessage({ id: "dashboard_kpi_soc_short", defaultMessage: "SOC" })}
        </div>
        <div className="DAT_Infor_Card_SOC_Body">
          <div className="DAT_Infor_Card_SOC_Body_Header">
            <div className="DAT_Infor_Card_SOC_Body_Header_Title">
              {lang.formatMessage({ id: "dashboard_kpi_battery_status" })}
            </div>
            <div className="DAT_Infor_Card_SOC_Body_Header_Status">
              <StatusBadge
                status={sys.batteryPower < 0 ? "Charging" : "Discharging"}
                size="small"
              />
            </div>
          </div>
          <div className="DAT_Infor_Card_SOC_Body_Value">
            <div className="DAT_Infor_Card_SOC_Body_Value_Val">{sys.soc}%</div>
          </div>
          <div className="DAT_Infor_Card_SOC_Body_Progress">
            <div className="DAT_Infor_Card_SOC_Body_Progress_Bar">
              <div
                className="DAT_Infor_Card_SOC_Body_Progress_Bar_Fill"
                style={{ width: `${Math.min(100, Math.max(0, sys.soc))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="DAT_Infor_Card_SOH">
        <div className="DAT_Infor_Card_SOH_Label">
          {lang.formatMessage({ id: "dashboard_kpi_soh_short", defaultMessage: "SOH" })}
        </div>
        <div className="DAT_Infor_Card_SOH_Body">
          <div className="DAT_Infor_Card_SOH_Body_Header">
            <div className="DAT_Infor_Card_SOH_Body_Header_Title">
              {lang.formatMessage({ id: "dashboard_kpi_battery_health" })}
            </div>
          </div>
          <div className="DAT_Infor_Card_SOH_Body_Value">
            <div className="DAT_Infor_Card_SOH_Body_Value_Val">{sys.soh}%</div>
          </div>
          <div className="DAT_Infor_Card_SOH_Body_Progress">
            <div className="DAT_Infor_Card_SOH_Body_Progress_Bar">
              <div
                className="DAT_Infor_Card_SOH_Body_Progress_Bar_Fill"
                style={{ width: `${Math.min(100, Math.max(0, sys.soh))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="DAT_Infor_Card_PowerOutput">
        <div className="DAT_Infor_Card_PowerOutput_Label">
          {lang.formatMessage({ id: "dashboard_kpi_power_short", defaultMessage: "P" })}
        </div>
        <div className="DAT_Infor_Card_PowerOutput_Body">
          <div className="DAT_Infor_Card_PowerOutput_Body_Header">
            <div className="DAT_Infor_Card_PowerOutput_Body_Header_Title">
              {lang.formatMessage({ id: "dashboard_kpi_power" })}
            </div>
          </div>
          <div className="DAT_Infor_Card_PowerOutput_Body_Value">
            <div className="DAT_Infor_Card_PowerOutput_Body_Value_Val">{sys.batteryPower}</div>
            <div className="DAT_Infor_Card_PowerOutput_Body_Value_Unit">kW</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infor;
