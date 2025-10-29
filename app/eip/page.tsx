'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Plug, Webhook, BookOpen, Mail, Map } from 'lucide-react';

export default function EIPPage() {
  const modules = [
    {
      title: 'APIs',
      description: 'Gestão de APIs e endpoints',
      icon: Plug,
      color: '#10b981',
      status: 'Em breve',
    },
    {
      title: 'Webhooks',
      description: 'Configuração de webhooks',
      icon: Webhook,
      color: '#3b82f6',
      status: 'Em breve',
    },
    {
      title: 'n8n',
      description: 'Automação de workflows',
      icon: Plug,
      color: '#ea4b71',
      status: 'Planejado',
    },
    {
      title: 'Notion',
      description: 'Sincronização com Notion',
      icon: BookOpen,
      color: '#000000',
      status: 'Planejado',
    },
    {
      title: 'Zoho Mail',
      description: 'Integração de email',
      icon: Mail,
      color: '#e42527',
      status: 'Planejado',
    },
    {
      title: 'Google Maps',
      description: 'Serviços de geolocalização',
      icon: Map,
      color: '#4285f4',
      status: 'Ativo',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          🔌 EIP - Enterprise Integration Platform
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Plataforma de integração empresarial
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
                opacity: module.status === 'Ativo' ? 1 : 0.7,
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
              <Typography
                variant="caption"
                color={module.status === 'Ativo' ? 'success.main' : 'warning.main'}
                sx={{ fontWeight: 600 }}
              >
                {module.status}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
