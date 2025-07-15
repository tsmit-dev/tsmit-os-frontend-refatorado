'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/api';
import { User } from '@/interfaces';
import { AxiosError } from 'axios';

// Define a type for the login credentials
type LoginCredentials = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('access_token');
        }
      }
    };
    checkUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { session } = data;
      localStorage.setItem('access_token', session.access_token);
      api.defaults.headers.Authorization = `Bearer ${session.access_token}`;
      const { data: userData } = await api.get('/auth/me');
      setUser(userData.user);
      router.push('/dashboard');
    } catch (error) {
      const err = error as AxiosError;
      console.error('Login failed', err.response?.data);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    delete api.defaults.headers.Authorization;
    router.push('/login');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
