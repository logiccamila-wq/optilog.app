import { Chart } from 'chart.js';
import { TireMonitoring } from '@/app/modules/maintenance/types';

// Simula dados IoT recebidos de sensores ESP32
export function simulateIoTData() {
  return {
    currentPressure: 90 + Math.random() * 20, // 90-110 PSI
    temperature: 30 + Math.random() * 50, // 30-80°C
    treadDepth: 3 + Math.random() * 7, // 3-10mm
    rotations: Math.floor(Math.random() * 1000000),
    lastUpdate: new Date()
  };
}

// Dados de exemplo
export const MOCK_TIRES: TireMonitoring[] = [
  {
    id: '1',
    vehicleId: 'truck-001',
    position: 'FL',
    brand: 'Michelin',
    model: 'X Multi Energy',
    serialNumber: 'MCH2023FL001',
    installationDate: new Date(2023, 0, 1),
    treadDepth: 8,
    pressureLimits: { min: 95, max: 105 },
    history: [
      {
        date: new Date(2023, 0, 1),
        event: 'installation',
        description: 'Instalação inicial',
        performedBy: 'João Silva'
      }
    ]
  },
  {
    id: '2',
    vehicleId: 'truck-001',
    position: 'FR',
    brand: 'Michelin',
    model: 'X Multi Energy',
    serialNumber: 'MCH2023FR001',
    installationDate: new Date(2023, 0, 1),
    treadDepth: 7.5,
    pressureLimits: { min: 95, max: 105 },
    history: [
      {
        date: new Date(2023, 0, 1),
        event: 'installation',
        description: 'Instalação inicial',
        performedBy: 'João Silva'
      }
    ]
  },
  {
    id: '3',
    vehicleId: 'truck-001',
    position: 'RL',
    brand: 'Bridgestone',
    model: 'R268 Ecopia',
    serialNumber: 'BDG2023RL001',
    installationDate: new Date(2023, 0, 1),
    treadDepth: 6.5,
    pressureLimits: { min: 95, max: 105 },
    history: [
      {
        date: new Date(2023, 0, 1),
        event: 'installation',
        description: 'Instalação inicial',
        performedBy: 'João Silva'
      }
    ]
  },
  {
    id: '4',
    vehicleId: 'truck-001',
    position: 'RR',
    brand: 'Bridgestone',
    model: 'R268 Ecopia',
    serialNumber: 'BDG2023RR001',
    installationDate: new Date(2023, 0, 1),
    treadDepth: 6.8,
    pressureLimits: { min: 95, max: 105 },
    history: [
      {
        date: new Date(2023, 0, 1),
        event: 'installation',
        description: 'Instalação inicial',
        performedBy: 'João Silva'
      }
    ]
  }
];