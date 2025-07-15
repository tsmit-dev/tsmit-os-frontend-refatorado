
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api/api';
import { Status } from '@/interfaces';
import { useAuth } from './AuthContext';

interface StatusContextType {
  statuses: Status[];
  loading: boolean;
}

const StatusContext = createContext<StatusContextType>({
  statuses: [],
  loading: true,
});

export const useStatuses = () => useContext(StatusContext);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await api.get('/statuses');
        setStatuses(response.data);
      } catch (error) {
        console.error('Failed to fetch statuses', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchStatuses();
    }
  }, [user]);

  return (
    <StatusContext.Provider value={{ statuses, loading }}>
      {children}
    </StatusContext.Provider>
  );
};
