'use client';

import React from 'react';
import type { Role } from '@/lib/rbac';
import { hasAnyRole } from '@/lib/rbac';
import { useAuth } from '@/app/providers/AuthProvider';
import AccessDenied from './AccessDenied';

interface Props {
  roles: Role[];
  children: React.ReactNode;
}

export default function AccessControl({ roles, children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-gray-600">Carregando permissões…</div>
      </div>
    );
  }

  if (!hasAnyRole(user, roles)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}