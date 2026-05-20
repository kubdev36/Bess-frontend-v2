import React from 'react';
import { NavLink } from 'react-router-dom';
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
    label: 'OVERVIEW',
    items: [
      { path: '/dashboard', icon: <LuLayoutDashboard />, label: 'Dashboard Overview', perm: 'view_dashboard' },
    ],
  },
  {
    label: 'MONITORING',
    items: [
      { path: '/pcs', icon: <LuCpu />, label: 'PCS Detail', perm: 'view_pcs' },
      { path: '/battery', icon: <LuBatteryCharging />, label: 'Battery Detail', perm: 'view_battery' },
    ],
  },
  {
    label: 'OPERATION',
    items: [
      { path: '/energy-report', icon: <LuChartNoAxesCombined />, label: 'Energy Report', perm: 'view_report' },
      { path: '/alarms', icon: <LuBell />, label: 'Alarm Management', perm: 'view_alarm' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { path: '/users', icon: <LuUsers />, label: 'User Management', perm: 'manage_users' },
      { path: '/settings', icon: <LuSettings />, label: 'System Settings', perm: 'system_settings' },
      { path: '/roles', icon: <RiFolderSettingsFill />, label: 'Role Management', perm: 'manage_roles' },
      { path: '/user-info', icon: <FaUserEdit />, label: 'User Info', perm: 'view_user_info' }

    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
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
            <div key={group.label} className="sidebar-group">
              {!collapsed && <div className="sidebar-group-label">{group.label}</div>}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
