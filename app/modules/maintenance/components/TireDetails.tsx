'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { TireMonitoring } from '../types';
import dynamic from 'next/dynamic';

// Importação dinâmica dos componentes que usam Canvas/SVG
const TireHealthGauge = dynamic(() => import('./TireHealthGauge'), { ssr: false });
const TirePressureChart = dynamic(() => import('./TirePressureChart'), { ssr: false });
const TireTemperatureChart = dynamic(() => import('./TireTemperatureChart'), { ssr: false });
const TireRotationChart = dynamic(() => import('./TireRotationChart'), { ssr: false });

interface TireDetailsProps {
  tire: TireMonitoring;
}

export default function TireDetails({ tire }: TireDetailsProps) {
  const { iotData, pressureLimits } = tire;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Detalhes do Pneu - Posição {tire.position}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informações Gerais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Marca
                </Typography>
                <Typography variant="body1">
                  {tire.brand}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Modelo
                </Typography>
                <Typography variant="body1">
                  {tire.model}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Número de Série
                </Typography>
                <Typography variant="body1">
                  {tire.serialNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Data de Instalação
                </Typography>
                <Typography variant="body1">
                  {new Date(tire.installationDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Saúde do Pneu
            </Typography>
            <Box sx={{ height: 200 }}>
              <TireHealthGauge
                pressure={iotData?.currentPressure}
                temperature={iotData?.temperature}
                treadDepth={iotData?.treadDepth || tire.treadDepth}
                pressureLimits={pressureLimits}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pressão ao Longo do Tempo
            </Typography>
            <Box sx={{ height: 300 }}>
              <TirePressureChart
                data={tire.history.map(h => ({
                  date: h.date,
                  pressure: h.event === 'pressure-check' ? 
                    parseFloat(h.description.split(':')[1]) : null
                }))}
                limits={pressureLimits}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Temperatura ao Longo do Tempo
            </Typography>
            <Box sx={{ height: 300 }}>
              <TireTemperatureChart
                data={tire.history.map(h => ({
                  date: h.date,
                  temperature: h.event === 'pressure-check' ? 
                    parseFloat(h.description.split(':')[2]) : null
                }))}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Rotações
            </Typography>
            <Box sx={{ height: 400 }}>
              <TireRotationChart data={tire.history} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}