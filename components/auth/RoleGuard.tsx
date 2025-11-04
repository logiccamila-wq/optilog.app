'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { Role, hasAnyRole } from '@/lib/rbac';
import { CircularProgress, Box } from '@mui/material';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

/**
 * RoleGuard - Protege rotas baseado em roles do usuário
 * Redireciona automaticamente se o usuário não tiver permissão
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/access-denied' 
}: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Se não estiver autenticado, redireciona para login
    if (!user) {
      router.push('/login');
      return;
    }

    // Se não tiver permissão, redireciona para página de acesso negado
    if (!hasAnyRole(user, allowedRoles)) {
      router.push(fallbackPath);
    }
  }, [user, loading, allowedRoles, fallbackPath, router]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se não estiver autenticado ou sem permissão, não renderiza nada
  // (o redirecionamento já foi feito no useEffect)
  if (!user || !hasAnyRole(user, allowedRoles)) {
    return null;
  }

  // Se tiver permissão, renderiza o conteúdo
  return <>{children}</>;
}
