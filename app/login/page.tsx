"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { stackAuth } from '@/lib/stackAuth';
import { Box, TextField, Button, Typography, Alert, Paper, CircularProgress, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('🔐 Iniciando login para:', email);
    setLoading(true);
    try {
      console.log('⏳ Chamando stackAuth.signIn...');
      const user = await stackAuth.signIn(email, password);
      console.log('✅ Login bem-sucedido:', user);
      console.log('🚀 Redirecionando para /dashboard...');
      router.push('/dashboard');
      console.log('✅ router.push chamado');
    } catch (err: any) {
      console.error('❌ Erro no login:', err);
      setError(err.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
      console.log('🏁 Loading finalizado');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          bgcolor: 'rgba(17,23,40,0.9)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Entrar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Acesse sua conta Optilog
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            disabled={loading}
            autoComplete="email"
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
            startIcon={loading ? <CircularProgress color="inherit" size={20} /> : undefined}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Não tem conta?{' '}
            <Link href="/signup" style={{ color: '#64B5F6', textDecoration: 'none', fontWeight: 600 }}>
              Cadastre-se
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <LockOutlinedIcon fontSize="small" />
            Dados protegidos com criptografia
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
