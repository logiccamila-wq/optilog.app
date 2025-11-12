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
  // Motoristas importados da planilha Google Sheets
  'motorista.jailson@ejgtransporte.com.br': {
    email: 'motorista.jailson@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.rivanio@ejgtransporte.com.br': {
    email: 'motorista.rivanio@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.enio@ejgtransporte.com.br': {
    email: 'motorista.enio@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.ednaldo@ejgtransporte.com.br': {
    email: 'motorista.ednaldo@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.nilton@ejgtransporte.com.br': {
    email: 'motorista.nilton@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.marcio@ejgtransporte.com.br': {
    email: 'motorista.marcio@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.joseantonio@ejgtransporte.com.br': {
    email: 'motorista.joseantonio@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.ruan@ejgtransporte.com.br': {
    email: 'motorista.ruan@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.geisiel@ejgtransporte.com.br': {
    email: 'motorista.geisiel@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.danilo@ejgtransporte.com.br': {
    email: 'motorista.danilo@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  'motorista.messias@ejgtransporte.com.br': {
    email: 'motorista.messias@ejgtransporte.com.br',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  // Diretores
  'jailson.barros@ejgtransporte.com.br': {
    email: 'jailson.barros@ejgtransporte.com.br',
    role: UserRole.FINANCEIRO,
    modules: ['dashboard', 'financeiro', 'relatorios', 'aprovacoes'],
    verified: true,
    active: true,
  },
  'enio.gomes@ejgtransportecom.br': {
    email: 'enio.gomes@ejgtransportecom.br',
    role: UserRole.OPERADOR_LOGISTICO,
    modules: ['dashboard', 'operacoes', 'tms', 'frota', 'aprovacoes'],
    verified: true,
    active: true,
  },

  // Gerente Geral
  'administrati@ejgtransporte.com.br': {
    email: 'administrati@ejgtransporte.com.br',
    role: UserRole.ADMINISTRADOR,
    modules: ['*'],
    verified: true,
    active: true,
  },

  // Auxiliar de manutenção
  'miguellareste37@gmail.com': {
    email: 'miguellareste37@gmail.com',
    role: UserRole.MECANICO,
    modules: ['dashboard', 'maintenance', 'service-orders', 'tpms'],
    verified: true,
    active: true,
  },

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
  // Usuário de teste - Motorista
  'motorista@teste.com': {
    email: 'motorista@teste.com',
    role: UserRole.MOTORISTA,
    modules: ['dashboard', 'frota', 'tms'],
    verified: true,
    active: true,
  },
  // Usuário de teste - Mecânico
  'mecanico@teste.com': {
    email: 'mecanico@teste.com',
    role: UserRole.MECANICO,
    modules: ['dashboard', 'service-orders', 'tire-service'],
    verified: true,
    active: true,
  },

  // Gerente TMS/CRM (Comercial)
  'comercial@ejgtransporte.com.br': {
    email: 'comercial@ejgtransporte.com.br',
    role: UserRole.OPERADOR_LOGISTICO,
    modules: ['dashboard', 'tms', 'crm'],
    verified: true,
    active: true,
  },

  // Gerente de Frota/Manutenção
  'frota@ejgtransporte.com.br': {
    email: 'frota@ejgtransporte.com.br',
    role: UserRole.OPERADOR_LOGISTICO,
    modules: ['dashboard', 'frota', 'maintenance', 'service-orders', 'tpms', 'oficina', 'aprovacoes'],
    verified: true,
    active: true,
  },
};

// Senhas autorizadas (em produção, usar hash)
const authorizedPasswords: Record<string, string> = {
  'motorista.jailson@ejgtransporte.com.br': 'motorista123',
  'motorista.rivanio@ejgtransporte.com.br': 'motorista123',
  'motorista.enio@ejgtransporte.com.br': 'motorista123',
  'motorista.ednaldo@ejgtransporte.com.br': 'motorista123',
  'motorista.nilton@ejgtransporte.com.br': 'motorista123',
  'motorista.marcio@ejgtransporte.com.br': 'motorista123',
  'motorista.joseantonio@ejgtransporte.com.br': 'motorista123',
  'motorista.ruan@ejgtransporte.com.br': 'motorista123',
  'motorista.geisiel@ejgtransporte.com.br': 'motorista123',
  'motorista.danilo@ejgtransporte.com.br': 'motorista123',
  'motorista.messias@ejgtransporte.com.br': 'motorista123',

  'jailson.barros@ejgtransporte.com.br': 'financeiro123',
  'enio.gomes@ejgtransportecom.br': 'operacional123',
  'administrati@ejgtransporte.com.br': 'adm123456',
  'miguellareste37@gmail.com': 'auxiliar123',
  'logiccamila@gmail.com': 'Multi12345678',
  'camila.eteste@gmail.com': 'Multi@#$%362748',
  'camila.etseral@gmail.com': 'Multi@#$%362748',
  'teste@teste.com': 'teste123',
  'motorista@teste.com': 'motorista123',
  'mecanico@teste.com': 'mecanico123',

  'comercial@ejgtransporte.com.br': 'comercial123',
  'frota@ejgtransporte.com.br': 'frota123',
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
