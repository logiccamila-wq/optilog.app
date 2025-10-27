'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Chart from 'chart.js/auto';

interface Props {
  pressure: number | undefined;
  temperature: number | undefined;
  treadDepth: number;
  pressureLimits: {
    min: number;
    max: number;
  };
}

export default function TireHealthGauge({ pressure, temperature, treadDepth, pressureLimits }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Calcula o score de saúde (0-100)
    const pressureScore = pressure ? 
      Math.max(0, Math.min(100, 
        100 - Math.abs((pressure - (pressureLimits.min + pressureLimits.max) / 2) / 
        ((pressureLimits.max - pressureLimits.min) / 2)) * 100
      )) : 0;

    const temperatureScore = temperature ?
      Math.max(0, Math.min(100,
        temperature > 70 ? 0 :
        temperature > 50 ? 50 :
        100
      )) : 0;

    const treadScore = Math.max(0, Math.min(100,
      treadDepth < 3 ? 0 :
      treadDepth < 5 ? 50 :
      100
    ));

    // Média ponderada dos scores
    const overallScore = pressureScore * 0.4 + temperatureScore * 0.3 + treadScore * 0.3;

    // Configuração do gauge
    const data = {
      datasets: [{
        data: [overallScore, 100 - overallScore],
        backgroundColor: [
          overallScore > 70 ? '#4caf50' :
          overallScore > 40 ? '#ff9800' :
          '#f44336',
          '#e0e0e0'
        ],
        circumference: 180,
        rotation: 270,
      }]
    };

    const config = {
      type: 'doughnut' as const,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        cutout: '80%',
      }
    };

    // Cria ou atualiza o gráfico
    if (chartRef.current) {
      chartRef.current.data = data;
      chartRef.current.update();
    } else {
      chartRef.current = new Chart(canvasRef.current, config);
    }

    // Adiciona o valor no centro
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = overallScore > 70 ? '#4caf50' :
                     overallScore > 40 ? '#ff9800' :
                     '#f44336';
      ctx.fillText(
        Math.round(overallScore) + '%',
        canvasRef.current.width / 2,
        canvasRef.current.height * 0.6
      );
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [pressure, temperature, treadDepth, pressureLimits]);

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <canvas ref={canvasRef} />
    </Box>
  );
}