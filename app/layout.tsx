import './globals.css';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

// Carregar componentes de UI (MUI/Emotion) apenas no cliente para evitar SSR de Emotion no _not-found
const LayoutWrapper = dynamic(() => import('@/components/layout/LayoutWrapper'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/ui/ToastProvider'), { ssr: false });
const ServiceWorkerRegister = dynamic(() => import('@/app/providers/ServiceWorker'), { ssr: false });
const SWUpdateSnackbar = dynamic(() => import('@/components/pwa/SWUpdateSnackbar'), { ssr: false });

// Configurações para server-side rendering e edge runtime
export const runtime = 'edge';
export const preferredRegion = ['gru1', 'iad1']; // São Paulo e Virginia

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://optilog-app-logiccamila-wqs-projects.vercel.app';

export const metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'OptiLog • Plataforma de Insights',
    template: '%s • OptiLog',
  },
  description: 'OptiLog: conteúdo e ferramentas com IA em tema escuro.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'EJG Optilog',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'OptiLog • Plataforma de Insights',
    description: 'UI escura inspirada no Copilot, com destaque azul.',
    url: appUrl,
    siteName: 'OptiLog',
    images: [
      { url: `${appUrl}/logo-xyz.svg`, width: 512, height: 512, alt: 'OptiLog' },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'OptiLog',
    description: 'UI escura com MUI e integração com IA.',
    images: [`${appUrl}/logo-xyz.svg`],
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
          <ToastProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <ServiceWorkerRegister />
            <SWUpdateSnackbar />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
