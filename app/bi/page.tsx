'use client';

import { Box, Typography, Grid, Card, CardContent, Paper } from '@mui/material';
import { BarChart, PieChart, TrendingUp, Assessment } from '@mui/icons-material';

export default function BIPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        📊 Business Intelligence
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: '#3b82f6' }} />
                <Typography variant="h6">Análise de Desempenho</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Dashboard interativo com métricas operacionais em tempo real
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PieChart sx={{ mr: 1, color: '#10b981' }} />
                <Typography variant="h6">Relatórios Personalizados</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Crie e salve seus próprios relatórios customizados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: '#f59e0b' }} />
                <Typography variant="h6">Previsões e Tendências</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Análise preditiva baseada em dados históricos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: '#8b5cf6' }} />
                <Typography variant="h6">KPIs Executivos</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Indicadores chave de performance para tomada de decisão
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🚀 Módulo BI em Desenvolvimento
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Estamos construindo uma plataforma completa de Business Intelligence com:
        </Typography>
        <Box component="ul">
          <li>Dashboards interativos e personalizáveis</li>
          <li>Análise de dados em tempo real</li>
          <li>Machine Learning para previsões</li>
          <li>Integração com múltiplas fontes de dados</li>
          <li>Exportação para Excel, PDF e outros formatos</li>
          <li>Alertas automáticos baseados em thresholds</li>
        </Box>
      </Paper>
    </Box>
  );
}
