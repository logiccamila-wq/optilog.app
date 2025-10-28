'use client';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

export default function FrotaPneusPage() {
  const cards = [
    {
      title: 'Movimentação de Pneus',
      desc: 'Arraste e solte para posicionar pneus nos veículos, controle de vida útil e estoque.',
      href: '/operacoes/pneus',
      cta: 'Abrir Movimentação',
      color: '#0ea5e9',
      emoji: '🛞',
    },
    {
      title: 'Monitoramento & Manutenção',
      desc: 'Acompanhamento de pressão, temperatura, profundidade, histórico e alertas (TPMS).',
      href: '/tire-dashboard',
      cta: 'Abrir Dashboard',
      color: '#10b981',
      emoji: '📈',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🛞 Gestão de Pneus
      </Typography>

      <Grid container spacing={3}>
        {cards.map((c, i) => (
          <Grid key={i} item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <div style={{ fontSize: 28 }}>{c.emoji}</div>
                  <Typography variant="h6">{c.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {c.desc}
                </Typography>
                <Link href={c.href} passHref>
                  <Button variant="contained" sx={{ bgcolor: c.color }}>{c.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
