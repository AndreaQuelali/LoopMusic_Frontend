import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthResponse } from './api';

export type AuthUser = AuthResponse['user'] | null;

type AuthContextValue = {
  user: AuthUser;
  token: string | null;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: NonNullable<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) setToken(t);
    if (u) try { setUser(JSON.parse(u)); } catch { /* ignore */ }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    setAuth: (data: AuthResponse) => {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser: (u) => {
      setUser(u);
      try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
    }
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
