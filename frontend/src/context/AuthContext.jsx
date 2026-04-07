import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback(async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
