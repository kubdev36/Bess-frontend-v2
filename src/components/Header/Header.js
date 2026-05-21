import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuLogOut } from "react-icons/lu";
import { FaEarthAsia } from "react-icons/fa6";
import { useIntl } from "react-intl";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../Lang/LanguageProvider";
import "./Header.scss";

export default function Header() {
  const lang = useIntl();
  const { setLocale } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showLanMenu, setShowLanMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleChangeLanguage = (nextLang) => {
    setLocale(nextLang);
    setShowLanMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{lang.formatMessage({ id: "bess" })}</h1>
      </div>
      <div className="header-right">
        <button
          className="header-notification"
          onClick={() => setShowLanMenu(!showLanMenu)}
          aria-label={lang.formatMessage({ id: "common.select_language" })}
        >
          <FaEarthAsia />

          {showLanMenu && (
            <div className="header-user-menu">
              <div
                className="header-user-menu-item"
                onClick={() => handleChangeLanguage("vi")}
              >
                {lang.formatMessage({ id: "language.vi" })}
              </div>
              <div
                className="header-user-menu-item"
                onClick={() => handleChangeLanguage("en")}
              >
                {lang.formatMessage({ id: "language.en" })}
              </div>
            </div>
          )}
        </button>

        <button
          className="header-notification"
          onClick={() => navigate("/alarms")}
          aria-label={lang.formatMessage({ id: "common.open_alarms" })}
        >
          <LuBell />
          <span className="header-notification-badge">3</span>
        </button>
        <div className="header-user" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="header-avatar">{currentUser?.name?.charAt(0) || "U"}</div>
          <div className="header-user-info">
            <span className="header-user-name">{currentUser?.name}</span>
            <span className="header-user-role">{currentUser?.role}</span>
          </div>
          {showUserMenu && (
            <div className="header-user-menu">
              <div className="header-user-menu-item" onClick={handleLogout}>
                <LuLogOut />
                {lang.formatMessage({ id: "common.logout" })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
