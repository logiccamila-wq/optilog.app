import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import type {
  VehicleStatus,
  MaintenanceIssue,
  TireManagement,
  PredictiveMaintenance
} from '@/lib/shared-types';

// Simulação de IA para previsão de manutenção
const predictMaintenanceIssues = (
  vehicleData: VehicleStatus,
  tireData: TireManagement[]
): PredictiveMaintenance => {
  const predictions: PredictiveMaintenance = {
    vehicleId: vehicleData.id,
    prediction: [],
    lastUpdated: new Date()
  };

  // Predição baseada em quilometragem
  if (vehicleData.mileage > 10000) {
    predictions.prediction.push({
      component: 'Óleo',
      failureProbability: 0.8,
      suggestedAction: 'Trocar óleo',
      urgency: 'high',
      estimatedCost: 350,
      confidence: 0.9
    });
  }

  // Predição baseada em pneus
  tireData.forEach(tire => {
    if (tire.treadDepth < 3) {
      predictions.prediction.push({
        component: `Pneu ${tire.position}`,
        failureProbability: 0.7,
        suggestedAction: 'Substituir pneu',
        urgency: 'medium',
        estimatedCost: 1200,
        confidence: 0.85
      });
    }
  });

  return predictions;
};

export const useFleetManagement = (vehicleId: string) => {
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus | null>(null);
  const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>([]);
  const [tireData, setTireData] = useState<TireManagement[]>([]);
  const [predictiveMaintenance, setPredictiveMaintenance] = useState<PredictiveMaintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, subscribe, lastMessage } = useWebSocket();

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        // Simular chamada à API
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        const data = await response.json();
        setVehicleStatus(data);
      } catch (e) {
        setError('Erro ao carregar dados do veículo');
        console.error(e);
      }
    };

    const fetchMaintenanceData = async () => {
      try {
        const response = await fetch(`/api/maintenance/${vehicleId}`);
        const data = await response.json();
        setMaintenanceIssues(data);
      } catch (e) {
        setError('Erro ao carregar dados de manutenção');
        console.error(e);
      }
    };

    const fetchTireData = async () => {
      try {
        const response = await fetch(`/api/tires/${vehicleId}`);
        const data = await response.json();
        setTireData(data);
      } catch (e) {
        setError('Erro ao carregar dados dos pneus');
        console.error(e);
      }
    };

    Promise.all([
      fetchVehicleData(),
      fetchMaintenanceData(),
      fetchTireData()
    ]).finally(() => {
      setLoading(false);
    });
  }, [vehicleId]);

  // Atualizar previsões quando os dados mudarem
  useEffect(() => {
    if (vehicleStatus && tireData.length > 0) {
      const predictions = predictMaintenanceIssues(vehicleStatus, tireData);
      setPredictiveMaintenance(predictions);
    }
  }, [vehicleStatus, tireData]);

  // Inscrever-se em atualizações em tempo real
  useEffect(() => {
    if (!isConnected) return;

    const unsubVehicle = subscribe('vehicle_update', (msg) => {
      if (msg.vehicleId === vehicleId) {
        setVehicleStatus(prev => ({ ...prev, ...msg.data }));
      }
    });

    const unsubMaintenance = subscribe('maintenance_update', (msg) => {
      if (msg.vehicleId === vehicleId) {
        setMaintenanceIssues(prev => [...prev, msg.data]);
      }
    });

    const unsubTire = subscribe('tire_update', (msg) => {
      if (msg.vehicleId === vehicleId) {
        setTireData(prev => prev.map(tire => 
          tire.id === msg.data.id ? { ...tire, ...msg.data } : tire
        ));
      }
    });

    return () => {
      unsubVehicle();
      unsubMaintenance();
      unsubTire();
    };
  }, [isConnected, vehicleId, subscribe]);

  const createMaintenanceIssue = async (issue: Partial<MaintenanceIssue>) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...issue,
          vehicleId,
          createdAt: new Date(),
          status: 'pending'
        }),
      });
      const data = await response.json();
      setMaintenanceIssues(prev => [...prev, data]);
      return data;
    } catch (e) {
      setError('Erro ao criar ordem de serviço');
      throw e;
    }
  };

  const updateMaintenanceStatus = async (issueId: string, status: MaintenanceIssue['status']) => {
    try {
      const response = await fetch(`/api/maintenance/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      setMaintenanceIssues(prev =>
        prev.map(issue => issue.id === issueId ? { ...issue, ...data } : issue)
      );
      return data;
    } catch (e) {
      setError('Erro ao atualizar ordem de serviço');
      throw e;
    }
  };

  return {
    vehicleStatus,
    maintenanceIssues,
    tireData,
    predictiveMaintenance,
    loading,
    error,
    createMaintenanceIssue,
    updateMaintenanceStatus,
  };
};