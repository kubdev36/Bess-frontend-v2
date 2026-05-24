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

export default function PCSPage() {
  return (
    <div className="DAT_Pcs animate-fadeIn">
      <div className="card DAT_Pcs_Overview">
        <div className="DAT_Pcs_Overview_Main">
          <div className="DAT_Pcs_Overview_Main_Item">
            <span className="DAT_Pcs_Overview_Main_Item_Title">PCS-001</span>
            <StatusBadge status={sys.pcsStatus} />
          </div>
          <div className="DAT_Pcs_Overview_Main_Item">
            <div className="DAT_Pcs_Overview_Main_Item_Stat">
              <span className="DAT_Pcs_Overview_Main_Item_Stat_Title">Efficiency</span>
              <span className="DAT_Pcs_Overview_Main_Item_Stat_Subtitle">{sys.pcsEfficiency}%</span>
            </div>
            <div className="DAT_Pcs_Overview_Main_Item_Stat">
              <span className="DAT_Pcs_Overview_Main_Item_Stat_Title">Temperature</span>
              <span className="DAT_Pcs_Overview_Main_Item_Stat_Subtitle">
                {sys.pcsTemperature} degC
              </span>
            </div>
            <div className="DAT_Pcs_Overview_Main_Item_Stat">
              <span className="DAT_Pcs_Overview_Main_Item_Stat_Title">Power Factor</span>
              <span className="DAT_Pcs_Overview_Main_Item_Stat_Subtitle">{sys.pcsPowerFactor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="DAT_Pcs_Side">
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <LuZap style={{ marginRight: 8, verticalAlign: "text-bottom" }} />
              AC Side
            </span>
          </div>
          <div className="DAT_Pcs_Side_Params">
            {[
              ["AC Power", `${sys.pcsACPower} kW`],
              ["AC Voltage", `${sys.pcsACVoltage} V`],
              ["AC Current", `${sys.pcsACCurrent} A`],
              ["Frequency", `${sys.pcsFrequency} Hz`],
              ["Power Factor", sys.pcsPowerFactor],
            ].map(([k, v]) => (
              <div key={k} className="DAT_Pcs_Side_Params_Row">
                <span className="DAT_Pcs_Side_Params_Row_Key">{k}</span>
                <span className="DAT_Pcs_Side_Params_Row_Value">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <LuBatteryCharging
                style={{ marginRight: 8, verticalAlign: "text-bottom" }}
              />
              DC Side
            </span>
          </div>
          <div className="DAT_Pcs_Side_Params">
            {[
              ["DC Power", `${sys.pcsDCPower} kW`],
              ["DC Voltage", `${sys.pcsDCVoltage} V`],
              ["DC Current", `${sys.pcsDCCurrent} A`],
            ].map(([k, v]) => (
              <div key={k} className="DAT_Pcs_Side_Params_Row">
                <span className="DAT_Pcs_Side_Params_Row_Key">{k}</span>
                <span className="DAT_Pcs_Side_Params_Row_Value">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="DAT_Pcs_Power">
        <div className="DAT_Pcs_Power_Card">
          <div className="DAT_Pcs_Power_Card_Header">
            <span className="DAT_Pcs_Power_Card_Header_Title">AC/DC Power</span>
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
                name="DC Power"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="gridPower"
                name="AC Power"
                stroke="#1677FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="DAT_Pcs_Power_Card">
          <div className="DAT_Pcs_Power_Card_Header">
            <span className="DAT_Pcs_Power_Card_Header_Title">Temperature</span>
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
                name="PCS Temp"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="DAT_Pcs_History">
        <div className="DAT_Pcs_History_Header">
          <span className="DAT_Pcs_History_Header_Title">Fault Code History</span>
          <button className="DAT_Pcs_History_Header_Button">
            <LuDownload />
            Export
          </button>
        </div>
        <div className="DAT_Pcs_History_Table">
          <table className="DAT_Pcs_History_Table_Main">
            <thead>
              <tr>
                <th>Time</th>
                <th>Code</th>
                <th>Name</th>
                <th>Level</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody DAT_Pcs_History_Table_Main_Body>
              {mockPCSFaults.map((f) => (
                <tr key={f.id} className="DAT_Pcs_History_Table_Main_Body_Tr">
                  <td className="DAT_Pcs_History_Table_Main_Body_Tr_Td--sm">{f.time}</td>
                  <td className="DAT_Pcs_History_Table_Main_Body_Tr_Td--fmedium">{f.code}</td>
                  <td className="DAT_Pcs_History_Table_Main_Body_Tr_Td ">{f.name}</td>
                  <td className="DAT_Pcs_History_Table_Main_Body_Tr_Td ">
                    <StatusBadge status={f.level} />
                  </td>
                  <td className="DAT_Pcs_History_Table_Main_Body_Tr_Td ">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="DAT_Pcs_History_Table_Main_Body_Tr_Td--sm DAT_Pcs_History_Table_Main_Body_Tr_Td--secondary">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
