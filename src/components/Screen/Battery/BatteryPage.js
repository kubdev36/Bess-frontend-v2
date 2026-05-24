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
    <div className="DAT_Battery animate-fadeIn">
      <div className="DAT_Battery_Section01">
        {mockContainers.map((c) => (
          <div
            key={c.id}
            className={`DAT_Battery_Section01_Container ${selectedContainer.id === c.id ? "DAT_Battery_Section01_Container_Selected" : ""}`}
            onClick={() => {
              setSelectedContainer(c);
              setSelectedRack(null);
            }}
          >
            <div className="DAT_Battery_Section01_Container_Item">
              <span className="DAT_Battery_Section01_Container_Item_Title">{c.name}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="DAT_Battery_Section01_Container_Stats">
              <div>
                <span className="DAT_Battery_Section01_Container_Stats_Title">Racks:</span>{" "}
                <span className="DAT_Battery_Section01_Container_Stats_Subtitle">{c.racks.length}</span>
              </div>
              <div>
                <span className="DAT_Battery_Section01_Container_Stats_Title">SOC:</span>{" "}
                <span className="DAT_Battery_Section01_Container_Stats_Subtitle">{c.soc}%</span>
              </div>
              <div>
                <span className="DAT_Battery_Section01_Container_Stats_Title">SOH:</span>{" "}
                <span className="DAT_Battery_Section01_Container_Stats_Subtitle">{c.soh}%</span>
              </div>
              <div>
                <span className="DAT_Battery_Section01_Container_Stats_Title">Temp:</span>{" "}
                <span className="DAT_Battery_Section01_Container_Stats_Subtitle">{c.temperature} degC</span>
              </div>
            </div>
            {selectedContainer.id === c.id && (
              <div className="DAT_Battery_Section01_Container_Selected_Check">
                <LuBadgeCheck />
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="DAT_Battery_Section02">
        <div className="DAT_Battery_Section02_Header">
          <span className="DAT_Battery_Section02_Header_Title">
            Rack List - {selectedContainer.name}
          </span>
          <div className="DAT_Battery_Section02_Middle">
            <div className="DAT_Battery_Section02_Middle_Form" style={{ width: 180 }}>
              <span className="DAT_Battery_Section02_Middle_Form_Icon">
                <LuSearch />
              </span>
              <input
                className="DAT_Battery_Section02_Middle_Form_Input"
                style={{ height: 36 }}
                placeholder="Search rack..."
                value={searchRack}
                onChange={(e) => setSearchRack(e.target.value)}
              />
            </div>
            <select
              className="DAT_Battery_Section02_Middle_Select"
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
        <div className="DAT_Battery_Section02_Table">
          <table className="DAT_Battery_Section02_Table_Main">
            <thead>
              <tr>
                <th className="DAT_Battery_Section02_Table_Main_Th">Rack</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">Status</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">Voltage</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">Current</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">SOC</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">SOH</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">Temp</th>
                <th className="DAT_Battery_Section02_Table_Main_Th">Cycles</th>
              </tr>
            </thead>
            <tbody className="DAT_Battery_Section02_Table_Main_Body">
              {filteredRacks.map((r) => (
                <tr
                  key={r.id}
                  className={`DAT_Battery_Section02_Table_Main_Tr ${selectedRack?.id === r.id ? "DAT_Battery_Section02_Table_Main_Tr_Highlight_Warning" : ""} ${r.status === "Warning" ? "DAT_Battery_Section02_Table_Main_Tr_Highlight_Warning" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedRack(r)}
                >
                  <td className="DAT_Battery_Section02_Table_Main_Td--Medium">{r.id}</td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">{r.voltage}V</td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">{r.current}A</td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">{r.soc}%</td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">{r.soh}%</td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">{r.temperature} degC</td>
                  <td className="DAT_Battery_Section02_Table_Main_Td">{r.cycles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRack && (
        <div className="DAT_Battery_Section03">
          <div className="DAT_Battery_Section03_Container">
            <div className="DAT_Battery_Section03_Container_Header">
              <span className="DAT_Battery_Section03_Container_Header_Title">{selectedRack.id} Detail</span>
            </div>
            <div className="DAT_Battery_Section03_Container_Box">
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
                <div key={k} className="DAT_Battery_Section03_Container_Box_Item">
                  <span className="DAT_Battery_Section03_Container_Box_Item_Title">{k}</span>
                  <span className="DAT_Battery_Section03_Container_Box_Item_Subtitle">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="DAT_Battery_Section03_Middle">
            <div className="DAT_Battery_Section03_Middle_Header">
              <span className="DAT_Battery_Section03_Middle_Header_Title">Cell Matrix</span>
            </div>
            <div className="DAT_Battery_Section03_Middle_Cell">
              {selectedRack.cells.map((cell) => (
                <div
                  key={cell.id}
                  className="DAT_Battery_Section03_Middle_Cell_Item"
                  style={{ background: getCellColor(cell) }}
                  title={`${cell.id}\nVoltage: ${cell.voltage}V\nTemp: ${cell.temperature} degC\nStatus: ${cell.status}`}
                >
                  <span className="DAT_Battery_Section03_Middle_Cell_Item_Id">{cell.id.split("-").pop()}</span>
                  <span className="DAT_Battery_Section03_Middle_Cell_Item_Voltage">{cell.voltage}V</span>
                </div>
              ))}
            </div>
            <div className="DAT_Battery_Section03_Middle_Legend">
              <span>
                <span
                  className="DAT_Battery_Section03_Middle_Legend_Dot"
                  style={{ background: "#22C55E" }}
                ></span>{" "}
                Normal
              </span>
              <span>
                <span
                  className="DAT_Battery_Section03_Middle_Legend_Dot"
                  style={{ background: "#F59E0B" }}
                ></span>{" "}
                Low
              </span>
              <span>
                <span
                  className="DAT_Battery_Section03_Middle_Legend_Dot"
                  style={{ background: "#EF4444" }}
                ></span>{" "}
                High
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedRack && (
        <div className="DAT_Battery_Section04">
          <div className="DAT_Battery_Section04_Container">
            <div className="DAT_Battery_Section04_Container_Header">
              <span className="DAT_Battery_Section04_Container_Header_Title">Rack Trends</span>
            </div>
            <ResponsiveContainer width="100%" height={400} className={"DAT_Battery_Section04_Container_Chart"}>
              <LineChart data={rackChartData} className="DAT_Battery_Section04_Container_Chart_Line">
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
          <div className="DAT_Battery_Section04_Container">
            <div className="DAT_Battery_Section04_Container_Header">
              <span className="DAT_Battery_Section04_Container_Header_Title">Battery Alarms</span>
            </div>
            <div className="DAT_Battery_Section04_Container_Table">
              <table className="DAT_Battery_Section04_Container_Table_Main">
                <thead>
                  <tr className="DAT_Battery_Section04_Container_Table_Main_Tr">
                    <th className="DAT_Battery_Section04_Container_Table_Main_Tr_Th">Time</th>
                    <th className="DAT_Battery_Section04_Container_Table_Main_Tr_Th">Level</th>
                    <th className="DAT_Battery_Section04_Container_Table_Main_Tr_Th">Message</th>
                    <th className="DAT_Battery_Section04_Container_Table_Main_Tr_Th">Status</th>
                  </tr>
                </thead>
                <tbody className="DAT_Battery_Section04_Container_Table_Main">
                  {batteryAlarms.map((a) => (
                    <tr key={a.id} className="DAT_Battery_Section04_Container_Table_Main_Tr">
                      <td className="DAT_Battery_Section04_Container_Table_Main_Tr_Td">{a.time.slice(11)}</td>
                      <td className="DAT_Battery_Section04_Container_Table_Main_Tr_Td">
                        <StatusBadge status={a.level} />
                      </td>
                      <td className="DAT_Battery_Section04_Container_Table_Main_Tr_Td">{a.message}</td>
                      <td className="DAT_Battery_Section04_Container_Table_Main_Tr_Td">
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
