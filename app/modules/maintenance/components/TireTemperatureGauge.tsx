'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Chart from 'chart.js/auto';

interface TireTemperatureGaugeProps {
  value: number;
}

export default function TireTemperatureGauge({ value }: TireTemperatureGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Limites e cores para diferentes faixas de temperatura
    const minTemp = 30;  // °C
    const maxTemp = 100; // °C
    const warningThreshold = 70;
    const criticalThreshold = 85;

    let color = '#4caf50'; // verde para temperatura normal
    if (value > criticalThreshold) {
      color = '#f44336'; // vermelho para temperatura crítica
    } else if (value > warningThreshold) {
      color = '#ff9800'; // laranja para temperatura de aviso
    }

    // Configuração do gráfico gauge
    const config = {
      type: 'doughnut' as const,
      data: {
        datasets: [{
          data: [value, maxTemp - value],
          backgroundColor: [color, '#e0e0e0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        circumference: 180,
        rotation: -90,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    };

    // Destrói gráfico existente se houver
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Cria novo gráfico
    chartRef.current = new Chart(canvasRef.current, config);

    // Cleanup ao desmontar
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [value]);

  return (
    <Box>
      <canvas ref={canvasRef} />
      <Box textAlign="center" mt={1}>
        {value}°C
      </Box>
    </Box>
  );
}