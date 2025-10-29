'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email, CheckCircle, Send } from '@mui/icons-material';
import { BRANDING } from '@/config/branding';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call API to send verification email
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar email de verificação');
      }

      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de verificação');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmed = () => {
    // Mark email as verified in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailVerified', 'true');
    }
    // Redirect to force password change
    router.push('/force-password');
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
            <Email fontSize="large" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Verificação de E-mail
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Confirme seu endereço de e-mail para continuar
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {emailSent && (
          <Alert severity="success" sx={{ mb: 3 }}>
            E-mail de verificação enviado! Verifique sua caixa de entrada.
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
            <Typography variant="body1" sx={{ mb: 2 }}>
              Para garantir a segurança da sua conta, precisamos verificar seu endereço de e-mail.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Clique no botão abaixo para enviar um link de verificação para seu e-mail.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Após receber o e-mail, clique no link de confirmação e depois volte aqui para continuar.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSendVerification}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            {loading ? 'Enviando...' : emailSent ? 'Reenviar Verificação' : 'Enviar Verificação'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleConfirmed}
            startIcon={<CheckCircle />}
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            Já confirmei meu e-mail
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Não recebeu o e-mail? Verifique sua pasta de spam ou clique em "Reenviar Verificação"
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
