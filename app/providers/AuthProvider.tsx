'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Role, User } from '@/lib/rbac';
import { DemoFullAccessUser } from '@/lib/rbac';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setRoles: (roles: Role[]) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'optilog.auth.user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
      } else {
        // Demo user with full access by default
        setUser(DemoFullAccessUser);
      }
    } catch (e) {
      setUser(DemoFullAccessUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: (u: User) => setUser(u),
    logout: () => setUser(null),
    setRoles: (roles: Role[]) => setUser(prev => prev ? { ...prev, roles } : prev),
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}