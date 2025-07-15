'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/common/Sidebar';
import styles from './Layout.module.css';
import { usePathname } from 'next/navigation';
import { StatusProvider } from '@/contexts/StatusContext';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && pathname !== '/login') {
    return null;
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StatusProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </StatusProvider>
    </AuthProvider>
  );
}
