// Sistema de permissões e roles

export enum UserRole {
// Exportação padrão para centralização de roles
  SUPER_GESTOR = 'super_gestor',
  ADMINISTRADOR = 'administrador',
  FINANCEIRO = 'financeiro',
  OPERADOR_LOGISTICO = 'operador_logistico',
  MOTORISTA = 'motorista',
  MECANICO = 'mecanico',
  VISUALIZADOR = 'visualizador',
}

export interface UserPermissions {
  email: string;
  role: UserRole;
  modules: string[];
  verified: boolean;
  active: boolean;
}

// Usuários autorizados e suas permissões
const authorizedUsers: Record<string, UserPermissions> = {
  'logiccamila@gmail.com': {
    email: 'logiccamila@gmail.com',
    role: UserRole.ADMINISTRADOR,
    modules: ['*'], // Acesso a todos os módulos
    verified: true,
    active: true,
  },
  'camila.eteste@gmail.com': {
    email: 'camila.eteste@gmail.com',
    role: UserRole.ADMINISTRADOR,
    modules: ['*'],
    verified: true,
    active: true,
  },
  'camila.etseral@gmail.com': {
    email: 'camila.etseral@gmail.com',
    role: UserRole.SUPER_GESTOR,
    modules: ['*'],
    verified: true,
    active: true,
  },
  'teste@teste.com': {
    email: 'teste@teste.com',
    role: UserRole.VISUALIZADOR,
    modules: ['dashboard', 'relatorios'],
    verified: true,
    active: true,
  },
};

// Senhas autorizadas (em produção, usar hash)
const authorizedPasswords: Record<string, string> = {
  'logiccamila@gmail.com': 'Multi12345678',
  'camila.eteste@gmail.com': 'Multi@#$%362748',
  'camila.etseral@gmail.com': 'Multi@#$%362748',
  'teste@teste.com': 'teste123',
};

export function checkUserPermissions(email: string): UserPermissions | null {
  return authorizedUsers[email.toLowerCase()] || null;
}

export function validateCredentials(email: string, password: string): boolean {
  const normalizedEmail = email.toLowerCase();
  const user = authorizedUsers[normalizedEmail];
  
  if (!user || !user.active) {
    return false;
  }

  const expectedPassword = authorizedPasswords[normalizedEmail];
  return expectedPassword === password;
}

export function isUserVerified(email: string): boolean {
  const user = checkUserPermissions(email);
  return user?.verified || false;
}

export function hasModuleAccess(email: string, module: string): boolean {
  const user = checkUserPermissions(email);
  if (!user || !user.active) return false;
  
  // Admin tem acesso a tudo
  if (user.modules.includes('*')) return true;
  
  return user.modules.includes(module);
}

export function getUserRole(email: string): UserRole | null {
  const user = checkUserPermissions(email);
  return user?.role || null;
}

export function canAccessAdmin(email: string): boolean {
  const role = getUserRole(email);
  return role === UserRole.ADMINISTRADOR || role === UserRole.SUPER_GESTOR;
}

export function addAuthorizedUser(
  email: string,
  password: string,
  role: UserRole = UserRole.VISUALIZADOR,
  modules: string[] = ['dashboard']
): void {
  const normalizedEmail = email.toLowerCase();
  
  authorizedUsers[normalizedEmail] = {
    email: normalizedEmail,
    role,
    modules,
    verified: false, // Requer verificação de email
    active: true,
  };
  
  authorizedPasswords[normalizedEmail] = password;
}
