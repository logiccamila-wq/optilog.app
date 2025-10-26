"use client";
import { useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // opcional: log para observabilidade
    // console.error(error);
  }, [error]);

  return (
    <main className="container">
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Algo deu errado</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error?.message || 'Erro inesperado.'}
        </Typography>
        <Box>
          <Button variant="contained" onClick={reset}>Tentar novamente</Button>
        </Box>
      </Paper>
    </main>
  );
}