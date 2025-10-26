// Stack Auth client configuration
// Substitui Firebase Auth para autenticação moderna

export const stackAuthConfig = {
  projectId: process.env.NEXT_PUBLIC_STACK_AUTH_PROJECT_ID || '',
  jwksUrl: process.env.NEXT_PUBLIC_STACK_AUTH_JWKS_URL || '',
  isConfigured: !!(process.env.NEXT_PUBLIC_STACK_AUTH_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_AUTH_JWKS_URL),
};

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Simula cliente Stack Auth (substituir por SDK oficial quando disponível)
export class StackAuthClient {
  private currentUser: User | null = null;

  async signIn(email: string, password: string): Promise<User> {
    // Simulação - substituir por chamada real à API Stack Auth
    if (!stackAuthConfig.isConfigured) {
      throw new Error('Stack Auth não configurado. Configure NEXT_PUBLIC_STACK_AUTH_PROJECT_ID e NEXT_PUBLIC_STACK_AUTH_JWKS_URL');
    }

    // Validação básica
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Em produção, fazer POST para Stack Auth API
    // Por ora, simula login bem-sucedido
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
    };

    this.currentUser = user;
    
    // Armazena token no localStorage (em produção, usar httpOnly cookies)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stack_auth_user', JSON.stringify(user));
    }

    return user;
  }

  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    if (!stackAuthConfig.isConfigured) {
      throw new Error('Stack Auth não configurado');
    }

    // Validação
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    if (password.length < 8) {
      throw new Error('Senha deve ter no mínimo 8 caracteres');
    }

    // Simulação - em produção, POST para /api/auth/signup
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      displayName: displayName || email.split('@')[0],
    };

    this.currentUser = user;

    if (typeof window !== 'undefined') {
      localStorage.setItem('stack_auth_user', JSON.stringify(user));
    }

    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stack_auth_user');
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    // Tenta recuperar do localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stack_auth_user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
          return this.currentUser;
        } catch {
          localStorage.removeItem('stack_auth_user');
        }
      }
    }

    return null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Chama imediatamente com usuário atual
    callback(this.getCurrentUser());

    // Retorna função de cleanup
    return () => {};
  }
}

// Instância singleton
export const stackAuth = new StackAuthClient();
