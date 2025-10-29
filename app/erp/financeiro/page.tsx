'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function FinanceiroPage() {
  const modules = [
    {
      title: 'Contas a Pagar',
      description: 'Gestão de fornecedores e pagamentos',
      icon: TrendingDown,
      href: '/erp/financeiro/contas-pagar',
      color: '#ef4444',
    },
    {
      title: 'Contas a Receber',
      description: 'Gestão de clientes e recebimentos',
      icon: TrendingUp,
      href: '/erp/financeiro/contas-receber',
      color: '#10b981',
    },
    {
      title: 'Fluxo de Caixa',
      description: 'Previsão e acompanhamento de caixa',
      icon: DollarSign,
      href: '/erp/financeiro/fluxo-caixa',
      color: '#3b82f6',
    },
    {
      title: 'Conciliação Bancária',
      description: 'Integração com extratos bancários',
      icon: Building2,
      href: '/erp/financeiro/conciliacao-bancaria',
      color: '#8b5cf6',
    },
    {
      title: 'DRE',
      description: 'Demonstração do Resultado do Exercício',
      icon: CreditCard,
      href: '/erp/financeiro/dre',
      color: '#f59e0b',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          💰 Financeiro
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestão completa do financeiro da empresa
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
