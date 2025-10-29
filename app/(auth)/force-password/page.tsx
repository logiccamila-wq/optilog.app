'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Lock, CheckCircle, Cancel } from '@mui/icons-material';
import { BRANDING } from '@/config/branding';

export default function ForcePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError('Por favor, atenda todos os requisitos de senha');
      return;
    }

    setLoading(true);

    try {
      // Call API to change password
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar senha');
      }

      // Mark password as updated
      if (typeof window !== 'undefined') {
        localStorage.setItem('passwordUpdated', 'true');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Lock fontSize="large" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Atualize sua Senha
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Por segurança, crie uma nova senha forte
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            mb: 3,
          }}
        >
          <CardContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Sua senha deve atender aos seguintes requisitos:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {hasMinLength ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Mínimo de 8 caracteres"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: hasMinLength ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {hasUpperCase ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Pelo menos uma letra maiúscula"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: hasUpperCase ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {hasLowerCase ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Pelo menos uma letra minúscula"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: hasLowerCase ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {hasNumber ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Pelo menos um número"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: hasNumber ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {passwordsMatch ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="As senhas devem coincidir"
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: passwordsMatch ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
            autoComplete="new-password"
          />
          <TextField
            label="Confirmar Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isValid || loading}
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {loading ? 'Atualizando...' : 'Atualizar Senha'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ao atualizar sua senha, você será redirecionado para o painel de controle
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
