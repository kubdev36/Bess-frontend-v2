import React from "react";
import { LuBatteryCharging, LuDownload, LuZap } from "react-icons/lu";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatusBadge from "../../Modal/StatusBadge";
import {
  mockHourlyData,
  mockPCSFaults,
  mockSystemSummary as sys,
} from "../../data/mockData";
import "./PCSPage.scss";
import { useIntl } from "react-intl";

export default function PCSPage() {
  const lang = useIntl();

  return (
    <div className="DAT_PCS">
      <div className="DAT_PCS_Card DAT_PCS_Overview">
        <div className="DAT_PCS_Overview_Main">
          <div className="DAT_PCS_Overview_Main_Item">
            <span className="DAT_PCS_Overview_Main_Item_Title">PCS-001</span>
            <StatusBadge status={sys.pcsStatus} />
          </div>
          <div className="DAT_PCS_Overview_Main_Item">
            <div className="DAT_PCS_Overview_Main_Item_Stat">
              <span className="DAT_PCS_Overview_Main_Item_Stat_Title">{lang.formatMessage({ id: "effciency" })}</span>
              <span className="DAT_PCS_Overview_Main_Item_Stat_Subtitle">{sys.pcsEfficiency}%</span>
            </div>
            <div className="DAT_PCS_Overview_Main_Item_Stat">
              <span className="DAT_PCS_Overview_Main_Item_Stat_Title">{lang.formatMessage({ id: "tempurature" })}</span>
              <span className="DAT_PCS_Overview_Main_Item_Stat_Subtitle">
                {sys.pcsTemperature} degC
              </span>
            </div>
            <div className="DAT_PCS_Overview_Main_Item_Stat">
              <span className="DAT_PCS_Overview_Main_Item_Stat_Title">{lang.formatMessage({ id: "power_factor" })}</span>
              <span className="DAT_PCS_Overview_Main_Item_Stat_Subtitle">{sys.pcsPowerFactor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="DAT_PCS_Side">
        <div className="DAT_PCS_Card DAT_PCS_Side_Card">
          <div className="DAT_PCS_Card_Header">
            <span className="DAT_PCS_Card_Title">
              <LuZap style={{ marginRight: 8, verticalAlign: "text-bottom" }} />
              AC
            </span>
          </div>
          <div className="DAT_PCS_Side_Params">
            {[
              [`${lang.formatMessage({ id: "power_AC" })}`, `${sys.pcsACPower} kW`],
              [`${lang.formatMessage({ id: "voltage_AC" })}`, `${sys.pcsACVoltage} V`],
              [`${lang.formatMessage({ id: "current_AC" })}`, `${sys.pcsACCurrent} A`],
              [`${lang.formatMessage({ id: "frequency" })}`, `${sys.pcsFrequency} Hz`],
              [`${lang.formatMessage({ id: "power_factor" })}`, sys.pcsPowerFactor],
            ].map(([k, v]) => (
              <div key={k} className="DAT_PCS_Side_Params_Row">
                <span className="DAT_PCS_Side_Params_Row_Key">{k}</span>
                <span className="DAT_PCS_Side_Params_Row_Value">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="DAT_PCS_Card DAT_PCS_Side_Card">
          <div className="DAT_PCS_Card_Header">
            <span className="DAT_PCS_Card_Title">
              <LuBatteryCharging
                style={{ marginRight: 8, verticalAlign: "text-bottom" }}
              />
              DC
            </span>
          </div>
          <div className="DAT_PCS_Side_Params">
            {[
              [`${lang.formatMessage({ id: "power_DC" })}`, `${sys.pcsDCPower} kW`],
              [`${lang.formatMessage({ id: "voltag_DC" })}`, `${sys.pcsDCVoltage} V`],
              [`${lang.formatMessage({ id: "current_DC" })}`, `${sys.pcsDCCurrent} A`],
            ].map(([k, v]) => (
              <div key={k} className="DAT_PCS_Side_Params_Row">
                <span className="DAT_PCS_Side_Params_Row_Key">{k}</span>
                <span className="DAT_PCS_Side_Params_Row_Value">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="DAT_PCS_Charts">
        <div className="DAT_PCS_Card DAT_PCS_Charts_Card">
          <div className="DAT_PCS_Card_Header">
            <span className="DAT_PCS_Card_Title">{lang.formatMessage({ id: "power_AC_DC" })}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="batteryPower"
                name={lang.formatMessage({ id: "power_DC" })}
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gridPower"
                name={lang.formatMessage({ id: "power_AC" })}
                stroke="#1677FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="DAT_PCS_Card DAT_PCS_Charts_Card">
          <div className="DAT_PCS_Card_Header">
            <span className="DAT_PCS_Card_Title">{lang.formatMessage({ id: "tempurature" })}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockHourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                name={lang.formatMessage({ id: "temp_PCS" })}
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="DAT_PCS_Card DAT_PCS_History">
        <div className="DAT_PCS_History_Header">
          <span className="DAT_PCS_History_Header_Title">Fault Code History</span>
          <button className="DAT_PCS_History_Header_Button">
            <LuDownload />
            {lang.formatMessage({ id: "export" })}
          </button>
        </div>
        <div className="DAT_PCS_History_Table">
          <table className="DAT_PCS_History_Table_Main">
            <thead>
              <tr>
                <th> {lang.formatMessage({ id: "time" })}</th>
                <th> {lang.formatMessage({ id: "code" })}</th>
                <th> {lang.formatMessage({ id: "name" })}</th>
                <th> {lang.formatMessage({ id: "level" })}</th>
                <th> {lang.formatMessage({ id: "status" })}</th>
                <th> {lang.formatMessage({ id: "description" })}</th>
              </tr>
            </thead>
            <tbody className="DAT_PCS_History_Table_Main_Body">
              {mockPCSFaults.map((f) => (
                <tr key={f.id} className="DAT_PCS_History_Table_Main_Body_Row">
                  <td className="DAT_PCS_History_Table_Main_Body_Row_Cell DAT_PCS_History_Table_Main_Body_Row_Cell--sm">{f.time}</td>
                  <td className="DAT_PCS_History_Table_Main_Body_Row_Cell DAT_PCS_History_Table_Main_Body_Row_Cell--medium">{f.code}</td>
                  <td className="DAT_PCS_History_Table_Main_Body_Row_Cell">{f.name}</td>
                  <td className="DAT_PCS_History_Table_Main_Body_Row_Cell">
                    <StatusBadge status={f.level} />
                  </td>
                  <td className="DAT_PCS_History_Table_Main_Body_Row_Cell">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="DAT_PCS_History_Table_Main_Body_Row_Cell DAT_PCS_History_Table_Main_Body_Row_Cell--sm DAT_PCS_History_Table_Main_Body_Row_Cell--secondary">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}