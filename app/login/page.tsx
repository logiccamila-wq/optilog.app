'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthInstance } from '@/lib/firebaseClient';
import { useToast } from '@/components/ui/ToastProvider';
import styles from './page.module.css';

function translateAuthError(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email já cadastrado. Faça login ou redefina sua senha.';
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-credential':
      return 'Credencial inválida ou expirada. Redefina sua senha ou tente novamente.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de rede. Verifique sua conexão.';
    case 'auth/operation-not-allowed':
      return 'Login por email/senha desativado no projeto.';
    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado no Firebase Auth.';
    case 'auth/invalid-api-key':
      return 'API key inválida ou não configurada.';
    default:
      return err?.message || 'Falha no login.';
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const auth = await getAuthInstance();
    if (!auth) {
      setError('Autenticação não configurada. Defina variáveis NEXT_PUBLIC_* no .env.local');
      return;
    }
    setLoading(true);
    try {
      throw new Error('Autenticação via Firebase removida');
      toast.show('Login realizado com sucesso!', 'success');
      router.push('/');
    } catch (err: any) {
      const msg = translateAuthError(err);
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    setError(null);
    setInfo(null);
    const auth = await getAuthInstance();
    if (!auth) {
      setError('Firebase não configurado. Preencha NEXT_PUBLIC_FIREBASE_* no .env.local');
      return;
    }
    if (!email) {
      setError('Informe seu email para redefinir a senha.');
      return;
    }
    try {
      throw new Error('Recuperação de senha via Firebase removida');
      const msg = 'Enviamos um link de redefinição de senha para seu email.';
      setInfo(msg);
      toast.show(msg, 'info');
    } catch (err: any) {
      const msg = translateAuthError(err);
      setError(msg);
      toast.show(msg, 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundEffect} />

      <section className={styles.loginCard} aria-label="Login Devoptilog">
        <div className={styles.logoSection}>
          <img src="https://i.imgur.com/your_devoptilog_favicon_url.png" alt="Logo Devoptilog" />
          <h2>Devoptilog</h2>
        </div>
        <p className={styles.slogan}>Optimized Logistics Development</p>

        <h1 className={styles.mainTitle}>Faça login para continuar</h1>
        <p className={styles.subtitle}>
          Acesse sua conta para gerenciar frotas, rotas e indicadores com
          inteligência artificial e fluxo contínuo.
        </p>

        <form onSubmit={onSubmit} className={styles.form}>
          {error && <div className={styles.alertError}>{error}</div>}
          {info && <div className={styles.alertInfo}>{info}</div>}

          <div className={styles.inputGroup}>
            <span className={styles.icon}>@</span>
            <input
              type="email"
              placeholder="Email ou Usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              aria-label="Email ou usuário"
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              aria-label="Senha"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <Link href="/signup" className={styles.btnSecondary}>
              Cadastre-se Grátis
            </Link>
          </div>
        </form>

        <button type="button" className={styles.linkButton} onClick={onResetPassword} disabled={loading}>
          Esqueci minha senha
        </button>

        <div className={styles.powered}>Powered by TRAE IDE • Next 14</div>
      </section>
    </div>
  );
}
