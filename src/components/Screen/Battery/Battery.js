import React, { useState } from "react";
import { LuBadgeCheck, LuSearch } from "react-icons/lu";
import StatusBadge from "../../Modal/StatusBadge";
import { mockAlarms, mockContainers } from "../../data/mockData";
import "./Battery.scss";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Battery() {
  const [selectedContainer, setSelectedContainer] = useState(mockContainers[0]);
  const [selectedRack, setSelectedRack] = useState(null);
  const [searchRack, setSearchRack] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModelModuleOpen, setIsModalModuleOpen] = useState(false);
  const [moduleName, setModuleName] = useState("")

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
    if (cell.status === "High") return "rgba(239, 68, 68, 1)";
    if (cell.status === "Low") return "rgba(245, 158, 11, 1)";

    const ratio = (cell.voltage - 3.0) / 0.35;
    const g = Math.round(180 + ratio * 75);

    return `rgba(34, ${Math.min(255, g)}, 94, 1)`;
  };

  return (
    <div className="DAT_Battery">
      <div className="DAT_Battery_Overview">
        {mockContainers.map((c) => (
          <div
            key={c.id}
            className={`DAT_Battery_Overview_Card`}
            onClick={() => {
              setSelectedContainer(c);
              setSelectedRack(null);
            }}
          >
            <div className="DAT_Battery_Overview_Card_Header">
              <div className="DAT_Battery_Overview_Card_Header_Box">
                <div className="DAT_Battery_Overview_Card_Header_Box_Title">{c.name}</div>
                <StatusBadge status={c.status} />
              </div>
              <div className="DAT_Battery_Overview_Card_Header_Box">
                <div className="DAT_Battery_Overview_Card_Header_Box_Label">Racks:</div>
                <div className="DAT_Battery_Overview_Card_Header_Box_Value">{c.racks.length}</div>
              </div>

              <div className="DAT_Battery_Overview_Card_Header_Box">
                <div className="DAT_Battery_Overview_Card_Header_Box_Label">SOC:</div>
                <div className="DAT_Battery_Overview_Card_Header_Box_Value">{c.soc}%</div>
              </div>

              <div className="DAT_Battery_Overview_Card_Header_Box">
                <div className="DAT_Battery_Overview_Card_Header_Box_Label">SOH:</div>
                <div className="DAT_Battery_Overview_Card_Header_Box_Value">{c.soh}%</div>
              </div>

              <div className="DAT_Battery_Overview_Card_Header_Box">
                <div className="DAT_Battery_Overview_Card_Header_Box_Label">Temp:</div>
                <div className="DAT_Battery_Overview_Card_Header_Box_Value">{c.temperature}°C</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="DAT_Battery_RackList">
        <div className="DAT_Battery_RackList_Header">
          <span className="DAT_Battery_RackList_Header_Title">
            Rack List - Level 01
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
                  onClick={() => {
                    setSelectedRack(r);
                    setIsModalOpen(true);
                  }}
                >
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell DAT_Battery_RackList_Table_Main_Body_Row_Cell--medium">{r.id}</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.voltage}V</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.current}A</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.soc}%</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.soh}%</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.temperature}°C</td>
                  <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.cycles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedRack && (
        <div className="DAT_Modal_Overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="DAT_Modal_Overlay_Box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DAT_Modal_Overlay_Box_Header">
              <h2>{selectedRack.id} - Rack Detail</h2>
            </div>

            {/* KPI GRID */}
            <div className="DAT_Modal_Overlay_Box_Grid">

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">SOC:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.soc}%</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">SOH:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.soh}%</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Temperature:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.temperature}°C</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Max Temp:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.maxTemp}°C</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Min Cell:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.minCellV}</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Max Cell:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.maxCellV}</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Voltage:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.voltage}V</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Current:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.current}A</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">Cycles:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.cycles}</span>
              </div>

              <div className="DAT_Modal_Overlay_Box_Grid_Card">
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">DeltaV:</span>
                <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.deltaV}</span>
              </div>

            </div>

            <div className="DAT_Modal_Overlay_Box_Module">
              {selectedRack.module.map((m) => {
                return (
                  <div className="DAT_Modal_Overlay_Box_Module_Card" onClick={() => {
                    setIsModalOpen(false)
                    setIsModalModuleOpen(true)
                    setModuleName(m)
                  }}>
                    <span className="DAT_Modal_Overlay_Box_Module_Card_Value">{m}</span>
                  </div>
                )
              })}
            </div>

            <div className="DAT_Modal_Overlay_Box_Footer">
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isModelModuleOpen && selectedRack && (
        <div className="DAT_Modal_Overlay" onClick={() => setIsModalModuleOpen(false)}>
          <div
            className="DAT_Modal_Overlay_BoxCell"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DAT_Modal_Overlay_BoxCell_Header" onClick={() => {
                setIsModalModuleOpen(false)
                setIsModalOpen(true)
              }}>
              <div className="DAT_Modal_Overlay_BoxCell_Header_Icon">
                <FaArrowLeftLong size={20}/>
              </div>
              <h2>{selectedRack.id} - {moduleName} - Cells</h2>
            </div>

            <div className="DAT_Modal_Overlay_BoxCell_Cell">
              {selectedRack.cells.map((cell) => {
                return (
                  <div className={cell.status === "Normal" ? `DAT_Modal_Overlay_BoxCell_Cell_Card` : "DAT_Modal_Overlay_BoxCell_Cell_Card--High"}>
                    <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header">
                       <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Title">{cell.id}</span>
                       <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status">
                          <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status_Label">Status:</span>
                          <span className={cell.status === "Normal" ? `DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status_Value` : "DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status_Value_High"}>{cell.status}</span>
                       </div>
                    </div>
                    <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats">
                      <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item">
                        <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Label">Voltage:</span>
                        <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Value">{cell.voltage}V</span>
                      </div>
                      <div className="">
                        <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Label">Temperature:</span>
                        <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Value">{cell.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>

            <div className="DAT_Modal_Overlay_BoxCell_Footer">
              <button onClick={() => setIsModalModuleOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
