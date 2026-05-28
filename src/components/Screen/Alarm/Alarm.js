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
import "./Alarm.scss";
import { useIntl } from "react-intl";

export default function Alarm() {
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
  const lang = useIntl();

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
    <div className="DAT_Alarm">
      <div className="DAT_Alarm_Filter">
        <select
          className="DAT_Alarm_Filter_Form"
          style={{ width: 130 }}
          value={filterLevel}
          onChange={(e) => {
            setFilterLevel(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">{lang.formatMessage({ id: "all_levels" })}</option>
          <option value="Info">{lang.formatMessage({ id: "information" })}</option>
          <option value="Warning">{lang.formatMessage({ id: "warning" })}</option>
          <option value="Fault">{lang.formatMessage({ id: "error" })}</option>
          <option value="Critical">{lang.formatMessage({ id: "critical" })}</option>
        </select>
        <select
          className="DAT_Alarm_Filter_Form"
          style={{ width: 130 }}
          value={filterDevice}
          onChange={(e) => {
            setFilterDevice(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">{lang.formatMessage({ id: "all_devices" })}</option>
          <option value="BMS">BMS</option>
          <option value="PCS">PCS</option>
          <option value="Grid">{lang.formatMessage({ id: "grid" })}</option>
          <option value="Battery">{lang.formatMessage({ id: "battery" })}</option>
          <option value="System">{lang.formatMessage({ id: "system" })}</option>
        </select>
        <select
          className="DAT_Alarm_Filter_Form"
          style={{ width: 140 }}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">{lang.formatMessage({ id: "all_status" })}</option>
          <option value="Active">{lang.formatMessage({ id: "status_active" })}</option>
          <option value="Acknowledged">{lang.formatMessage({ id: "status_acknowledged" })}</option>
          <option value="Cleared">{lang.formatMessage({ id: "status_cleared" })}</option>
        </select>
        <div className="DAT_Alarm_Filter_Search" style={{ width: 200 }}>
          <span className="DAT_Alarm_Filter_Search_Icon">
            <LuSearch />
          </span>
          <input
            className="DAT_Alarm_Filter_Search_Input"
            placeholder={lang.formatMessage({ id: "search_alarms" })}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button className="DAT_Alarm_Filter_Export">
          <LuDownload />
          {lang.formatMessage({ id: "export" })}
        </button>

      </div>

      <div className="DAT_Alarm_Main">
        <table className="DAT_Alarm_Main_Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{lang.formatMessage({ id: "date" })}</th>
              <th>{lang.formatMessage({ id: "level" })}</th>
              <th>{lang.formatMessage({ id: "device" })}</th>
              <th>{lang.formatMessage({ id: "message" })}</th>
              <th>{lang.formatMessage({ id: "status" })}</th>
              <th>{lang.formatMessage({ id: "operator" })}</th>
              <th>{lang.formatMessage({ id: "action" })}</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((a) => (
              <tr
                key={a.id}
                className={a.status === "Active" ? "highlight_danger" : ""}
              >
                <td className="Font_Medium">{a.code}</td>
                <td>{a.time}</td>
                <td>
                  <StatusBadge status={a.level} />
                </td>
                <td>{a.device}</td>
                <td>{a.message}</td>
                <td>
                  <StatusBadge status={a.status} />
                </td>
                <td className="Text_Secondary">{a.operator}</td>
                <td>
                  <button
                    className="DAT_Alarm_Main_Table_View"
                    onClick={() => setSelectedAlarm(a)}
                    aria-label="View alarm detail"
                  >
                    <LuEye />
                  </button>
                  {hasPermission("ack_alarm") && a.status === "Active" && (
                    <button
                      className="DAT_Alarm_Main_Table_Ack"
                      onClick={() => handleAck(a.id)}
                    >
                      {lang.formatMessage({ id: "ack_alarm" })}
                    </button>
                  )}
                  {hasPermission("clear_alarm") &&
                    a.status === "Acknowledged" && (
                      <button
                        className="DAT_Alarm_Main_Table_Clear"
                        onClick={() => handleClear(a.id)}
                      >
                        {lang.formatMessage({ id: "clear_alarm" })}

                      </button>
                    )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="DAT_Alarm_Main_Pagination">
            <button
              className="DAT_Alarm_Main_Pagination_Btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              <LuChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`DAT_Alarm_Main_Pagination_Btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="DAT_Alarm_Main_Pagination_Btn"
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
        title={selectedAlarm ? `${lang.formatMessage({ id: "alarm_detail_title" })} ${selectedAlarm.code}` : ""}
      >
        {selectedAlarm && (
          <div className="DAT_Alarm_Detail">
            {[
              [lang.formatMessage({ id: "alarm_id" }), selectedAlarm.code],
              [lang.formatMessage({ id: "date" }), selectedAlarm.time],
              [lang.formatMessage({ id: "level" }), selectedAlarm.level],
              [lang.formatMessage({ id: "device" }), selectedAlarm.device],
              [lang.formatMessage({ id: "message" }), selectedAlarm.message],
              [lang.formatMessage({ id: "description" }), selectedAlarm.description],
              [lang.formatMessage({ id: "status" }), selectedAlarm.status],
              [lang.formatMessage({ id: "operator" }), selectedAlarm.operator],
              [lang.formatMessage({ id: "acknowledged_at" }), selectedAlarm.acknowledgedAt || "-"],
              [lang.formatMessage({ id: "clear_at" }), selectedAlarm.clearedAt || "-"],
            ].map(([k, v]) => (
              <div key={k} className="DAT_Alarm_Detail_Row">
                <span className="DAT_Alarm_Detail_Row_Label">{k}</span>
                <span className="DAT_Alarm_Detail_Row_Val">{v}</span>
              </div>
            ))}
            {selectedAlarm.relatedParams && (
              <>
                <div className="DAT_Alarm_Detail_Title">
                  {lang.formatMessage({ id: "related_parameters" })}
                </div>
                {Object.entries(selectedAlarm.relatedParams).map(([k, v]) => (
                  <div key={k} className="DAT_Alarm_Detail_Row">
                    <span className="DAT_Alarm_Detail_Row_Label">{k}</span>
                    <span className="DAT_Alarm_Detail_Row_Val">{v}</span>
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
