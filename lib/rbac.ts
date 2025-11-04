export type Role = 'admin' | 'manager' | 'operator' | 'finance' | 'driver' | 'mechanic';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role; // Mudado de roles[] para role único
  roles: Role[]; // Mantido para compatibilidade
  status?: 'active' | 'inactive' | 'suspended';
}

export const ALL_ROLES: Role[] = ['admin', 'manager', 'operator', 'finance', 'driver', 'mechanic'];

export function hasAnyRole(user: User | null | undefined, allowed: Role[]): boolean {
  if (!user || !Array.isArray(user.roles)) return false;
  if (allowed.length === 0) return true;
  return user.roles.some((r) => allowed.includes(r));
}

export function isAdmin(user: User | null | undefined): boolean {
  return !!user && user.roles.includes('admin');
}

export const DemoFullAccessUser: User = {
  id: 'demo-admin',
  name: 'Demo Admin',
  email: 'demo@optilog.local',
  role: 'admin',
  roles: ['admin'],
  status: 'active'
};

// Função auxiliar para redirecionar usuário baseado no role
export function getDefaultRouteForRole(role: Role): string {
  switch (role) {
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
}
