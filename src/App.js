import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./components/Screen/Login/LoginPage";
import DashboardPage from "./components/Screen/Dashboard/DashboardPage";
import BatteryPage from "./components/Screen/Battery/BatteryPage";
import PCSPage from "./components/Screen/PCS/PCSPage";
import AlarmPage from "./components/Screen/Alarm/AlarmPage";
import EnergyReportPage from "./components/Screen/EnergyReport/EnergyReportPage";
import UserManagementPage from "./components/Screen/UserManagement/UserManagementPage";
import SystemSettingsPage from "./components/Screen/SystemSettings/SystemSettingsPage";
import { VietnameseLocalization } from "./components/utils/localizeVi";
import RolePage from "./components/Screen/Role/Role";
import UserInfoPage from "./components/Screen/UserInfo/UserInfo";

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
            <LoginPage />
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
          <Route path="/roles" element={<RolePage />} />
          <Route path="/user-info" element={<UserInfoPage />} />

          <Route element={<ProtectedRoute permission="manage_users" />}>
            <Route path="/users" element={<UserManagementPage />} />
          </Route>

          <Route element={<ProtectedRoute permission="system_settings" />}>
            <Route path="/settings" element={<SystemSettingsPage />} />
          </Route>
        </Route>
      </Route>
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
