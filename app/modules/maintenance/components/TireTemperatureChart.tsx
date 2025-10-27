'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: {
    date: Date;
    temperature: number | null;
  }[];
}

export default function TireTemperatureChart({ data }: Props) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: data.map(d => d.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.2
      },
      {
        label: 'Limite de Alerta',
        data: Array(data.length).fill(50),
        borderColor: 'rgba(255, 206, 86, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0
      },
      {
        label: 'Limite Crítico',
        data: Array(data.length).fill(70),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}