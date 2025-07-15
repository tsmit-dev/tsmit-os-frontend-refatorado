'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/common.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
