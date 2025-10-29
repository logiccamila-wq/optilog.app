'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Truck, Map, Navigation, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function TMSPage() {
  const modules = [
    {
      title: 'Viagens',
      description: 'Gestão completa de viagens e rotas',
      icon: Truck,
      href: '/tms/viagens',
      color: '#10b981',
    },
    {
      title: 'Roteirização',
      description: 'Otimização de rotas e planejamento',
      icon: Navigation,
      href: '/tms/roteirizacao',
      color: '#3b82f6',
    },
    {
      title: 'Rastreamento',
      description: 'Monitoramento em tempo real',
      icon: Map,
      href: '/tms/rastreamento',
      color: '#f59e0b',
    },
    {
      title: 'Performance',
      description: 'KPIs e indicadores de desempenho',
      icon: TrendingUp,
      href: '/tms/performance',
      color: '#8b5cf6',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          🚛 TMS - Transport Management System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema completo de gestão de transportes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link href={module.href} style={{ textDecoration: 'none' }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `2px solid ${module.color}40`,
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${module.color}30`,
                    borderColor: module.color,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: `${module.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <module.icon size={28} style={{ color: module.color }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
