'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Wrench, CircleDot, Building2, Users, Package } from 'lucide-react';
import Link from 'next/link';

export default function TPMAPage() {
  const modules = [
    {
      title: 'Manutenção',
      description: 'Preventiva, Corretiva e Preditiva',
      icon: Wrench,
      href: '/tpma/manutencao',
      color: '#ef4444',
    },
    {
      title: 'Pneus',
      description: 'Gestão visual com IoT (ESP32)',
      icon: CircleDot,
      href: '/tpma/pneus',
      color: '#10b981',
    },
    {
      title: 'Oficinas',
      description: 'Gestão de oficinas e serviços',
      icon: Building2,
      href: '/tpma/oficinas',
      color: '#3b82f6',
    },
    {
      title: 'Mecânicos',
      description: 'Controle de equipe técnica',
      icon: Users,
      href: '/tpma/mecanicos',
      color: '#8b5cf6',
    },
    {
      title: 'Almoxarifado',
      description: 'Estoque de peças e componentes',
      icon: Package,
      href: '/tpma/almoxarifado',
      color: '#f59e0b',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          🔧 TPMA - Transport Planning & Maintenance Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Planejamento e análise de manutenção de frotas
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
