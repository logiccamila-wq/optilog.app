'use client';
import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RouteIcon from '@mui/icons-material/Route';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function TmsPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'tracking',
      icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
      title: 'Rastreamento em Tempo Real',
      description: 'Acompanhe todas as mercadorias e veículos em tempo real',
      benefits: [
        'Visibilidade completa da cadeia logística',
        'Alertas automáticos de eventos',
        'Histórico detalhado de movimentações',
        'Integração com GPS e telemetria',
      ],
    },
    {
      id: 'cargo',
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Controle de Cargas',
      description: 'Gestão completa de cargas e documentação',
      benefits: [
        'Controle de CTe e documentos fiscais',
        'Gestão de romaneios e manifestos',
        'Validação de pesos e capacidades',
        'Conformidade regulatória (ANTT, SEFAZ)',
      ],
    },
    {
      id: 'billing',
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Faturamento Automatizado',
      description: 'Emissão e controle de notas fiscais de frete',
      benefits: [
        'Cálculo automático de fretes',
        'Integração com ERP e contabilidade',
        'Relatórios de receita por cliente/rota',
        'Conciliação de pagamentos',
      ],
    },
    {
      id: 'simulation',
      icon: <RouteIcon sx={{ fontSize: 40 }} />,
      title: 'Simulação de Rotas',
      description: 'Otimização de rotas e cálculo de custos',
      benefits: [
        'Simulador de frete multimodal',
        'Otimização de rotas (menor custo/tempo)',
        'Análise de pedágios e combustível',
        'Cenários what-if para negociação',
      ],
    },
  ];

  const stats = [
    { label: 'Redução de Custos', value: '15-25%', color: 'success' },
    { label: 'Aumento de Eficiência', value: '30-40%', color: 'primary' },
    { label: 'ROI Médio', value: '6-12 meses', color: 'warning' },
    { label: 'Satisfação do Cliente', value: '+35%', color: 'info' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <LocalShippingIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            TMS • Transport Management System
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Planejamento, execução e rastreamento de entregas e fretes
          </Typography>
        </Box>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color={`${stat.color}.main`} sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Funcionalidades */}
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} md={6} key={feature.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selectedFeature === feature.id ? 2 : 0,
                borderColor: 'primary.main',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => setSelectedFeature(feature.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {feature.benefits.map((benefit, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Módulos Integrados */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Módulos Já Implementados no OptiLog
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Chip label="Control Tower - Monitoramento em Tempo Real" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Relatórios de Frete - Simulação e Custos" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Gestão de Veículos - Frota Completa" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Cadastro de Motoristas" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Controle de Manutenções" color="success" sx={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip label="Abastecimentos e Combustível" color="success" sx={{ width: '100%' }} />
          </Grid>
        </Grid>
      </Paper>

      {/* CTA */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<TrendingUpIcon />}
          href="/control-tower"
        >
          Acessar Torre de Controle TMS
        </Button>
      </Box>
    </Container>
  );
}
