'use client';

import { Box } from '@mui/material';
import { Timeline } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
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
    event: 'installation' | 'rotation' | 'pressure-check' | 'removal';
    description: string;
    performedBy: string;
  }[];
}

export default function TireRotationChart({ data }: Props) {
  // Filtra apenas eventos de rotação e instalação
  const rotationData = data.filter(d => 
    d.event === 'rotation' || d.event === 'installation' || d.event === 'removal'
  );

  const chartData = {
    labels: rotationData.map(d => new Date(d.date)),
    datasets: [
      {
        label: 'Eventos',
        data: rotationData.map((d, i) => ({
          x: new Date(d.date),
          y: 1,
          label: `${d.event.toUpperCase()}: ${d.description}\nResponsável: ${d.performedBy}`
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: rotationData.map(d => 
          d.event === 'installation' ? 'rgba(75, 192, 192, 0.5)' :
          d.event === 'rotation' ? 'rgba(255, 206, 86, 0.5)' :
          'rgba(255, 99, 132, 0.5)'
        ),
        pointStyle: rotationData.map(d => 
          d.event === 'installation' ? 'circle' :
          d.event === 'rotation' ? 'triangle' :
          'crossRot'
        ),
        pointRadius: 10
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataPoint = rotationData[context.dataIndex];
            return [
              `Evento: ${dataPoint.event}`,
              `Descrição: ${dataPoint.description}`,
              `Responsável: ${dataPoint.performedBy}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const
        },
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        display: false,
        min: 0,
        max: 2
      }
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}