import '../styles/design-tokens.css';
import './globals.css';
import { ReactNode } from 'react';
import Header from './Header';
import ToastProvider from '@/components/ui/ToastProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import ServiceWorkerRegister from '@/app/providers/ServiceWorker';
import SWUpdateSnackbar from '@/components/pwa/SWUpdateSnackbar';
import { I18nProvider } from '@/app/providers/I18nProvider';

export const metadata = {
  metadataBase: new URL('https://studio-4793785332-8ea02.web.app'),
  title: {
    default: 'PulseOps • Plataforma de Insights',
    template: '%s • PulseOps',
  },
  description: 'PulseOps: dados e operações com IA em visual neon/tech.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'PulseOps',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'PulseOps • Plataforma de Insights',
    description: 'UI neon/tech com destaque azul → roxo → magenta.',
    url: '/',
    siteName: 'PulseOps',
    images: [{ url: '/logo.svg', width: 512, height: 512, alt: 'PulseOps' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'PulseOps',
    description: 'UI neon/tech com IA e dados.',
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
      </body>
    </html>
  );
}
