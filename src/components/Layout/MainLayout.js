import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './MainLayout.scss';
import { isMobile } from 'react-device-detect';
export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      {isMobile ? (
        <div className={""}>
          <div className="">
            <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className="layoutMobile-content">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <div className={`layout ${sidebarCollapsed ? 'layout-collapsed' : ''}`}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className="layout-main">
            <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className="layout-content">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
