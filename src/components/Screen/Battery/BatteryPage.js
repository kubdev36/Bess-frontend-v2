import React, { useState } from "react";
import { LuBadgeCheck, LuSearch } from "react-icons/lu";
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
import { mockAlarms, mockContainers } from "../../data/mockData";
import "./BatteryPage.scss";

export default function BatteryPage() {
  const [selectedContainer, setSelectedContainer] = useState(mockContainers[0]);
  const [selectedRack, setSelectedRack] = useState(null);
  const [searchRack, setSearchRack] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredRacks = selectedContainer.racks.filter((r) => {
    const matchSearch = r.id.toLowerCase().includes(searchRack.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const batteryAlarms = mockAlarms
    .filter((a) => a.device === "Battery" || a.device === "BMS")
    .slice(0, 8);

  const rackChartData = selectedRack
    ? Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        voltage: selectedRack.voltage + Math.sin(i / 4) * 5,
        temperature: selectedRack.temperature + Math.sin(i / 6) * 3,
        soc: selectedRack.soc + Math.sin(i / 3.8) * 5,
      }))
    : [];

  const getCellColor = (cell) => {
    if (cell.status === "High") return "#EF4444";
    if (cell.status === "Low") return "#F59E0B";
    const ratio = (cell.voltage - 3.0) / 0.35;
    const g = Math.round(180 + ratio * 75);
    return `rgb(34, ${Math.min(255, g)}, 94)`;
  };

  return (
    <div className="DAT_Battery">
      <div className="DAT_Battery_Overview">
        {mockContainers.map((c) => (
          <div
            key={c.id}
            className={`DAT_Battery_Overview_Card ${selectedContainer.id === c.id ? "DAT_Battery_Overview_Card--selected" : ""}`}
            onClick={() => {
              setSelectedContainer(c);
              setSelectedRack(null);
            }}
          >
            <div className="DAT_Battery_Overview_Card_Header">
              <span className="DAT_Battery_Overview_Card_Header_Title">{c.name}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="DAT_Battery_Overview_Card_Stats">
              <div>
                <span className="DAT_Battery_Overview_Card_Stats_Label">Racks:</span>{" "}
                <span className="DAT_Battery_Overview_Card_Stats_Value">{c.racks.length}</span>
              </div>
              <div>
                <span className="DAT_Battery_Overview_Card_Stats_Label">SOC:</span>{" "}
                <span className="DAT_Battery_Overview_Card_Stats_Value">{c.soc}%</span>
              </div>
              <div>
                <span className="DAT_Battery_Overview_Card_Stats_Label">SOH:</span>{" "}
                <span className="DAT_Battery_Overview_Card_Stats_Value">{c.soh}%</span>
              </div>
              <div>
                <span className="DAT_Battery_Overview_Card_Stats_Label">Temp:</span>{" "}
                <span className="DAT_Battery_Overview_Card_Stats_Value">{c.temperature} degC</span>
              </div>
            </div>
            {selectedContainer.id === c.id && (
              <div className="DAT_Battery_Overview_Card_Badge">
                <LuBadgeCheck />
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="DAT_Battery_RackList">
        <div className="DAT_Battery_RackList_Header">
          <span className="DAT_Battery_RackList_Header_Title">
            Rack List - {selectedContainer.name}
          </span>
          <div className="DAT_Battery_RackList_Filter">
            <div className="DAT_Battery_RackList_Filter_Search" style={{ width: 180 }}>
              <span className="DAT_Battery_RackList_Filter_Search_Icon">
                <LuSearch />
              </span>
              <input
                className="DAT_Battery_RackList_Filter_Search_Input"
                style={{ height: 36 }}
                placeholder="Search rack..."
                value={searchRack}
                onChange={(e) => setSearchRack(e.target.value)}
              />
            </div>
            <select
              className="DAT_Battery_RackList_Filter_Select"
              style={{ width: 130, height: 36 }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Normal">Normal</option>
              <option value="Warning">Warning</option>
              <option value="Fault">Fault</option>
            </select>
          </div>
        </div>
        <div className="DAT_Battery_RackList_Table">
          <table className="DAT_Battery_RackList_Table_Main">
            <thead>
              <tr>
                <th className="DAT_Battery_RackList_Table_Main_Head">Rack</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">Status</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">Voltage</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">Current</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">SOC</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">SOH</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">Temp</th>
                <th className="DAT_Battery_RackList_Table_Main_Head">Cycles</th>
              </tr>
            </thead>
            <tbody className="DAT_Battery_RackList_Table_Main_Body">
              {filteredRacks.map((r) => (
                <tr
                  key={r.id}
                  className={`DAT_Battery_RackList_Table_Main_Row ${selectedRack?.id === r.id ? "DAT_Battery_RackList_Table_Main_Row--selected" : ""} ${r.status === "Warning" ? "DAT_Battery_RackList_Table_Main_Row--warning" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedRack(r)}
                >
                  <td className="DAT_Battery_RackList_Table_Main_Cell DAT_Battery_RackList_Table_Main_Cell--medium">{r.id}</td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">{r.voltage}V</td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">{r.current}A</td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">{r.soc}%</td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">{r.soh}%</td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">{r.temperature} degC</td>
                  <td className="DAT_Battery_RackList_Table_Main_Cell">{r.cycles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRack && (
        <div className="DAT_Battery_Detail">
          <div className="DAT_Battery_Detail_Summary">
            <div className="DAT_Battery_Detail_Summary_Header">
              <span className="DAT_Battery_Detail_Summary_Header_Title">{selectedRack.id} Detail</span>
            </div>
            <div className="DAT_Battery_Detail_Summary_Grid">
              {[
                ["Voltage", `${selectedRack.voltage}V`],
                ["Current", `${selectedRack.current}A`],
                ["SOC", `${selectedRack.soc}%`],
                ["SOH", `${selectedRack.soh}%`],
                ["Max Cell V", `${selectedRack.maxCellV}V`],
                ["Min Cell V", `${selectedRack.minCellV}V`],
                ["Delta V", `${selectedRack.deltaV}V`],
                ["Max Temp", `${selectedRack.maxTemp} degC`],
                ["Cycles", selectedRack.cycles],
              ].map(([k, v]) => (
                <div key={k} className="DAT_Battery_Detail_Summary_Grid_Item">
                  <span className="DAT_Battery_Detail_Summary_Grid_Item_Label">{k}</span>
                  <span className="DAT_Battery_Detail_Summary_Grid_Item_Value">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="DAT_Battery_Detail_Matrix">
            <div className="DAT_Battery_Detail_Matrix_Header">
              <span className="DAT_Battery_Detail_Matrix_Header_Title">Cell Matrix</span>
            </div>
            <div className="DAT_Battery_Detail_Matrix_Grid">
              {selectedRack.cells.map((cell) => (
                <div
                  key={cell.id}
                  className="DAT_Battery_Detail_Matrix_Grid_Item"
                  style={{ background: getCellColor(cell) }}
                  title={`${cell.id}\nVoltage: ${cell.voltage}V\nTemp: ${cell.temperature} degC\nStatus: ${cell.status}`}
                >
                  <span className="DAT_Battery_Detail_Matrix_Grid_Item_Id">{cell.id.split("-").pop()}</span>
                  <span className="DAT_Battery_Detail_Matrix_Grid_Item_Voltage">{cell.voltage}V</span>
                </div>
              ))}
            </div>
            <div className="DAT_Battery_Detail_Matrix_Legend">
              <span>
                <span
                  className="DAT_Battery_Detail_Matrix_Legend_Dot"
                  style={{ background: "#22C55E" }}
                ></span>{" "}
                Normal
              </span>
              <span>
                <span
                  className="DAT_Battery_Detail_Matrix_Legend_Dot"
                  style={{ background: "#F59E0B" }}
                ></span>{" "}
                Low
              </span>
              <span>
                <span
                  className="DAT_Battery_Detail_Matrix_Legend_Dot"
                  style={{ background: "#EF4444" }}
                ></span>{" "}
                High
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedRack && (
        <div className="DAT_Battery_Analytics">
          <div className="DAT_Battery_Analytics_Card">
            <div className="DAT_Battery_Analytics_Card_Header">
              <span className="DAT_Battery_Analytics_Card_Header_Title">Rack Trends</span>
            </div>
            <ResponsiveContainer width="100%" height={400} className={"DAT_Battery_Analytics_Card_Chart"}>
              <LineChart data={rackChartData} className="DAT_Battery_Analytics_Card_Chart_Line">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="voltage"
                  name="Voltage"
                  stroke="#1677FF"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temp"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="DAT_Battery_Analytics_Card">
            <div className="DAT_Battery_Analytics_Card_Header">
              <span className="DAT_Battery_Analytics_Card_Header_Title">Battery Alarms</span>
            </div>
            <div className="DAT_Battery_Analytics_Card_Table">
              <table className="DAT_Battery_Analytics_Card_Table_Main">
                <thead>
                  <tr className="DAT_Battery_Analytics_Card_Table_Main_Row">
                    <th className="DAT_Battery_Analytics_Card_Table_Main_Head">Time</th>
                    <th className="DAT_Battery_Analytics_Card_Table_Main_Head">Level</th>
                    <th className="DAT_Battery_Analytics_Card_Table_Main_Head">Message</th>
                    <th className="DAT_Battery_Analytics_Card_Table_Main_Head">Status</th>
                  </tr>
                </thead>
                <tbody className="DAT_Battery_Analytics_Card_Table_Main_Body">
                  {batteryAlarms.map((a) => (
                    <tr key={a.id} className="DAT_Battery_Analytics_Card_Table_Main_Row">
                      <td className="DAT_Battery_Analytics_Card_Table_Main_Cell">{a.time.slice(11)}</td>
                      <td className="DAT_Battery_Analytics_Card_Table_Main_Cell">
                        <StatusBadge status={a.level} />
                      </td>
                      <td className="DAT_Battery_Analytics_Card_Table_Main_Cell">{a.message}</td>
                      <td className="DAT_Battery_Analytics_Card_Table_Main_Cell">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
