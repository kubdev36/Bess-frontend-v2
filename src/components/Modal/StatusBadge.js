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
import { useIntl } from "react-intl";

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

const statusMessageIds = {
  Online: "status_online",
  Offline: "status_offline",
  Fault: "status_fault",
  Normal: "status_normal",
  Running: "status_running",
  Charging: "status_charging",
  Discharging: "status_discharging",
  Warning: "status_warning",
  Critical: "status_critical",
  Standby: "status_standby",
  Connected: "status_connected",
  Disconnected: "status_disconnected",
  Active: "status_active",
  Acknowledged: "status_acknowledged",
  Cleared: "status_cleared",
  Pending: "status_pending",
  Sent: "status_sent",
  Accepted: "status_accepted",
  Rejected: "status_rejected",
  Failed: "status_failed",
  Timeout: "status_timeout",
  Completed: "status_completed",
  Inactive: "status_inactive",
  Locked: "status_locked",
  Enabled: "status_enabled",
  Disabled: "status_disabled",
  Info: "status_info",
  Success: "status_success",
  Auto: "status_auto",
  Manual: "status_manual",
  Charge: "status_charge",
  Discharge: "status_discharge",
  Backup: "status_backup",
  Maintenance: "status_maintenance",
  "Peak Shaving": "status_peak_shaving",
  High: "status_high",
  Low: "status_low",
  Supplied: "status_supplied",
  Generating: "status_generating",
  Idle: "status_idle",
};

export default function StatusBadge({
  status,
  showIcon = true,
  size = "normal",
}) {
  const intl = useIntl();
  const className = badgeMap[status] || "badge-gray";
  const Icon = iconMap[status];
  const messageId = statusMessageIds[status];
  const label = messageId
    ? intl.formatMessage({ id: messageId, defaultMessage: status })
    : status;

  return (
    <span className={`badge ${className} ${size === "small" ? "badge-sm" : ""}`}>
      {showIcon && Icon ? <Icon size={12} /> : null}
      {label}
    </span>
  );
}
