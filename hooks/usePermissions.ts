import { useMemo } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { hasPermission, ROLE_PERMISSIONS } from '@/lib/permissions';
import { Role, hasAnyRole } from '@/lib/rbac';

/**
 * Hook personalizado para verificar permissões do usuário
 * Usado em componentes para mostrar/ocultar funcionalidades baseado no role
 */
export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user || !user.role) {
      return {
        canAccessUsers: false,
        canAccessFinance: false,
        canAccessOperations: false,
        canAccessReports: false,
        canAccessControlTower: false,
        canAccessMechanic: false,
        canAccessDriver: false,
        isAdmin: false,
        isManager: false,
        isDriver: false,
        isMechanic: false,
        isOperator: false,
        hasPermission: () => false,
        hasRole: () => false,
      };
    }

    const userRole = user.role;

    return {
      // Permissões específicas
      canAccessUsers: userRole === 'admin',
      canAccessFinance: ['admin', 'manager'].includes(userRole),
      canAccessOperations: ['admin', 'manager', 'operator'].includes(userRole),
      canAccessReports: ['admin', 'manager'].includes(userRole),
      canAccessControlTower: ['admin', 'manager', 'operator'].includes(userRole),
      canAccessMechanic: ['admin', 'mechanic'].includes(userRole),
      canAccessDriver: ['admin', 'driver'].includes(userRole),

      // Verificações de role
      isAdmin: userRole === 'admin',
      isManager: userRole === 'manager',
      isDriver: userRole === 'driver',
      isMechanic: userRole === 'mechanic',
      isOperator: userRole === 'operator',

      // Funções helper
      hasPermission: (permission: string) => hasPermission(userRole, permission),
      hasRole: (roles: Role[]) => hasAnyRole(user, roles),
    };
  }, [user]);

  return permissions;
}

/**
 * Hook para obter o dashboard padrão baseado no role do usuário
 */
export function useDefaultDashboard() {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user || !user.role) return '/dashboard';

    switch (user.role) {
      case 'admin':
      case 'manager':
        return '/dashboard';
      case 'driver':
        return '/motorista';
      case 'mechanic':
        return '/mechanic';
      case 'operator':
        return '/dashboard/operational';
      default:
        return '/dashboard';
    }
  }, [user]);
}
