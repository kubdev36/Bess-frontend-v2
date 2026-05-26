import React, { useState } from "react";
import { mockSystemSettings } from "../../data/mockData";
import "./SystemSettingsPage.scss";

const tabs = ["site", "device", "notification", "realtime"];
const tabLabels = {
  site: "Site Information",
  device: "Device Configuration",
  notification: "Notification Settings",
  realtime: "Realtime Settings",
};

const defaultDeviceSettings = {
  batteryContainers: "CTN-01, CTN-02, CTN-03",
  rackConfiguration: "10 racks per container",
  pcsConfiguration: "PCS-001 / 500 kW",
  bmsConfiguration: "BMS main bus online",
  gridMeterConfiguration: "Grid Meter 01",
  pvMeterConfiguration: "PV Meter 01",
};

const createDefaultSettings = () => ({
  ...mockSystemSettings,
  device: defaultDeviceSettings,
});

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("site");
  const [settings, setSettings] = useState(createDefaultSettings);

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
    <div className="DAT_SystemSettings_Grid">
      {Object.entries(settings[section]).map(([key, value]) => (
        <div key={key} className="DAT_SystemSettings_Field">
          <label className="DAT_SystemSettings_Label">{key}</label>
          <input
            className="DAT_SystemSettings_Input"
            value={String(value)}
            onChange={(e) => updateSection(section, key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="DAT_SystemSettings">
      <div className="DAT_SystemSettings_HeaderCard">
        <div className="DAT_SystemSettings_Title">System Settings</div>
        <div className="DAT_SystemSettings_Subtitle">
          Cau hinh thong tin tram, thiet bi, thong bao va realtime refresh.
        </div>
        <div className="DAT_SystemSettings_Actions">
          <button
            className="DAT_SystemSettings_ResetButton"
            onClick={() => setSettings(createDefaultSettings())}
          >
            Reset Default
          </button>
          <button className="DAT_SystemSettings_SaveButton">Save Settings</button>
        </div>
      </div>

      <div className="DAT_SystemSettings_Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? "DAT_SystemSettings_TabActive"
                : "DAT_SystemSettings_Tab"
            }
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="DAT_SystemSettings_ContentCard">
        {renderFields(activeTab)}
        {activeTab === "notification" && (
          <div className="DAT_SystemSettings_NotificationAction">
            <button className="DAT_SystemSettings_NotificationButton">Test Notification</button>
          </div>
        )}
      </div>
    </div>
  );
}
