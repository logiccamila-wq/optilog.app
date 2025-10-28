'use client';

import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Rotas que NÃO devem ter o layout principal (sidebar/header)
const publicRoutes = [
  '/login',
  '/login-modern',
  '/signup',
  '/logout',
  '/motorista', // App motorista tem layout próprio
  '/driver', // App motorista alternativo
];

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Verifica se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Se for rota pública, renderiza sem layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Caso contrário, usa o MainLayout
  return <MainLayout>{children}</MainLayout>;
}
