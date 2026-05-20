import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuBell, LuClock3, LuFactory, LuLogOut, LuMenu } from 'react-icons/lu';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/battery': 'Battery Detail',
  '/pcs': 'PCS Detail',
  '/alarms': 'Alarm Management',
  '/energy-report': 'Energy Report',
  '/users': 'User Management',
  '/settings': 'System Settings',
};

export default function Header({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Hệ thống lưu trữ toàn diện</h1>
      </div>
      <div className="header-center">
      </div>
      <div className="header-right">
        <button className="header-notification" onClick={() => navigate('/alarms')} aria-label="Open alarms">
          <LuBell />
          <span className="header-notification-badge">3</span>
        </button>
        <div className="header-user" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="header-avatar">{currentUser?.name?.charAt(0) || 'U'}</div>
          <div className="header-user-info">
            <span className="header-user-name">{currentUser?.name}</span>
            <span className="header-user-role">{currentUser?.role}</span>
          </div>
          {showUserMenu && (
            <div className="header-user-menu">
              <div className="header-user-menu-item" onClick={handleLogout}>
                <LuLogOut />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
