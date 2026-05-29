import React, { useState } from "react";
import { mockSystemSettings } from "../../data/mockData";
import "./SystemSettings.scss";
import { useIntl } from "react-intl";
import { LuSettings } from "react-icons/lu";

const tabs = ["site", "device", "notification", "realtime"];
const tabLabels = {
  site: "site_information",
  device: "device_configuration",
  notification: "notification_settings",
  realtime: "realtime_settings",
};

const defaultDeviceSettings = {
  battery_containers: "CTN-01, CTN-02, CTN-03",
  rack_configuration: "10 racks per container",
  pcs_configuration: "PCS-001 / 500 kW",
  bms_configuration: "BMS main bus online",
  grid_meter_configuration: "Grid Meter 01",
  pv_meter_configuration: "PV Meter 01",
};

const createDefaultSettings = () => ({
  ...mockSystemSettings,
  device: defaultDeviceSettings,
});

export default function SystemSettings() {
  const lang = useIntl();
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
        <div key={key} className="DAT_SystemSettings_Grid_Field">
          <label className="DAT_SystemSettings_Grid_Field_Label">{lang.formatMessage({id: key})}</label>
          <input
            className="DAT_SystemSettings_Grid_Field_Input"
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
        <div className="DAT_SystemSettings_HeaderCard_Main">
          <div className="DAT_SystemSettings_HeaderCard_Main_Icon">
            <LuSettings size={25}/>
          </div>
          <div className="DAT_SystemSettings_HeaderCard_Main_Title">
            {lang.formatMessage({id: "system_settings"})}
          </div>
        </div>
        <div className="DAT_SystemSettings_HeaderCard_Actions">
          <button
            className="DAT_SystemSettings_HeaderCard_Actions_ResetButton"
            onClick={() => setSettings(createDefaultSettings())}
          >
            {lang.formatMessage({id: "reset_default"})}
          </button>
          <button className="DAT_SystemSettings_HeaderCard_Actions_SaveButton">
            {lang.formatMessage({id: "save_settings"})}
          </button>
        </div>
      </div>

      <div className="DAT_SystemSettings_Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? "DAT_SystemSettings_Tabs_Active"
                : "DAT_SystemSettings_Tabs_Normal"
            }
            onClick={() => setActiveTab(tab)}
          >
            {lang.formatMessage({id: tabLabels[tab]})}
          </button>
        ))}
      </div>

      <div className="DAT_SystemSettings_ContentCard">
        {renderFields(activeTab)}
        {activeTab === "notification" && (
          <div className="DAT_SystemSettings_ContentCard_NotificationAction">
            <button className="DAT_SystemSettings_ContentCard_NotificationButton">{lang.formatMessage({id: "test_notification"})}</button>
          </div>
        )}
      </div>
    </div>
  );
}
