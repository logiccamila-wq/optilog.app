"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { stackAuth } from '@/lib/stackAuth';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await stackAuth.signUp(formData.email, formData.password, formData.name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <PersonAddOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comece a otimizar sua logística hoje
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome Completo"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            fullWidth
            autoComplete="new-password"
            helperText="Mínimo 8 caracteres"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar Senha"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            fullWidth
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link href="/login" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                Entrar
              </Link>
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
          🔒 Seus dados estão protegidos com criptografia
        </Typography>
      </Paper>
    </Container>
  );
}