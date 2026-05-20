import React, { useState } from "react";
import { mockSystemSettings } from "../../data/mockData";
import "./SystemSettingsPage.scss";

const tabs = ["site", "device", "notification", "realtime"];

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("site");
  const [settings, setSettings] = useState({
    ...mockSystemSettings,
    device: {
      batteryContainers: "CTN-01, CTN-02, CTN-03",
      rackConfiguration: "10 racks per container",
      pcsConfiguration: "PCS-001 / 500 kW",
      bmsConfiguration: "BMS main bus online",
      gridMeterConfiguration: "Grid Meter 01",
      pvMeterConfiguration: "PV Meter 01",
    },
  });

  const updateSection = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const renderFields = (section) => (
    <div className="form-grid-2">
      {Object.entries(settings[section]).map(([key, value]) => (
        <div key={key} className="form-group">
          <label className="form-label">{key}</label>
          <input
            className="form-input"
            value={String(value)}
            onChange={(e) => updateSection(section, key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="page animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">System Settings</div>
            <div className="card-subtitle">
              Cấu hình thông tin trạm, thiết bị, thông báo và realtime refresh.
            </div>
          </div>
          <div className="page-toolbar-actions">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setSettings({
                  ...mockSystemSettings,
                  device: {
                    batteryContainers: "CTN-01, CTN-02, CTN-03",
                    rackConfiguration: "10 racks per container",
                    pcsConfiguration: "PCS-001 / 500 kW",
                    bmsConfiguration: "BMS main bus online",
                    gridMeterConfiguration: "Grid Meter 01",
                    pvMeterConfiguration: "PV Meter 01",
                  },
                })
              }
            >
              Reset Default
            </button>
            <button className="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "site" && "Site Information"}
            {tab === "device" && "Device Configuration"}
            {tab === "notification" && "Notification Settings"}
            {tab === "realtime" && "Realtime Settings"}
          </button>
        ))}
      </div>

      <div className="card">
        {renderFields(activeTab)}
        {activeTab === "notification" && (
          <div className="mt-base">
            <button className="btn btn-ghost">Test Notification</button>
          </div>
        )}
      </div>
    </div>
  );
}
