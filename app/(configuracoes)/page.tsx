'use client';

import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Building, Users, Globe, Accessibility, Bell, Plug } from 'lucide-react';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  const modules = [
    {
      title: 'Empresa',
      description: 'Dados cadastrais e configurações gerais',
      icon: Building,
      href: '/configuracoes/empresa',
      color: '#3b82f6',
    },
    {
      title: 'Usuários e Permissões',
      description: 'Gestão de usuários e controle de acesso (RBAC)',
      icon: Users,
      href: '/configuracoes/usuarios',
      color: '#8b5cf6',
    },
    {
      title: 'Idiomas',
      description: 'Configuração de idioma (PT-BR, EN-US, ES-ES)',
      icon: Globe,
      href: '/configuracoes/idiomas',
      color: '#10b981',
    },
    {
      title: 'Acessibilidade',
      description: 'Ajustes de acessibilidade (WCAG 2.1 AA)',
      icon: Accessibility,
      href: '/configuracoes/acessibilidade',
      color: '#f59e0b',
    },
    {
      title: 'Notificações',
      description: 'Central de notificações e alertas',
      icon: Bell,
      href: '/configuracoes/notificacoes',
      color: '#ef4444',
    },
    {
      title: 'Integrações',
      description: 'APIs, Notion, n8n, Zoho, Google Maps',
      icon: Plug,
      href: '/configuracoes/integracoes',
      color: '#06b6d4',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          ⚙️ Configurações
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure o sistema de acordo com as necessidades da sua empresa
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
