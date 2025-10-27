'use client';

import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { TireMonitoring } from '../types';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente de mapa para evitar SSR
const TirePositionMap = dynamic(() => import('./TirePositionMap'), { ssr: false });

interface TiresDashboardProps {
  tires: TireMonitoring[];
  onTireClick: (tire: TireMonitoring) => void;
}

export default function TiresDashboard({ tires, onTireClick }: TiresDashboardProps) {
  const [selectedTire, setSelectedTire] = useState<TireMonitoring | null>(null);

  const columns = useMemo(() => [
    { field: 'position', headerName: 'Posição', width: 100 },
    { field: 'brand', headerName: 'Marca', width: 120 },
    { field: 'model', headerName: 'Modelo', width: 120 },
    { 
      field: 'pressure',
      headerName: 'Pressão',
      width: 120,
      valueGetter: (params: any) => params.row.iotData?.currentPressure || 'N/A',
      renderCell: (params: any) => {
        const pressure = params.row.iotData?.currentPressure;
        const min = params.row.pressureLimits.min;
        const max = params.row.pressureLimits.max;
        const color = !pressure ? 'text.secondary' :
          pressure < min || pressure > max ? 'error.main' :
          'success.main';
        
        return (
          <Typography color={color}>
            {pressure ? `${pressure} PSI` : 'N/A'}
          </Typography>
        );
      }
    },
    { 
      field: 'temperature',
      headerName: 'Temperatura',
      width: 120,
      valueGetter: (params: any) => params.row.iotData?.temperature || 'N/A',
      renderCell: (params: any) => {
        const temp = params.row.iotData?.temperature;
        const color = !temp ? 'text.secondary' :
          temp > 70 ? 'error.main' :
          temp > 50 ? 'warning.main' :
          'success.main';
        
        return (
          <Typography color={color}>
            {temp ? `${temp}°C` : 'N/A'}
          </Typography>
        );
      }
    },
    { 
      field: 'treadDepth',
      headerName: 'Profundidade',
      width: 120,
      valueGetter: (params: any) => params.row.iotData?.treadDepth || params.row.treadDepth,
      renderCell: (params: any) => {
        const depth = params.row.iotData?.treadDepth || params.row.treadDepth;
        const color = depth < 3 ? 'error.main' :
          depth < 5 ? 'warning.main' :
          'success.main';
        
        return (
          <Typography color={color}>
            {depth}mm
          </Typography>
        );
      }
    },
  ], []);

  const handleTireSelect = (tire: TireMonitoring) => {
    setSelectedTire(tire);
    onTireClick(tire);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Monitoramento de Pneus
            </Typography>
            <DataGrid
              rows={tires}
              columns={columns}
              onRowClick={(params) => handleTireSelect(params.row as TireMonitoring)}
              autoHeight
              disableRowSelectionOnClick
              getRowClassName={(params) => {
                const tire = params.row as TireMonitoring;
                const pressure = tire.iotData?.currentPressure;
                const temp = tire.iotData?.temperature;
                const depth = tire.iotData?.treadDepth || tire.treadDepth;

                if (!pressure || !temp) return 'warning';
                if (pressure < tire.pressureLimits.min || 
                    pressure > tire.pressureLimits.max ||
                    temp > 70 ||
                    depth < 3) return 'error';
                if (temp > 50 || depth < 5) return 'warning';
                return '';
              }}
            />
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Posicionamento
            </Typography>
            <TirePositionMap 
              tires={tires}
              selectedTire={selectedTire}
              onTireSelect={handleTireSelect}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}