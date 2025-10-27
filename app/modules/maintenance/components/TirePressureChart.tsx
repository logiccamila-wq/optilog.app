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
    pressure: number | null;
  }[];
  limits: {
    min: number;
    max: number;
  };
}

export default function TirePressureChart({ data, limits }: Props) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Pressão (PSI)',
        data: data.map(d => d.pressure),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.2
      },
      {
        label: 'Limite Mínimo',
        data: Array(data.length).fill(limits.min),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0
      },
      {
        label: 'Limite Máximo',
        data: Array(data.length).fill(limits.max),
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
        min: Math.floor(limits.min * 0.9),
        max: Math.ceil(limits.max * 1.1)
      }
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}