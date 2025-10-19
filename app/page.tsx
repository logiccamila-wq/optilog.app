'use client';

import { Typography, Button, Box, Paper, Grid, Chip } from '@mui/material';
import Link from 'next/link';
import Card from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="container">
      {/* Hero */}
      <Paper sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(180deg, rgba(14,83,154,0.08), rgba(14,83,154,0.03))' }} variant="outlined">
        <Chip label="Powered by TRAE • Next 14" sx={{ mb: 2, color: '#9ecfff', borderColor: '#1e3a8a' }} variant="outlined" />
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 800 }}>
          A melhor startup — recursos modernos para operações
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Plataforma unificada com módulos WMS, TMS, OMS, SCM, CRM e ERP — neon/tech, segura e escalável.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/signup" variant="contained" color="primary" size="large">
            Começar agora
          </Button>
          <Button component={Link} href="/resources" variant="outlined" color="secondary" size="large">
            Explorar recursos
          </Button>
          <Button component={Link} href="/dashboard" variant="outlined" color="primary" size="large">
            Ver dashboard
          </Button>
        </Box>
      </Paper>

      {/* Quick Apps */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
        <Button component={Link} href="/driver" variant="text" color="primary" size="medium">
          App do Motorista
        </Button>
        <Button component={Link} href="/admin" variant="text" color="primary" size="medium">
          Área Admin
        </Button>
        <Button component={Link} href="/modules" variant="text" color="primary" size="medium">
          Módulos
        </Button>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {[
          { title: 'WMS', description: 'Inventário, recebimento, expedição, transferências.', href: '/modules/wms' },
          { title: 'TMS', description: 'Rastreamento, cargas, faturamento, simulações de rotas.', href: '/modules/tms' },
          { title: 'OMS', description: 'Pedidos, multicanal, tempo real e centralização.', href: '/modules/oms' },
          { title: 'SCM', description: 'Compras, inventários, PDV, exportações e distribuição.', href: '/modules/scm' },
          { title: 'CRM', description: 'Atendimento, análise de dados, campanhas e tarefas.', href: '/modules/crm' },
          { title: 'ERP', description: 'Financeiro, produção, RH, relatórios e ativos.', href: '/modules/erp' },
        ].map((f) => (
          <Grid key={f.title} item xs={12} sm={6} md={4}>
            <Link href={f.href} style={{ textDecoration: 'none' }}>
              <Card title={f.title} description={f.description} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </main>
  );
}
