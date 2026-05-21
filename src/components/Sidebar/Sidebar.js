import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  LuBatteryCharging,
  LuBell,
  LuChartNoAxesCombined,
  LuCpu,
  LuLayoutDashboard,
  LuSettings,
  LuUsers,
} from 'react-icons/lu';
import { FaUserEdit } from "react-icons/fa";
import { RiFolderSettingsFill } from "react-icons/ri";
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.scss';

const menuGroups = [
  {
    labelId: 'sidebar.group.overview',
    items: [
      { path: '/dashboard', icon: <LuLayoutDashboard />, labelId: 'sidebar.item.dashboard_overview', perm: 'view_dashboard' },
    ],
  },
  {
    labelId: 'sidebar.group.monitoring',
    items: [
      { path: '/pcs', icon: <LuCpu />, labelId: 'sidebar.item.pcs_detail', perm: 'view_pcs' },
      { path: '/battery', icon: <LuBatteryCharging />, labelId: 'sidebar.item.battery_detail', perm: 'view_battery' },
    ],
  },
  {
    labelId: 'sidebar.group.operation',
    items: [
      { path: '/energy-report', icon: <LuChartNoAxesCombined />, labelId: 'sidebar.item.energy_report', perm: 'view_report' },
      { path: '/alarms', icon: <LuBell />, labelId: 'sidebar.item.alarm_management', perm: 'view_alarm' },
    ],
  },
  {
    labelId: 'sidebar.group.management',
    items: [
      { path: '/users', icon: <LuUsers />, labelId: 'sidebar.item.user_management', perm: 'manage_users' },
      { path: '/settings', icon: <LuSettings />, labelId: 'sidebar.item.system_settings', perm: 'system_settings' },
      { path: '/roles', icon: <RiFolderSettingsFill />, labelId: 'sidebar.item.role_management', perm: 'manage_roles' },
      { path: '/user-info', icon: <FaUserEdit />, labelId: 'sidebar.item.user_info', perm: 'view_user_info' }

    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const lang = useIntl();
  const { hasPermission } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-logo" onClick={onToggle}>
        <img
          className={`sidebar-logo-image ${collapsed ? 'sidebar-logo-image-small' : 'sidebar-logo-image-large'}`}
          src={collapsed ? '/logoNho.png' : '/logoTo.png'}
          alt="BESS Monitor"
        />
      </div>
      <nav className="sidebar-nav">
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter((item) => hasPermission(item.perm));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.labelId} className="sidebar-group">
              {!collapsed && <div className="sidebar-group-label">{lang.formatMessage({ id: group.labelId })}</div>}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                  title={collapsed ? lang.formatMessage({ id: item.labelId }) : undefined}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar-item-label">{lang.formatMessage({ id: item.labelId })}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
