'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card } from '@mui/material';
import { TireMonitoring } from '@/app/modules/maintenance/types';
import TiresDashboard from '@/app/modules/maintenance/components/TiresDashboard';
import TireDetails from '@/app/modules/maintenance/components/TireDetails';
import { MOCK_TIRES, simulateIoTData } from '@/app/modules/maintenance/mock-data';

export default function MaintenanceDashboard() {
  const [tires, setTires] = useState<TireMonitoring[]>(MOCK_TIRES);
  const [selectedTire, setSelectedTire] = useState<TireMonitoring | null>(null);

  // Simula atualizações IoT periódicas
  useEffect(() => {
    // Inicializa dados IoT
    setTires(currentTires => 
      currentTires.map(tire => ({
        ...tire,
        iotData: simulateIoTData()
      }))
    );

    const interval = setInterval(() => {
      setTires(currentTires => 
        currentTires.map(tire => ({
          ...tire,
          iotData: simulateIoTData()
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TiresDashboard
          tires={tires}
          onTireClick={setSelectedTire}
        />
      </Grid>

      {selectedTire && (
        <Grid item xs={12}>
          <Card>
            <Box p={3}>
              <TireDetails tire={selectedTire} />
            </Box>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}