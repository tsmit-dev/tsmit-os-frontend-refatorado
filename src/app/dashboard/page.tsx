'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppLayout from '@/app/AppLayout';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <div>
        <h1>Bem-vindo, {user.name}!</h1>
        <p>Selecione uma opção no menu para começar.</p>
      </div>
    </AppLayout>
  );
}
