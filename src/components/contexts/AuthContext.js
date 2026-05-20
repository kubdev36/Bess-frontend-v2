import React, { createContext, useCallback, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

const permissions = {
  Viewer: ['view_dashboard', 'view_battery', 'view_pcs', 'view_alarm', 'view_report'],
  Operator: [
    'view_dashboard', 'view_battery', 'view_pcs', 'view_alarm', 'view_report',
  ],
  Admin: [
    'view_dashboard', 'view_battery', 'view_pcs',
    'view_alarm', 'view_report', 'manage_users', 'system_settings',
    'manage_roles', 'view_user_info',
  ],
  Engineer: [
    'view_dashboard', 'view_battery', 'view_pcs',
    'view_alarm', 'view_report', 'system_settings',
  ],
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('bess_user');
    const remembered = localStorage.getItem('bess_user');
    return saved ? JSON.parse(saved) : remembered ? JSON.parse(remembered) : null;
  });

  const login = useCallback((identifier, password, remember) => {
    const normalizedInput = identifier.trim().toLowerCase();
    const user = mockUsers.find((item) => {
      const username = item.email.split('@')[0].toLowerCase();
      return (
        (item.email.toLowerCase() === normalizedInput || username === normalizedInput) &&
        item.password === password
      );
    });

    if (!user) {
      return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
    }

    if (user.status === 'Locked') {
      return { success: false, error: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.' };
    }

    if (user.status === 'Inactive') {
      return { success: false, error: 'Tài khoản đang ngừng hoạt động.' };
    }

    const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
    setCurrentUser(userData);

    if (remember) {
      localStorage.setItem('bess_user', JSON.stringify(userData));
    }

    sessionStorage.setItem('bess_user', JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('bess_user');
    localStorage.removeItem('bess_user');
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!currentUser) return false;
    const rolePerms = permissions[currentUser.role] || [];
    return rolePerms.includes(permission);
  }, [currentUser]);

  const checkPassword = useCallback((password) => {
    if (!currentUser) return false;
    const user = mockUsers.find((item) => item.id === currentUser.id);
    return user && user.password === password;
  }, [currentUser]);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    hasPermission,
    checkPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
