"use client";

import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import TimelineIcon from '@mui/icons-material/Timeline';

const featureCards = [
  {
    title: 'TMS inteligente',
    description: 'Planejamento dinâmico de rotas, com rastreamento em tempo real e alertas de SLA.',
    icon: <LocalShippingIcon fontSize="large" />,
    href: '/dashboard',
  },
  {
    title: 'BI imediato',
    description: 'Dashboards com IA para detectar gargalos e antecipar decisões financeiras críticas.',
    icon: <QueryStatsIcon fontSize="large" />,
    href: '/ai',
  },
  {
    title: 'Experiência do motorista',
    description: 'Aplicativo focado em motorista com checklists, prova de entrega e suporte offline.',
    icon: <VolunteerActivismIcon fontSize="large" />,
    href: '/driver',
  },
];

const workflowSteps = [
  {
    title: 'Conecte sua operação',
    text: 'Integre ERPs, sensores de frota e Stack Auth em minutos. Não é necessário reescrever o legado.',
  },
  {
    title: 'Automatize decisões',
    text: 'Configure workflows com alertas e tarefas automáticas para logística, finanças e conformidade.',
  },
  {
    title: 'Amplie com IA',
    text: 'Use modelos generativos para priorizar entregas, sugerir renegociações e medir satisfação do cliente.',
  },
];

export default function HomePage() {
  return (
    <main>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={{ xs: 6, md: 10 }}>
          <Box
            sx={{
              borderRadius: 5,
              p: { xs: 4, md: 6 },
              background: 'linear-gradient(135deg, rgba(14,83,154,0.95), rgba(18,18,30,0.85))',
              boxShadow: '0 24px 48px rgba(8,15,35,0.45)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Chip
              label="Nova geração de logística assistida por IA"
              color="primary"
              sx={{ fontWeight: 600, mb: 2, bgcolor: 'rgba(255,255,255,0.15)' }}
            />
            <Typography
              component="h1"
              variant="h3"
              sx={{ fontWeight: 700, maxWidth: 540, lineHeight: 1.1, mb: 3 }}
            >
              Operações logísticas conectadas, previsíveis e personalizadas.
            </Typography>
            <Typography sx={{ maxWidth: 580, color: 'rgba(255,255,255,0.75)', mb: 4 }}>
              O Optilog centraliza frotas, indicadores financeiros e times em uma única plataforma. IA embarcada
              aponta riscos antes que eles aconteçam e automatiza rotinas de compliance e atendimento.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="large"
                color="secondary"
                sx={{ px: 4, py: 1.5, fontWeight: 600 }}
              >
                Criar conta agora
              </Button>
              <Button
                component={Link}
                href="/driver"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{ px: 4, py: 1.5, borderColor: 'rgba(255,255,255,0.35)', color: 'white' }}
              >
                Experimente o app do motorista
              </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mt: { xs: 4, md: 6 } }}>
              {[
                { label: '96% SLA de entregas', detail: 'com rota dinâmica e telemetria em tempo real.' },
                { label: '15% menos custo', detail: 'na última milha após 3 ciclos de otimização.' },
                { label: '24h onboarding', detail: 'integração completa com ERPs e Stack Auth.' },
              ].map((stat) => (
                <Grid item xs={12} sm={4} key={stat.label}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(13,18,36,0.55)',
                      borderRadius: 3,
                      p: 3,
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.label}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.6)' }}>
                      {stat.detail}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Mapeie toda a operação em minutos
            </Typography>
            <Grid container spacing={3}>
              {featureCards.map((feature) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      bgcolor: 'rgba(17,23,40,0.9)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 18px 35px rgba(9,16,35,0.45)',
                      },
                    }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ color: 'primary.light' }}>{feature.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                        {feature.description}
                      </Typography>
                      <Button
                        component={Link}
                        href={feature.href}
                        variant="text"
                        color="secondary"
                        sx={{ alignSelf: 'flex-start', mt: 1 }}
                        endIcon={<TimelineIcon />}
                      >
                        Ver detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Como a Optilog transforma dados em decisões
            </Typography>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />
            <Grid container spacing={3}>
              {workflowSteps.map((step, index) => (
                <Grid item xs={12} md={4} key={step.title}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      bgcolor: 'rgba(13,17,27,0.85)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      p: 3,
                    }}
                  >
                    <Typography variant="overline" sx={{ color: 'primary.light', letterSpacing: 1.2 }}>
                      Etapa {index + 1}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                      {step.text}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </main>
  );
}
