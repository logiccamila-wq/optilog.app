'use client';

import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import {
  LocalShipping,
  DirectionsCar,
  AttachMoney,
  Assessment,
  TrendingUp,
  Build
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const stats = [
    { label: 'Viagens Ativas', value: '12', icon: <LocalShipping />, color: '#1976d2', path: '/motorista' },
    { label: 'Veículos Ativos', value: '45', icon: <DirectionsCar />, color: '#2e7d32', path: '/frota' },
    { label: 'Receita Mês', value: 'R$ 245k', icon: <AttachMoney />, color: '#ed6c02', path: '/dashboard/financeiro' },
    { label: 'OS Pendentes', value: '8', icon: <Build />, color: '#9c27b0', path: '/service-orders' },
    { label: 'Eficiência', value: '94%', icon: <TrendingUp />, color: '#0288d1', path: '/bi' },
    { label: 'Manutenções', value: '5', icon: <Build />, color: '#d32f2f', path: '/frota/manutencoes' }
  ];

  const quickActions = [
    { label: 'Nova Viagem', path: '/motorista', icon: <LocalShipping /> },
    { label: 'Nova OS', path: '/service-orders', icon: <Build /> },
    { label: 'Torre de Controle', path: '/control-tower', icon: <Assessment /> },
    { label: 'Relatórios', path: '/relatorios/capacidade', icon: <Assessment /> }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Visão geral do sistema OptiLog TMS
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.label}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
              }}
              onClick={() => router.push(stat.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: `${stat.color}20`, p: 1.5, borderRadius: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 32, color: stat.color } })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Ações Rápidas
      </Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.label}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={action.icon}
              onClick={() => router.push(action.path)}
              sx={{ py: 2 }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
