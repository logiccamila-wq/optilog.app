// Hooks e contextos compartilhados para o sistema

import { create } from 'zustand';
import type { User, Vehicle, MaintenanceOrder, Alert } from '@/types/system';

interface SystemStore {
  // Dados do usuário
  user: User | null;
  setUser: (user: User | null) => void;

  // Dados de veículos
  vehicles: Vehicle[];
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;

  // Ordens de manutenção
  maintenanceOrders: MaintenanceOrder[];
  setMaintenanceOrders: (orders: MaintenanceOrder[]) => void;
  addMaintenanceOrder: (order: MaintenanceOrder) => void;
  updateMaintenanceOrder: (id: string, data: Partial<MaintenanceOrder>) => void;

  // Alertas e notificações
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, data: Partial<Alert>) => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  // Estado inicial
  user: null,
  vehicles: [],
  maintenanceOrders: [],
  alerts: [],

  // Ações do usuário
  setUser: (user) => set({ user }),

  // Ações de veículos
  setVehicles: (vehicles) => set({ vehicles }),
  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    })),
  updateVehicle: (id, data) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...data } : v
      ),
    })),

  // Ações de manutenção
  setMaintenanceOrders: (maintenanceOrders) => set({ maintenanceOrders }),
  addMaintenanceOrder: (order) =>
    set((state) => ({
      maintenanceOrders: [...state.maintenanceOrders, order],
    })),
  updateMaintenanceOrder: (id, data) =>
    set((state) => ({
      maintenanceOrders: state.maintenanceOrders.map((o) =>
        o.id === id ? { ...o, ...data } : o
      ),
    })),

  // Ações de alertas
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts, alert],
    })),
  updateAlert: (id, data) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),
}));