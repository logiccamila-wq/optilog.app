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

  // Calcular KPIs
  const kpis = useMemo(() => {
    return {
      maintenanceEfficiency: maintenanceIssues ? 
        (maintenanceIssues.filter(i => i.status === 'completed').length / maintenanceIssues.length) * 100 : 0,
      averageRepairTime: maintenanceIssues ? 
        maintenanceIssues
          .filter(i => i.completedAt)
          .reduce((acc, i) => acc + (new Date(i.completedAt!).getTime() - new Date(i.createdAt).getTime()), 0) / 
          maintenanceIssues.filter(i => i.completedAt).length / (1000 * 60 * 60) : 0,
      tireHealth: tireData ?
        (tireData.reduce((acc, t) => acc + t.treadDepth, 0) / tireData.length) * 100 : 0,
      fuelEfficiency: vehicleStatus ?
        (vehicleStatus.mileage / 100) : 0
    };
  }, [maintenanceIssues, tireData, vehicleStatus]);

  // Preparar widgets baseados no papel
  useEffect(() => {
    const baseWidgets: DashboardWidget[] = [
      {
        id: 'vehicle-status',
        type: 'metric',
        title: 'Status do Veículo',
        data: vehicleStatus,
        settings: {
          refreshInterval: 30000,
          layout: { w: 2, h: 1, x: 0, y: 0 }
        },
        permissions: ['driver', 'mechanic', 'admin']
      },
      {
        id: 'maintenance-issues',
        type: 'table',
        title: 'Ordens de Serviço',
        data: maintenanceIssues,
        settings: {
          refreshInterval: 60000,
          layout: { w: 4, h: 2, x: 2, y: 0 }
        },
        permissions: ['mechanic', 'admin']
      }
    ];

    // Widgets específicos por papel
    if (role === 'mechanic') {
      baseWidgets.push({
        id: 'predictive-maintenance',
        type: 'alert',
        title: 'Alertas Preditivos',
        data: criticalIssues,
        settings: {
          refreshInterval: 300000,
          layout: { w: 3, h: 2, x: 0, y: 2 }
        },
        permissions: ['mechanic', 'admin']
      });
    }

    if (role === 'admin') {
      baseWidgets.push({
        id: 'financial-overview',
        type: 'chart',
        title: 'Visão Financeira',
        data: bankData,
        settings: {
          refreshInterval: 3600000,
          layout: { w: 6, h: 3, x: 0, y: 4 },
          visualization: {
            type: 'line',
            colors: ['#10B981', '#EF4444']
          }
        },
        permissions: ['admin']
      });
    }

    setWidgets(baseWidgets);
    setLoading(false);
  }, [role, vehicleStatus, maintenanceIssues, criticalIssues, bankData]);

  if (loading) return <div>Carregando dashboard...</div>;
  if (fleetError) return <div>Erro: {fleetError}</div>;

  return (
    <AccessControl roles={[role, 'admin']}>
      <div className="smart-dashboard">
        {/* KPIs */}
        <div className="kpi-container">
          {Object.entries(kpis).map(([key, value]) => (
            <div key={key} className="kpi-card">
              <h3>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
              <p>{typeof value === 'number' ? value.toFixed(2) : value}</p>
            </div>
          ))}
        </div>

        {/* Widgets Grid */}
        <div className="widgets-grid">
          {widgets
            .filter(w => w.permissions.includes(role))
            .map(widget => (
              <div
                key={widget.id}
                className="widget"
                style={{
                  gridColumn: `span ${widget.settings.layout.w}`,
                  gridRow: `span ${widget.settings.layout.h}`
                }}
              >
                <h3>{widget.title}</h3>
                {renderWidget(widget)}
              </div>
            ))}
        </div>

        {/* Ações Rápidas */}
        <div className="quick-actions">
          {role === 'mechanic' && (
            <>
              <button onClick={() => createMaintenanceIssue({
                type: 'preventive',
                description: 'Manutenção preventiva programada',
                priority: 'medium'
              })}>
                Nova Ordem de Serviço
              </button>
            </>
          )}
        </div>

        <style jsx>{`
          .smart-dashboard {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }

          .kpi-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .kpi-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .kpi-card h3 {
            margin: 0;
            font-size: 14px;
            color: #6B7280;
            text-transform: capitalize;
          }

          .kpi-card p {
            margin: 10px 0 0;
            font-size: 24px;
            font-weight: 600;
            color: #111827;
          }

          .widgets-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }

          .widget {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .widget h3 {
            margin: 0 0 15px;
            font-size: 16px;
            color: #374151;
          }

          .quick-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }

          button {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            background: #3B82F6;
            color: white;
            cursor: pointer;
            font-weight: 500;
          }

          button:hover {
            background: #2563EB;
          }
        `}</style>
      </div>
    </AccessControl>
  );
}

// Função auxiliar para renderizar widgets
function renderWidget(widget: DashboardWidget) {
  switch (widget.type) {
    case 'chart':
      return <div>Gráfico aqui</div>; // Implementar com biblioteca de gráficos
    case 'map':
      return <div>Mapa aqui</div>; // Implementar com biblioteca de mapas
    case 'table':
      return (
        <table>
          <thead>
            <tr>
              {Object.keys(widget.data[0] || {}).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {widget.data.map((row: any, i: number) => (
              <tr key={i}>
                {Object.values(row).map((cell: any, j: number) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'metric':
      return <div className="metric">{JSON.stringify(widget.data)}</div>;
    case 'alert':
      return (
        <div className="alerts">
          {(widget.data as any[]).map((alert, i) => (
            <div key={i} className="alert">
              <strong>{alert.component}</strong>
              <p>{alert.action}</p>
              <span>Probabilidade: {(alert.probability * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}