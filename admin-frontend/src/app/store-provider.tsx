'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';

function AdminAuthLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#131b2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          border: '3px solid rgba(0, 92, 85, 0.25)',
          borderTopColor: '#00a896',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: 16,
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: '0.875rem', color: '#94a3b8', letterSpacing: '0.02em', fontWeight: 600 }}>
        Synchronizing Operations Console...
      </div>
    </div>
  );
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      {isClient ? (
        <PersistGate loading={<AdminAuthLoadingFallback />} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        <AdminAuthLoadingFallback />
      )}
    </Provider>
  );
}

