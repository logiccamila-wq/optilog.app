export interface MaintenanceAsset {
  id: string;
  name: string;
  type: 'vehicle' | 'tire' | 'part';
  status: 'active' | 'inactive' | 'maintenance';
  health: number; // 0-100%
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  iotData?: {
    temperature?: number;
    pressure?: number;
    vibration?: number;
    lastUpdate: Date;
  };
}

export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  type: 'preventive' | 'predictive' | 'corrective';
  status: 'pending' | 'in-progress' | 'completed';
  scheduledDate: Date;
  completedDate?: Date;
  description: string;
  assignedTo?: string;
  parts?: {
    id: string;
    name: string;
    quantity: number;
    cost: number;
  }[];
  totalCost?: number;
}

export interface TireMonitoring {
  id: string;
  vehicleId: string;
  position: string;
  brand: string;
  model: string;
  serialNumber: string;
  installationDate: Date;
  treadDepth: number;
  pressureLimits: {
    min: number;
    max: number;
  };
  iotData?: {
    currentPressure: number;
    temperature: number;
    treadDepth: number;
    rotations: number;
    lastUpdate: Date;
  };
  history: {
    date: Date;
    event: 'installation' | 'rotation' | 'pressure-check' | 'removal';
    description: string;
    performedBy: string;
  }[];
}