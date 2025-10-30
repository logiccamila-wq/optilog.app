export enum ModulePermission {
  FULL_ACCESS = 'FULL_ACCESS',
  READ_ONLY = 'READ_ONLY',
}

export enum Action {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

export interface UserPermissions {
  email: string;
  permissions: ModulePermission;
  actions: Action[];
}

const adminEmail = 'logiccamila@gmail.com';
const adminPermissions: UserPermissions = {
  email: adminEmail,
  permissions: ModulePermission.FULL_ACCESS,
  actions: [Action.VIEW, Action.EDIT, Action.DELETE],
};
