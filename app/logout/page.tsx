'use client';
import { useEffect, useState } from 'react';
import { Typography, Alert, Paper, CircularProgress, Box } from '@mui/material';

export default function LogoutPage() {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        // Chama API para limpar o cookie JWT
        await fetch('/api/auth/logout', { method: 'POST' });
        // Limpa qualquer estado local remanescente
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        } catch {
          // ignore localStorage errors (e.g., SSR or disabled storage)
        }
      } catch (e: any) {
        setError(e?.message || 'Falha ao sair');
      } finally {
        setProcessing(false);
        window.location.href = '/login';
      }
    };
    run();
  }, []);

  return (
    <main className="container">
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {processing && <CircularProgress size={18} />}
          <Typography variant="h6">Saindo...</Typography>
        </Box>
        {error && (
          <Box aria-live="polite" sx={{ mt: 1 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Paper>
    </main>
  );
}