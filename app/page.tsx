"use client";

import { Typography, Button, Box, Paper } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <Paper sx={{ p: 4, textAlign: 'center' }} variant="outlined">
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Bem-vindo à Plataforma OptiLog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sua solução completa para gestão de logística, frotas e finanças.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={Link} href="/driver" variant="contained" color="primary" size="large">
            App do Motorista
          </Button>
          <Button component={Link} href="/signup" variant="outlined" color="secondary" size="large">
            Acessar Plataforma
          </Button>
        </Paper>
      </Paper>
    </main>
  );
}
