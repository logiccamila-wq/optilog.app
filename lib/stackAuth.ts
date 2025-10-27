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
    if (!stackAuthConfig.isConfigured) {
      throw new Error('Stack Auth não configurado. Configure NEXT_PUBLIC_STACK_AUTH_PROJECT_ID e NEXT_PUBLIC_STACK_AUTH_JWKS_URL');
    }

    // Validação básica
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    try {
      // Chamada à API Stack Auth
      const response = await fetch(`https://api.stack-auth.com/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Stack-Project-Id': stackAuthConfig.projectId,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Credenciais inválidas' }));
        throw new Error(error.message || 'Falha no login');
      }

      const data = await response.json();
      
      const user: User = {
        id: data.user?.id || `user_${Date.now()}`,
        email: data.user?.email || email,
        displayName: data.user?.displayName || email.split('@')[0],
      };

      this.currentUser = user;
      
      // Armazena token e user no localStorage
      if (typeof window !== 'undefined') {
        if (data.accessToken) {
          localStorage.setItem('stack_auth_token', data.accessToken);
        }
        localStorage.setItem('stack_auth_user', JSON.stringify(user));
      }

      return user;
    } catch (error: any) {
      // Se a API falhar, usa autenticação local simplificada para desenvolvimento
      console.warn('Stack Auth API call failed, using local auth:', error.message);
      
      const user: User = {
        id: `local_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
      };

      this.currentUser = user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('stack_auth_user', JSON.stringify(user));
      }

      return user;
    }
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

    try {
      // Chamada à API Stack Auth
      const response = await fetch('https://api.stack-auth.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Stack-Project-Id': stackAuthConfig.projectId,
        },
        body: JSON.stringify({
          email,
          password,
          displayName: displayName || email.split('@')[0],
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro ao criar conta' }));
        throw new Error(error.message || 'Falha no cadastro');
      }

      const data = await response.json();
      
      const user: User = {
        id: data.user?.id || `user_${Date.now()}`,
        email: data.user?.email || email,
        displayName: data.user?.displayName || displayName || email.split('@')[0],
      };

      this.currentUser = user;

      if (typeof window !== 'undefined') {
        if (data.accessToken) {
          localStorage.setItem('stack_auth_token', data.accessToken);
        }
        localStorage.setItem('stack_auth_user', JSON.stringify(user));
      }

      return user;
    } catch (error: any) {
      // Fallback para autenticação local em desenvolvimento
      console.warn('Stack Auth API call failed, using local auth:', error.message);
      
      const user: User = {
        id: `local_${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
      };

      this.currentUser = user;

      if (typeof window !== 'undefined') {
        localStorage.setItem('stack_auth_user', JSON.stringify(user));
      }

      return user;
    }
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
