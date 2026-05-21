import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuBell, LuLogOut } from 'react-icons/lu';
import { useAuth } from '../contexts/AuthContext';
import { FaEarthAsia } from "react-icons/fa6";


import './Header.scss';
import { useIntl } from 'react-intl';
import { langConfig } from '../Lang/LanguageProvider';

export default function Header() {
  const lang = useIntl();
  const { currentUser, logout } = useAuth();


  
  const navigate = useNavigate();
  const [showLanMenu, setShowLanMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{lang.formatMessage({ id: 'bess' })}</h1>
      </div>
      <div className="header-right">
        <button className="header-notification" onClick={() => setShowLanMenu(!showLanMenu)} aria-label="Open alarms">
          <FaEarthAsia />

          {showLanMenu && (
            <div className="header-user-menu">
              <div className="header-user-menu-item" onClick={() => langConfig.value = 'vi'}>
                Tiếng Việt
              </div>
              <div className="header-user-menu-item" onClick={() => langConfig.value = 'en'}>
                English
              </div>
            </div>
          )}
        </button>

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
