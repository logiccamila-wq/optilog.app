'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { AttachMoney, TrendingUp, AccountBalance, Receipt } from '@mui/icons-material';

export default function FinancePage() {
  const cards = [
    { title: 'Receitas', value: 'R$ 125.430,00', icon: <AttachMoney />, color: '#10b981' },
    { title: 'Despesas', value: 'R$ 87.250,00', icon: <Receipt />, color: '#ef4444' },
    { title: 'Lucro', value: 'R$ 38.180,00', icon: <TrendingUp />, color: '#3b82f6' },
    { title: 'Saldo', value: 'R$ 52.890,00', icon: <AccountBalance />, color: '#8b5cf6' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        💰 Financeiro
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: card.color, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📊 Resumo Financeiro
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Módulo financeiro em desenvolvimento. Em breve você terá acesso a:
        </Typography>
        <Box component="ul" sx={{ mt: 2 }}>
          <li>Faturamento detalhado por cliente</li>
          <li>Controle de despesas operacionais</li>
          <li>Conciliação bancária</li>
          <li>Relatórios de fluxo de caixa</li>
          <li>Análise de rentabilidade por rota</li>
          <li>Integração com sistemas contábeis</li>
        </Box>
      </Card>
    </Box>
  );
}
