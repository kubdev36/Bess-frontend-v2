import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuBell, LuClock3, LuFactory, LuLogOut, LuMenu } from 'react-icons/lu';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/realtime': 'Realtime Monitoring',
  '/powerflow': 'Power Flow',
  '/battery': 'Battery Detail',
  '/pcs': 'PCS Detail',
  '/alarms': 'Alarm Management',
  '/schedule': 'Schedule Management',
  '/control': 'Control Panel',
  '/energy-report': 'Energy Report',
  '/command-history': 'Command History',
  '/operation-logs': 'Operation Logs',
  '/users': 'User Management',
  '/parameters': 'Parameter Settings',
  '/settings': 'System Settings',
};

export default function Header({ onMenuToggle }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitle = pageTitles[location.pathname] || 'BESS Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle} aria-label="Toggle navigation">
          <LuMenu />
        </button>
        <h1 className="header-title">{pageTitle}</h1>
      </div>
      <div className="header-center">
        <span className="header-station">
          <LuFactory />
          BESS Station 01
        </span>
      </div>
      <div className="header-right">
        <div className="header-time">
          <span className="header-clock">
            <LuClock3 />
            {time.toLocaleTimeString()}
          </span>
        </div>
        <div className="header-connection">
          <span className="connection-dot connected"></span>
          <span className="connection-text">Connected</span>
        </div>
        <button className="header-notification" onClick={() => navigate('/alarms')} aria-label="Open alarms">
          <LuBell />
          <span className="notification-badge">3</span>
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
