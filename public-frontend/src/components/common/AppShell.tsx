'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CaregiverSupportBubble } from './CaregiverSupportBubble';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <CaregiverSupportBubble />
    </div>
  );
}
