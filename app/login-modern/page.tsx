'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthInstance } from '@/lib/firebaseClient';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import { useToast } from '@/components/ui/ToastProvider';
import { Mail, Lock } from 'lucide-react';

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
    default:
      return err?.message || 'Falha no login.';
  }
}

export default function LoginModernPage() {
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
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#0D111B] to-[#0a0f18] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-semibold">Entrar</h1>
          <p className="text-sm text-slate-400">Acesse sua conta para continuar</p>
        </div>
        {error && (
          <div className="mb-3 rounded-md border border-red-500 bg-[#1a0f0f] p-2 text-sm text-red-300">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-3 rounded-md border border-blue-700 bg-[#0b1420] p-2 text-sm text-blue-300">
            {info}
          </div>
        )}
        <form onSubmit={onSubmit} className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <Button
          type="button"
          variant="ghost"
          className="mt-2"
          disabled={loading}
          onClick={onResetPassword}
        >
          Esqueci minha senha
        </Button>
        <div className="mt-3 text-sm text-slate-400">
          Não tem conta?{' '}
          <Link href="/signup" className="text-blue-300 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </Card>
    </main>
  );
}
