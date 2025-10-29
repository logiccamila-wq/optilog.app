'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import {
  TrendingUp,
  DollarSign,
  Truck,
  Package,
  Users,
  AlertTriangle,
} from 'lucide-react';

export default function SuperGestorDashboard() {
  const kpis = [
    { title: 'Receita Total', value: 'R$ 2.5M', change: '+12.5%', icon: DollarSign, color: '#10b981' },
    { title: 'Viagens Ativas', value: '45', change: '+8%', icon: Truck, color: '#3b82f6' },
    { title: 'Pedidos', value: '234', change: '+15%', icon: Package, color: '#8b5cf6' },
    { title: 'Colaboradores', value: '87', change: '+3', icon: Users, color: '#f59e0b' },
    { title: 'Alertas', value: '12', change: '-5', icon: AlertTriangle, color: '#ef4444' },
    { title: 'Performance', value: '94%', change: '+2%', icon: TrendingUp, color: '#06b6d4' },
  ];

  const modules = [
    { name: 'ERP', description: 'Financeiro, Contábil, Fiscal, RH, Patrimônio', href: '/erp', color: '#3b82f6' },
    { name: 'TMS', description: 'Transport Management System', href: '/tms', color: '#10b981' },
    { name: 'TPMA', description: 'Manutenção e Pneus', href: '/tpma', color: '#f59e0b' },
    { name: 'OMS', description: 'Order Management System', href: '/oms', color: '#8b5cf6' },
    { name: 'WMS', description: 'Warehouse Management', href: '/wms', color: '#06b6d4' },
    { name: 'SCM', description: 'Supply Chain Management', href: '/scm', color: '#ec4899' },
    { name: 'EIP', description: 'Enterprise Integration Platform', href: '/eip', color: '#6366f1' },
    { name: 'Configurações', description: 'Empresa, Usuários, Integrações', href: '/configuracoes', color: '#64748b' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          📊 Super Gestor - Dashboard Executivo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão consolidada de todos os módulos do sistema OptiLog
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${kpi.color}15 0%, ${kpi.color}30 100%)`,
                border: `1px solid ${kpi.color}40`,
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {kpi.title}
                </Typography>
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {kpi.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: kpi.change.startsWith('+') ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                }}
              >
                {kpi.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Módulos */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Módulos do Sistema
      </Typography>
      <Grid container spacing={2}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: `2px solid ${module.color}40`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${module.color}30`,
                  borderColor: module.color,
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  background: `${module.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: module.color,
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {module.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {module.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
