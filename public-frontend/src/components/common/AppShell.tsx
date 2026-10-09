'use client';

import React, { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CaregiverSupportBubble } from './CaregiverSupportBubble';
import { ToastSnackbar } from './ToastSnackbar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('omkar_auth_token', token);
      } else {
        localStorage.removeItem('omkar_auth_token');
      }
    }
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <CaregiverSupportBubble />
      <ToastSnackbar />
    </div>
  );
}
