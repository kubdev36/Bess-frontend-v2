import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import './styles/global.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import BatteryPage from './pages/Battery/BatteryPage';
import PCSPage from './pages/PCS/PCSPage';
import AlarmPage from './pages/Alarm/AlarmPage';
import EnergyReportPage from './pages/EnergyReport/EnergyReportPage';
import SchedulePage from './pages/Schedule/SchedulePage';
import UserManagementPage from './pages/UserManagement/UserManagementPage';
import SystemSettingsPage from './pages/SystemSettings/SystemSettingsPage';
import { VietnameseLocalization } from './utils/localizeVi';

function ProtectedRoute({ permission }) {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage mode="login" />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <LoginPage mode="register" />
          </PublicOnlyRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/battery" element={<BatteryPage />} />
          <Route path="/pcs" element={<PCSPage />} />
          <Route path="/alarms" element={<AlarmPage />} />
          <Route path="/energy-report" element={<EnergyReportPage />} />

          <Route element={<ProtectedRoute permission="manage_schedule" />}>
            <Route path="/schedule" element={<SchedulePage />} />
          </Route>
          <Route element={<ProtectedRoute permission="manage_users" />}>
            <Route path="/users" element={<UserManagementPage />} />
          </Route>

          <Route element={<ProtectedRoute permission="system_settings" />}>
            <Route path="/settings" element={<SystemSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VietnameseLocalization />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
