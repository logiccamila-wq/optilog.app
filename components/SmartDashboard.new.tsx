// Arquivo temporário para testar o componente
import React from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { lightColors, darkColors } from '@/types/theme';
import type { Colors } from '@/types/theme';

interface SmartDashboardProps {
  role: 'mechanic' | 'admin' | 'driver';
  vehicleId: string;
  activeTab?: 'os' | 'manutencoes' | 'preditiva';
}

export function SmartDashboard({ role, vehicleId, activeTab = 'os' }: SmartDashboardProps) {
  const { effectiveMode } = useTheme();
  const colors: Colors = effectiveMode === 'dark' ? darkColors : lightColors;

  return (
    <div className="smart-dashboard">
      {activeTab === 'os' && (
        <div className="dashboard-section">
          <h2>Ordens de Serviço</h2>
          {/* TODO: Implementar lista de OS */}
          <div className="placeholder-content">
            <p>Em breve: Lista de ordens de serviço com status e prioridades</p>
          </div>
        </div>
      )}

      {activeTab === 'manutencoes' && (
        <div className="dashboard-section">
          <h2>Manutenções</h2>
          {/* TODO: Implementar lista de manutenções */}
          <div className="placeholder-content">
            <p>Em breve: Histórico e agendamento de manutenções</p>
          </div>
        </div>
      )}

      {activeTab === 'preditiva' && (
        <div className="dashboard-section">
          <h2>Manutenção Preditiva</h2>
          {/* TODO: Implementar análise preditiva */}
          <div className="placeholder-content">
            <p>Em breve: Análise preditiva com ML para prevenção de falhas</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .smart-dashboard {
          padding: 20px;
          border-radius: 8px;
          border: 1px solid ${colors.border};
          background: ${colors.background};
        }

        .dashboard-section {
          margin-bottom: 24px;
        }

        .dashboard-section:last-child {
          margin-bottom: 0;
        }

        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: ${colors.text};
          margin: 0 0 16px;
        }

        .placeholder-content {
          padding: 24px;
          background: ${colors.surface};
          border-radius: 6px;
          text-align: center;
        }

        .placeholder-content p {
          color: ${colors.textMuted};
          margin: 0;
        }
      `}</style>
    </div>
  );
}