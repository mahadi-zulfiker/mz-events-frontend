'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { clearStoredAuth } from '@/lib/axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'HOST' | 'ADMIN';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const STORAGE_PREF_KEY = 'auth_storage';

  const getStoredAuth = () => {
    if (typeof window === 'undefined') {
      return { user: null as User | null, storage: null as Storage | null };
    }
    const preference = window.localStorage.getItem(STORAGE_PREF_KEY);
    const orderedStores =
      preference === 'session'
        ? [window.sessionStorage, window.localStorage]
        : [window.localStorage, window.sessionStorage];

    for (const store of orderedStores) {
      const userRaw = store.getItem('user');
      const token = store.getItem('accessToken');
      if (userRaw && token) {
        return { user: JSON.parse(userRaw) as User, storage: store };
      }
    }
    return { user: null as User | null, storage: null as Storage | null };
  };

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored.user) {
      setUser(stored.user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, remember = true) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      const { accessToken, user: userData } = response.data.data;

      const storage = remember ? window.localStorage : window.sessionStorage;
      window.localStorage.setItem(
        STORAGE_PREF_KEY,
        remember ? 'local' : 'session'
      );
      storage.setItem('accessToken', accessToken);
      storage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string, role?: string) => {
    try {
      await axios.post('/auth/register', { fullName, email, password, role });
      toast.success('Registration successful! Please login.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    axios.post('/auth/logout').catch(() => undefined);
    clearStoredAuth();
    window.localStorage.removeItem(STORAGE_PREF_KEY);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
