import { ReactNode } from 'react';

// Tipos compartilhados entre Motorista e Mecânico
export interface VehicleStatus {
  id: string;
  plate: string;
  status: 'available' | 'maintenance' | 'route' | 'breakdown';
  location?: {
    lat: number;
    lng: number;
  };
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  issues?: MaintenanceIssue[];
  currentDriver?: string;
  mileage: number;
  fuelLevel: number;
}

export interface MaintenanceIssue {
  id: string;
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  completedAt?: Date;
  parts?: SparePart[];
}

export interface SparePart {
  id: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
  supplier: string;
  location: string;
  minimumStock: number;
  currentStock: number;
}

export interface TireManagement {
  id: string;
  vehicleId: string;
  position: string;
  brand: string;
  model: string;
  dot: string;
  installationDate: Date;
  currentMileage: number;
  pressure: number;
  temperature: number;
  treadDepth: number;
  rotations: TireRotation[];
  predictedLifespan: number;
  alerts: TireAlert[];
}

export interface TireRotation {
  id: string;
  date: Date;
  fromPosition: string;
  toPosition: string;
  mileage: number;
  reason: string;
}

export interface TireAlert {
  id: string;
  type: 'pressure' | 'temperature' | 'treadDepth' | 'rotation';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: Date;
  acknowledgedAt?: Date;
}

// Interfaces para documentação e financeiro
export interface CTEDocument {
  id: string;
  number: string;
  series: string;
  issuedAt: Date;
  sender: Company;
  receiver: Company;
  value: number;
  weight: number;
  volume: number;
  items: CTEItem[];
  taxes: CTETax[];
  status: 'draft' | 'issued' | 'cancelled' | 'completed';
}

export interface CTEItem {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

export interface CTETax {
  id: string;
  type: string;
  base: number;
  rate: number;
  value: number;
}

export interface Company {
  id: string;
  name: string;
  document: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface BankStatement {
  id: string;
  accountId: string;
  date: Date;
  description: string;
  value: number;
  type: 'credit' | 'debit';
  balance: number;
  category?: string;
  tags?: string[];
  matchedInvoice?: string;
}

// Interfaces para IA/ML
export interface PredictiveMaintenance {
  vehicleId: string;
  prediction: {
    component: string;
    failureProbability: number;
    suggestedAction: string;
    urgency: 'low' | 'medium' | 'high';
    estimatedCost: number;
    confidence: number;
  }[];
  lastUpdated: Date;
}

export interface RouteOptimization {
  routeId: string;
  originalRoute: Location[];
  optimizedRoute: Location[];
  savings: {
    distance: number;
    time: number;
    fuel: number;
    cost: number;
  };
  constraints: {
    timeWindows: boolean;
    vehicleCapacity: boolean;
    driverHours: boolean;
  };
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  type: 'pickup' | 'delivery' | 'waypoint';
  timeWindow?: {
    start: Date;
    end: Date;
  };
}

// Interfaces para Permissões e Dashboards
export interface DashboardAccess {
  userId: string;
  role: string;
  permissions: {
    view: string[];
    edit: string[];
    approve: string[];
  };
  restrictions: {
    timeRange?: {
      start: Date;
      end: Date;
    };
    geofence?: {
      lat: number;
      lng: number;
      radius: number;
    };
    maxValue?: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'map' | 'table' | 'metric' | 'alert';
  title: string;
  description?: string;
  data: any;
  settings: {
    refreshInterval?: number;
    layout?: {
      w: number;
      h: number;
      x: number;
      y: number;
    };
    visualization?: {
      type: string;
      colors?: string[];
      options?: any;
    };
  };
  permissions: string[];
}