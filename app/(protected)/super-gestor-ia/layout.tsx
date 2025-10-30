'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuperGestorIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 🔐 ACESSO EXCLUSIVO: apenas logiccamila@gmail.com
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (
      status === 'authenticated' &&
      session?.user?.email !== 'logiccamila@gmail.com'
    ) {
      // Redireciona para dashboard se não for admin
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, não renderiza nada (useEffect já redirecionou)
  if (session?.user?.email !== 'logiccamila@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo com info de módulo secreto */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 text-center text-sm font-semibold">
        🔐 MÓDULO EXCLUSIVO - Super Gestor IA/ML - Acesso: {session?.user?.email}
      </div>
      
      {/* Conteúdo */}
      <main>{children}</main>
    </div>
  );
}