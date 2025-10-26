"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, isConfigured } from '@/lib/firebaseClient';
import { Box, TextField, Button, Typography, Alert, Paper, CircularProgress } from '@mui/material';
import { useToast } from '@/components/ui/ToastProvider';

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
    if (!isConfigured || !auth) {
      setError('Firebase não configurado. Preencha NEXT_PUBLIC_FIREBASE_* no .env.local');
      return;
    }
    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
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
    if (!isConfigured || !auth) {
      setError('Firebase não configurado. Preencha NEXT_PUBLIC_FIREBASE_* no .env.local');
      return;
    }
    if (!email) {
      setError('Informe seu email para redefinir a senha.');
      return;
    }
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
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
    <main className="container">
      <Typography variant="h4" sx={{ mb: 2 }}>Login</Typography>
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Typography variant="caption">
          Projeto: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '—'} | Domínio Auth: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '—'}
        </Typography>
      </Paper>
      <Box aria-live="polite">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}
      </Box>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 420 }}>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth disabled={loading} />
        <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth disabled={loading} />
        <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress color="inherit" size={16} /> : undefined}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>
      <Button type="button" onClick={onResetPassword} sx={{ mt: 1 }} disabled={loading}>Esqueci minha senha</Button>
      <Typography sx={{ mt: 2 }}>
        Não tem conta? <Link href="/signup">Cadastre-se</Link>
      </Typography>
    </main>
  );
}