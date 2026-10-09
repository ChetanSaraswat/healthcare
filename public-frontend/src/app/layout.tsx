import type { Metadata } from 'next';
import Script from 'next/script';
import StoreProvider from './store-provider';
import '@/styles/globals.scss';
import { AppShell } from '@/components/common/AppShell';

export const metadata: Metadata = {
  title: 'Omkar Healthcare — Buy & Rent Hospital-Grade Medical Equipment in India',
  description:
    'Pan-India clinical platform for families & caregivers to buy and rent genuine hospital-grade medical equipment with equal-weight journeys, 10-step sterilization, and 4-hour dispatch.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          id="razorpay-checkout-script"
        />
      </body>
    </html>
  );
}
