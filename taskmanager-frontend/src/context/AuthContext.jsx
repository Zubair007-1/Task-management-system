import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, decodeJwt } from '../services/authService';
import { LS_TOKEN, LS_USER, LS_REMEMBER } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { id, name, email, role, sub }
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(LS_TOKEN);
    if (storedToken) {
      const payload = decodeJwt(storedToken);
      if (payload && payload.exp * 1000 > Date.now()) {
        setToken(storedToken);
        const storedUser = localStorage.getItem(LS_USER);
        setUser(storedUser ? JSON.parse(storedUser) : { email: payload.sub, role: payload.role || 'USER' });
      } else {
        // Token expired — clear
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    const data = await authService.login({ email, password });
    const { token: jwt } = data;
    const payload = decodeJwt(jwt);

    const userData = {
      email: payload?.sub || email,
      role:  payload?.role || 'USER',
      name:  payload?.name || email.split('@')[0],
    };

    setToken(jwt);
    setUser(userData);
    localStorage.setItem(LS_TOKEN, jwt);
    localStorage.setItem(LS_USER, JSON.stringify(userData));
    if (remember) localStorage.setItem(LS_REMEMBER, 'true');

    return userData;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_REMEMBER);
  }, []);

  const register = useCallback(async (payload) => {
    return authService.register(payload);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
