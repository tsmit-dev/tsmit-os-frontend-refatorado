
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoginPayload, Session, User } from '@/interfaces';
import api from '@/api/api';

type UserWithoutPassword = Omit<User, 'password'>;

interface AuthContextType {
  user: UserWithoutPassword | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const fetchUser = async () => {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          const roleResponse = await api.get(`/roles/${data.roleId}`);
          setPermissions(roleResponse.data.permissions);
        } catch (error) {
          localStorage.removeItem('access_token');
          setUser(null);
          router.push('/login');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [router, pathname]);

  const login = async (payload: LoginPayload) => {
    const { data } = await api.post<Session>('/auth/login', payload);
    localStorage.setItem('access_token', data.access_token);
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setPermissions(null);
    router.push('/login');
  };

  const hasPermission = (permission: string) => {
    if (!permissions) return false;
    const [resource, action] = permission.split('.');
    return permissions[resource]?.includes(action) || permissions[resource]?.includes('*');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
