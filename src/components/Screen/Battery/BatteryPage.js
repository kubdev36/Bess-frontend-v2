import React, { useState } from "react";
import { LuBadgeCheck, LuSearch } from "react-icons/lu";
import StatusBadge from "../../Modal/StatusBadge";
import { mockAlarms, mockContainers } from "../../data/mockData";
import "./BatteryPage.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const rackTrendData = [
  {
    timestamp: "10:00",
    rack1: 45,
    rack2: 52,
    rack3: 38,
  },
  {
    timestamp: "11:00",
    rack1: 48,
    rack2: 55,
    rack3: 40,
  },
  {
    timestamp: "12:00",
    rack1: 50,
    rack2: 58,
    rack3: 43,
  },
  {
    timestamp: "13:00",
    rack1: 47,
    rack2: 56,
    rack3: 42,
  },
];

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

  const data = {
    labels: rackTrendData.map((item) => item.timestamp),

    datasets: [
      {
        label: "Rack 1",
        data: rackTrendData.map((item) => item.rack1),
        borderColor: "#36A2EB",
        tension: 0.3,
      },
      {
        label: "Rack 2",
        data: rackTrendData.map((item) => item.rack2),
        borderColor: "#FF6384",
        tension: 0.3,
      },

      {
        label: "Rack 3",
        data: rackTrendData.map((item) => item.rack3),
        borderColor: "#4BC0C0",
        tension: 0.3,
      },
    ]
  }

  return (
    <div className="DAT_Battery">
      <div className="DAT_Battery_Overview">
        {mockContainers.map((c) => (
          <div
            key={c.id}
            className={`DAT_Battery_Overview_Card ${selectedContainer.id === c.id ? "DAT_Battery_Overview_Selected" : ""}`}
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
              <div className="DAT_Battery_Overview_Card_Stats_Item">
                <div className="DAT_Battery_Overview_Card_Stats_Item_Label">Racks:</div>
                <div className="DAT_Battery_Overview_Card_Stats_Item_Value">{c.racks.length}</div>
              </div>
              <div className="DAT_Battery_Overview_Card_Stats_Item">
                <div className="DAT_Battery_Overview_Card_Stats_Item_Label">SOC:</div>
                <div className="DAT_Battery_Overview_Card_Stats_Item_Value">{c.soc}%</div>
              </div>

              <div className="DAT_Battery_Overview_Card_Stats_Item">
                <div className="DAT_Battery_Overview_Card_Stats_Item_Label">SOH:</div>
                <div className="DAT_Battery_Overview_Card_Stats_Item_Value">{c.soh}%</div>
              </div>

              <div className="DAT_Battery_Overview_Card_Stats_Item">
                <div className="DAT_Battery_Overview_Card_Stats_Item_Label">Temp:</div>
                <div className="DAT_Battery_Overview_Card_Stats_Item_Value">{c.temperature} degC</div>
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
            <thead className="DAT_Battery_RackList_Table_Main_Head">
              <tr>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">Rack</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">Status</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">Voltage</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">Current</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">SOC</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">SOH</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">Temp</th>
                <th className="DAT_Battery_RackList_Table_Main_Head_Th">Cycles</th>
              </tr>
            </thead>
            <tbody className="DAT_Battery_RackList_Table_Main_Body">
              {filteredRacks.map((r) => (
                <tr
                  key={r.id}
                  className={`DAT_Battery_RackList_Table_Main_Body_Row ${selectedRack?.id === r.id ? "DAT_Battery_RackList_Table_Main_Body_Row--selected" : ""} ${r.status === "Warning" ? "DAT_Battery_RackList_Table_Main_Body_Row--warning" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedRack(r)}
                >
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell DAT_Battery_RackList_Table_Main_Body_Row_Cell--medium">{r.id}</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.voltage}V</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.current}A</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.soc}%</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.soh}%</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.temperature} degC</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.cycles}</td>
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
            <Line data={data}/>
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
