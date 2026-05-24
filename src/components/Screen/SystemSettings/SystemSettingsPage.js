import React, { useState } from "react";
import { mockSystemSettings } from "../../data/mockData";
import "./SystemSettingsPage.scss";

const tabs = ["site", "device", "notification", "realtime"];

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
    <div className="DAT_SystemSettings_Form_Grid">
      {Object.entries(settings[section]).map(([key, value]) => (
        <div key={key} className="DAT_SystemSettings_Form_Grid_Group">
          <label className="DAT_SystemSettings_Form_Grid_Group_Label">{key}</label>
          <input
            className="DAT_SystemSettings_Form_Grid_Group_Input"
            value={String(value)}
            onChange={(e) => updateSection(section, key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="DAT_SystemSettings">
      <div className="DAT_SystemSettings_Card">
        <div className="DAT_SystemSettings_Card_Header">
          <div>
            <div className="DAT_SystemSettings_Card_Header_Title">System Settings</div>
            <div className="DAT_SystemSettings_Card_Header_Subtitle">
              Cau hinh thong tin tram, thiet bi, thong bao va realtime refresh.
            </div>
          </div>
          <div className="DAT_SystemSettings_Card_Header_Actions">
            <button
              className="DAT_SystemSettings_Card_Header_Actions_Button_Secondary"
              onClick={() => setSettings(createDefaultSettings())}
            >
              Reset Default
            </button>
            <button className="DAT_SystemSettings_Card_Header_Actions_Button_Primary">
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="DAT_SystemSettings_Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? "DAT_SystemSettings_Tabs_Button_Active"
                : "DAT_SystemSettings_Tabs_Button"
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab === "site" && "Site Information"}
            {tab === "device" && "Device Configuration"}
            {tab === "notification" && "Notification Settings"}
            {tab === "realtime" && "Realtime Settings"}
          </button>
        ))}
      </div>

      <div className="DAT_SystemSettings_Card">
        {renderFields(activeTab)}
        {activeTab === "notification" && (
          <div className="DAT_SystemSettings_Card_NotificationAction">
            <button className="DAT_SystemSettings_Card_NotificationAction_Button_Ghost">
              Test Notification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
