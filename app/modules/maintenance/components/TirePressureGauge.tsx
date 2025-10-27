'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Chart from 'chart.js/auto';

interface TirePressureGaugeProps {
  value: number;
}

export default function TirePressureGauge({ value }: TirePressureGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Limites e cores para diferentes faixas de pressão
    const minPressure = 80;  // psi
    const maxPressure = 120; // psi
    const warningThreshold = 90;
    const criticalThreshold = 110;

    let color = '#4caf50'; // verde para pressão normal
    if (value < warningThreshold || value > criticalThreshold) {
      color = '#f44336'; // vermelho para pressão crítica
    } else if (value < minPressure || value > maxPressure) {
      color = '#ff9800'; // laranja para pressão de aviso
    }

    // Configuração do gráfico gauge
    const config = {
      type: 'doughnut' as const,
      data: {
        datasets: [{
          data: [value, maxPressure - value],
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
        {value} psi
      </Box>
    </Box>
  );
}