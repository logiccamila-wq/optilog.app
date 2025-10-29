'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { DollarSign, FileText, Receipt, Users, Building } from 'lucide-react';
import Link from 'next/link';

export default function ERPPage() {
  const modules = [
    {
      title: 'Financeiro',
      description: 'Contas a Pagar/Receber, Fluxo de Caixa, DRE',
      icon: DollarSign,
      href: '/erp/financeiro',
      color: '#10b981',
    },
    {
      title: 'Contabilidade',
      description: 'Lançamentos, Plano de Contas, Balancetes',
      icon: FileText,
      href: '/erp/contabilidade',
      color: '#3b82f6',
    },
    {
      title: 'Fiscal',
      description: 'Impostos, Livros Fiscais, SPED',
      icon: Receipt,
      href: '/erp/fiscal',
      color: '#f59e0b',
    },
    {
      title: 'RH',
      description: 'Folha de Pagamento, Férias, Admissão/Demissão',
      icon: Users,
      href: '/erp/rh',
      color: '#8b5cf6',
    },
    {
      title: 'Patrimônio',
      description: 'Gestão de Ativos, Depreciação, Inventário',
      icon: Building,
      href: '/erp/patrimonio',
      color: '#06b6d4',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          📦 ERP - Enterprise Resource Planning
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestão integrada de recursos empresariais seguindo padrões internacionais
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
