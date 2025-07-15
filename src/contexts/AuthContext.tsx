
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Session, User } from '@/interfaces';
import api from '@/api/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (session: Session) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // TODO: Add a proper token validation endpoint
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

  const login = (session: Session) => {
    localStorage.setItem('access_token', session.access_token);
    setUser(session.user);
    router.push('/');
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
