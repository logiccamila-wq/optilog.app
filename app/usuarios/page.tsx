'use client';

import * as React from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import Link from 'next/link';

export default function UsuariosPage() {
  return (
    <main className="container">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Usuários
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Gestão de usuários desativada. Este módulo dependia do Firebase e foi removido.
          Configure um backend próprio de autenticação/usuários para habilitar novamente.
        </Alert>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} href="/login-modern" variant="contained">
            Ir para Login
          </Button>
          <Button component={Link} href="/status" variant="outlined">
            Ver Status
          </Button>
        </Box>
      </Paper>
    </main>
  );
}
