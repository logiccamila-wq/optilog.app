'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Factory, ShoppingCart, FileSignature } from 'lucide-react';

export default function SCMPage() {
  const modules = [
    {
      title: 'Fornecedores',
      description: 'Cadastro e gestão de fornecedores',
      icon: Factory,
      color: '#10b981',
      status: 'Em breve',
    },
    {
      title: 'Compras',
      description: 'Solicitações e pedidos de compra',
      icon: ShoppingCart,
      color: '#3b82f6',
      status: 'Em breve',
    },
    {
      title: 'Contratos',
      description: 'Gestão de contratos e acordos',
      icon: FileSignature,
      color: '#f59e0b',
      status: 'Em breve',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          🔗 SCM - Supply Chain Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema de gestão da cadeia de suprimentos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                border: `2px solid ${module.color}40`,
                height: '100%',
                opacity: 0.7,
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {module.description}
              </Typography>
              <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                {module.status}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
