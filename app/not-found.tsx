'use client';

import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 6,
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba230 100%)',
          border: '2px solid rgba(102, 126, 234, 0.3)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '8rem' },
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            404
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Página Não Encontrada
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Desculpe, a página que você está procurando não existe ou foi movida.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large" startIcon={<Home size={20} />}>
              Ir para Home
            </Button>
          </Link>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
        </Box>

        <Box sx={{ mt: 6, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Links Úteis
          </Typography>
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Link href="/supergestor" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                📊 Super Gestor - Dashboard Executivo
              </Typography>
            </Link>
            <Link href="/erp" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                📦 ERP - Enterprise Resource Planning
              </Typography>
            </Link>
            <Link href="/tms" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                🚛 TMS - Transport Management
              </Typography>
            </Link>
            <Link href="/configuracoes" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                ⚙️ Configurações
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
