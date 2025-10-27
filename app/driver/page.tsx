'use client';
import { Box, Typography, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import {  LocalShipping, CheckCircle, Route, Description, LocalGasStation } from '@mui/icons-material';
import Link from 'next/link';

export default function DriverAppPage() {
  const features = [
    {
      icon: <LocalGasStation sx={{ fontSize: 40, color: '#3b82f6' }} />,
      title: 'Abastecimento',
      description: 'Registrar abastecimentos com foto do recibo',
      status: 'Em desenvolvimento'
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />,
      title: 'Checklist',
      description: 'Início/fim de turno e condições do veículo',
      status: 'Em desenvolvimento'
    },
    {
      icon: <Route sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'Rotas',
      description: 'Ver paradas do dia e status de entrega',
      status: 'Em desenvolvimento'
    },
    {
      icon: <Description sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: 'Documentos',
      description: 'CNH/CRLV e comprovantes em nuvem',
      status: 'Em desenvolvimento'
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <LocalShipping sx={{ mr: 2, fontSize: 36 }} />
          App do Motorista
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Versão web de validação. Funcionalidades previstas para aplicativo móvel.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#f59e0b',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem'
                    }}
                  >
                    {feature.status}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3, bgcolor: '#eff6ff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ℹ️ Informação
        </Typography>
        <Typography variant="body1" paragraph>
          Por enquanto, você pode usar os módulos do Dashboard para simular operações:
        </Typography>
        <Link href="/dashboard" passHref>
          <Button variant="contained" color="primary">
            Ir para Dashboard
          </Button>
        </Link>
      </Paper>
    </Box>
  );
}
