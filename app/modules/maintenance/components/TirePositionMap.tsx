'use client';

import { Box } from '@mui/material';
import { TireMonitoring } from '../types';
import dynamic from 'next/dynamic';

interface Props {
  tires: TireMonitoring[];
  selectedTire?: TireMonitoring | null;
  onTireSelect: (tire: TireMonitoring) => void;
}

export default function TirePositionMap({ tires, selectedTire, onTireSelect }: Props) {
  return (
    <Box 
      sx={{ 
        height: 400,
        position: 'relative',
        background: '#f5f5f5',
        borderRadius: 1,
        p: 2 
      }}
    >
      {tires.map((tire) => {
        const isSelected = selectedTire?.id === tire.id;
        const position = getPositionCoordinates(tire.position);
        const health = calculateTireHealth(tire);
        
        return (
          <Box
            key={tire.id}
            sx={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: getTireHealthColor(health),
              border: isSelected ? '3px solid #1976d2' : '1px solid #666',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 2
              }
            }}
            onClick={() => onTireSelect(tire)}
          />
        );
      })}
    </Box>
  );
}

function getPositionCoordinates(position: string) {
  // Mapeamento de posições para coordenadas x,y (em %)
  const positions: Record<string, { x: string, y: string }> = {
    'FL': { x: '20%', y: '20%' },
    'FR': { x: '80%', y: '20%' },
    'RL': { x: '20%', y: '60%' },
    'RR': { x: '80%', y: '60%' },
    'SL': { x: '20%', y: '80%' },
    'SR': { x: '80%', y: '80%' }
  };

  return positions[position] || { x: '50%', y: '50%' };
}

function calculateTireHealth(tire: TireMonitoring) {
  const { iotData, pressureLimits } = tire;
  
  if (!iotData) return 0;

  const pressureScore = iotData.currentPressure >= pressureLimits.min && 
                       iotData.currentPressure <= pressureLimits.max ? 100 : 0;
  
  const tempScore = iotData.temperature > 70 ? 0 :
                   iotData.temperature > 50 ? 50 : 100;
  
  const depthScore = iotData.treadDepth < 3 ? 0 :
                     iotData.treadDepth < 5 ? 50 : 100;

  return (pressureScore + tempScore + depthScore) / 3;
}

function getTireHealthColor(health: number) {
  if (health > 70) return '#4caf50';
  if (health > 40) return '#ff9800';
  return '#f44336';
}