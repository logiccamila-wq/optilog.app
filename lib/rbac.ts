export type Role = 'admin' | 'director' | 'operator' | 'finance' | 'driver' | 'mechanic';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export const ALL_ROLES: Role[] = ['admin', 'director', 'operator', 'finance', 'driver', 'mechanic'];

export function hasAnyRole(user: User | null | undefined, allowed: Role[]): boolean {
  if (!user || !Array.isArray(user.roles)) return false;
  if (allowed.length === 0) return true;
  return user.roles.some(r => allowed.includes(r));
}

export function isAdmin(user: User | null | undefined): boolean {
  return !!user && user.roles.includes('admin');
}

export const DemoFullAccessUser: User = {
  id: 'demo-admin',
  name: 'Demo Admin',
  email: 'demo@optilog.local',
  roles: ['admin'],
};