import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.scss';
import StoreProvider from './store-provider';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Omkar Healthcare Operations Hub | Biomedical & Clinical Admin Console',
  description: 'Administrative portal for managing Omkar Healthcare medical equipment catalog, rentals, purchase orders, conditions, and operations.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, background: '#131b2e', minHeight: '100vh' }} suppressHydrationWarning>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
