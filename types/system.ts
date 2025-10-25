// Tipos compartilhados para o sistema

// Core
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'admin' 
  | 'manager'
  | 'driver'
  | 'mechanic'
  | 'dispatcher'
  | 'customer'
  | 'financial'
  | 'sales';

export interface Permission {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete';
  scope: 'all' | 'own' | 'team';
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationPreference[];
}

// TMS
export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  status: VehicleStatus;
  currentLocation?: GeoLocation;
  driver?: User;
  maintenance: MaintenanceStatus;
  documents: Document[];
  telemetry: VehicleTelemetry;
}

export type VehicleStatus = 
  | 'available'
  | 'in_route'
  | 'maintenance'
  | 'breakdown'
  | 'inactive';

export interface Route {
  id: string;
  vehicle: Vehicle;
  driver: User;
  stops: RouteStop[];
  status: RouteStatus;
  startTime: Date;
  estimatedEndTime: Date;
  actualEndTime?: Date;
  distance: number;
  fuel: FuelData;
  documents: Document[];
}

// Maintenance
export interface MaintenanceOrder {
  id: string;
  vehicle: Vehicle;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  tasks: MaintenanceTask[];
  parts: SparePart[];
  assignedTo: User;
  startDate: Date;
  endDate?: Date;
  cost: number;
  notes: string[];
}

export type MaintenanceType =
  | 'preventive'
  | 'corrective'
  | 'predictive'
  | 'emergency';

export interface MaintenanceTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedTime: number;
  actualTime?: number;
  assignedTo: User;
  parts: SparePart[];
}

// SuperGestor
export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  category: KPICategory;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  history: KPIHistory[];
}

export type KPICategory =
  | 'financial'
  | 'operational'
  | 'maintenance'
  | 'safety'
  | 'customer'
  | 'efficiency';

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  status: 'new' | 'acknowledged' | 'resolved';
  assignedTo?: User;
  relatedEntities: any[];
}

export type AlertType =
  | 'maintenance_due'
  | 'route_delay'
  | 'compliance_issue'
  | 'safety_concern'
  | 'cost_anomaly'
  | 'system_error';