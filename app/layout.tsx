import '../styles/design-tokens.css';
import './globals.css';
import { ReactNode } from 'react';
import Header from './Header';
import ToastProvider from '@/components/ui/ToastProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import ServiceWorkerRegister from '@/app/providers/ServiceWorker';
import SWUpdateSnackbar from '@/components/pwa/SWUpdateSnackbar';
import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  metadataBase: new URL('https://studio-4793785332-8ea02.web.app'),
  title: {
    default: 'Devoptilog',
    template: '%s • Devoptilog',
  },
  description: 'Devoptilog: Optimized Logistics Development.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Devoptilog',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Devoptilog • Optimized Logistics',
    description: 'Optimized logistics platform for operations and insights.',
    url: '/',
    siteName: 'Devoptilog',
    images: [{ url: '/logo.svg', width: 512, height: 512, alt: 'Devoptilog' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Devoptilog',
    description: 'Optimized Logistics Development.',
    images: ['/logo.svg'],
  },
};

export const viewport = {
  themeColor: '#0E539A',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <I18nProvider>
              <ToastProvider>
                <Header />
                {children}
                <ServiceWorkerRegister />
                <SWUpdateSnackbar />
              </ToastProvider>
            </I18nProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
