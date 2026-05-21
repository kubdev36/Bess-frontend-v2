import React from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaCircle,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaCircleXmark,
  FaClock,
  FaPlug,
  FaRadio,
  FaShield,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { displayText } from "../utils/displayText";

const badgeMap = {  
  Online: "badge-success",
  Offline: "badge-gray",
  Fault: "badge-danger",
  Normal: "badge-success",
  Running: "badge-primary",
  Charging: "badge-cyan",
  Discharging: "badge-purple",
  Warning: "badge-warning",
  Critical: "badge-danger",
  Standby: "badge-gray",
  Connected: "badge-success",
  Disconnected: "badge-danger",
  Active: "badge-danger",
  Acknowledged: "badge-warning",
  Cleared: "badge-success",
  Pending: "badge-warning",
  Sent: "badge-primary",
  Accepted: "badge-cyan",
  Rejected: "badge-danger",
  Failed: "badge-danger",
  Timeout: "badge-gray",
  Completed: "badge-success",
  Inactive: "badge-gray",
  Locked: "badge-danger",
  Enabled: "badge-success",
  Disabled: "badge-gray",
  Info: "badge-primary",
  Success: "badge-success",
  Auto: "badge-primary",
  Manual: "badge-warning",
  Charge: "badge-cyan",
  Discharge: "badge-purple",
  Backup: "badge-warning",
  Maintenance: "badge-gray",
  "Peak Shaving": "badge-purple",
  High: "badge-danger",
  Low: "badge-warning",
  Supplied: "badge-success",
  Generating: "badge-success",
  Idle: "badge-gray",
};

const iconMap = {
  Online: FaRadio,
  Offline: FaCircle,
  Fault: FaShield,
  Normal: FaShield,
  Running: FaRadio,
  Charging: FaArrowDown,
  Discharging: FaArrowUp,
  Warning: FaTriangleExclamation,
  Critical: FaCircleExclamation,
  Standby: FaCircle,
  Connected: FaPlug,
  Disconnected: FaCircleXmark,
  Active: FaCircleExclamation,
  Acknowledged: FaCheck,
  Cleared: FaCircleCheck,
  Pending: FaClock,
  Sent: LuSend,
  Accepted: FaCircleCheck,
  Rejected: FaCircleXmark,
  Failed: FaCircleXmark,
  Timeout: FaClock,
  Completed: FaCircleCheck,
  Info: FaCircleInfo,
  Success: FaCircleCheck,
  Enabled: FaCircleCheck,
  Disabled: FaXmark,
  Supplied: FaCircleCheck,
  Generating: FaCircleCheck,
  Idle: FaClock,
};

export default function StatusBadge({
  status,
  showIcon = true,
  size = "normal",
}) {
  const className = badgeMap[status] || "badge-gray";
  const Icon = iconMap[status];

  return (
    <span
      className={`badge ${className} ${size === "small" ? "badge-sm" : ""}`}
    >
      {showIcon && Icon ? <Icon size={12} /> : null}
      {displayText(status)}
    </span>
  );
}
