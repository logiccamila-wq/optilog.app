'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error para monitoramento
    console.error('Page error:', error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" color="error" gutterBottom fontWeight={700}>
          Algo deu errado!
        </Typography>
        
        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Erro detectado:
          </Typography>
          <Typography variant="body2">
            {error.message || 'Erro desconhecido'}
          </Typography>
          {error.digest && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              ID: {error.digest}
            </Typography>
          )}
        </Alert>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a página inicial.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => reset()}
            size="large"
          >
            Tentar novamente
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/')}
            size="large"
          >
            Voltar para Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}