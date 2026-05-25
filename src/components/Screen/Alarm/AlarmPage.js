import React, { useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuEye,
  LuSearch,
} from "react-icons/lu";
import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";
import { mockAlarms } from "../../data/mockData";
import "./AlarmPage.scss";

export default function AlarmPage() {
  const { hasPermission } = useAuth();
  const [alarms, setAlarms] = useState(mockAlarms);
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDevice, setFilterDevice] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const perPage = 10;

  const filtered = alarms.filter((a) => {
    if (filterLevel !== "All" && a.level !== filterLevel) return false;
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    if (filterDevice !== "All" && a.device !== filterDevice) return false;
    if (
      search &&
      !a.message.toLowerCase().includes(search.toLowerCase()) &&
      !a.code.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAck = (id) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
            ...a,
            status: "Acknowledged",
            operator: "Admin",
            acknowledgedAt: new Date()
              .toISOString()
              .slice(0, 16)
              .replace("T", " "),
          }
          : a,
      ),
    );
  };

  const handleClear = (id) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
            ...a,
            status: "Cleared",
            clearedAt: new Date()
              .toISOString()
              .slice(0, 16)
              .replace("T", " "),
          }
          : a,
      ),
    );
  };

  return (
    <div className="DAT_alarm">
      <div className="DAT_alarm_filter">
        <select
          className="DAT_alarm_filter_form"
          style={{ width: 130 }}
          value={filterLevel}
          onChange={(e) => {
            setFilterLevel(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Levels</option>
          <option value="Info">Info</option>
          <option value="Warning">Warning</option>
          <option value="Fault">Fault</option>
          <option value="Critical">Critical</option>
        </select>
        <select
          className="DAT_alarm_filter_form"
          style={{ width: 130 }}
          value={filterDevice}
          onChange={(e) => {
            setFilterDevice(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Devices</option>
          <option value="BMS">BMS</option>
          <option value="PCS">PCS</option>
          <option value="Grid">Grid</option>
          <option value="Battery">Battery</option>
          <option value="System">System</option>
        </select>
        <select
          className="DAT_alarm_filter_form"
          style={{ width: 140 }}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Cleared">Cleared</option>
        </select>
        <div className="DAT_alarm_filter_search" style={{ width: 200 }}>
          <span className="DAT_alarm_filter_search_icon">
            <LuSearch />
          </span>
          <input
            className="DAT_alarm_filter_search_input"
            placeholder="Search alarms..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button className="DAT_alarm_filter_export">
          <LuDownload />
          Export
        </button>

      </div>

      <div className="DAT_alarm_main">
        <table className="DAT_alarm_main_table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Level</th>
              <th>Device</th>
              <th>Message</th>
              <th>Status</th>
              <th>Operator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((a) => (
              <tr
                key={a.id}
                className={a.status === "Active" ? "highlight_danger" : ""}
              >
                <td className="font_medium">{a.code}</td>
                <td>{a.time}</td>
                <td>
                  <StatusBadge status={a.level} />
                </td>
                <td>{a.device}</td>
                <td>{a.message}</td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
                <td className="text_secondary">{a.operator}</td>
                <td>
                  <button
                    className="DAT_alarm_main_table_view"
                    onClick={() => setSelectedAlarm(a)}
                    aria-label="View alarm detail"
                  >
                    <LuEye />
                  </button>
                  {hasPermission("ack_alarm") && a.status === "Active" && (
                    <button
                      className="DAT_alarm_main_table_ack"
                      onClick={() => handleAck(a.id)}
                    >
                      Ack
                    </button>
                  )}
                  {hasPermission("clear_alarm") &&
                    a.status === "Acknowledged" && (
                      <button
                        className="DAT_alarm_main_table_clear"
                        onClick={() => handleClear(a.id)}
                      >
                        Clear
                      </button>
                    )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="DAT_alarm_main_pagination">
            <button
              className="DAT_alarm_main_pagination_btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              <LuChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`DAT_alarm_main_pagination_btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="DAT_alarm_main_pagination_btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              <LuChevronRight />
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedAlarm}
        onClose={() => setSelectedAlarm(null)}
        title={selectedAlarm ? `Alarm ${selectedAlarm.code}` : ""}
      >
        {selectedAlarm && (
          <div className="DAT_alarm_detail">
            {[
              ["Alarm ID", selectedAlarm.code],
              ["Time", selectedAlarm.time],
              ["Level", selectedAlarm.level],
              ["Device", selectedAlarm.device],
              ["Message", selectedAlarm.message],
              ["Description", selectedAlarm.description],
              ["Status", selectedAlarm.status],
              ["Operator", selectedAlarm.operator],
              ["Acknowledged At", selectedAlarm.acknowledgedAt || "-"],
              ["Cleared At", selectedAlarm.clearedAt || "-"],
            ].map(([k, v]) => (
              <div key={k} className="DAT_alarm_detail_row">
                <span className="DAT_alarm_detail_row_label">{k}</span>
                <span className="DAT_alarm_detail_row_val">{v}</span>
              </div>
            ))}
            {selectedAlarm.relatedParams && (
              <>
                <div className="DAT_alarm_detail_title">
                  Related Parameters
                </div>
                {Object.entries(selectedAlarm.relatedParams).map(([k, v]) => (
                  <div key={k} className="DAT_alarm_detail_row">
                    <span className="DAT_alarm_detail_row_label">{k}</span>
                    <span className="DAT_alarm_detail_row_val">{v}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
