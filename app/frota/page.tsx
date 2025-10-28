'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useI18n } from '@/app/providers/I18nProvider';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  LocalGasStation,
  Build,
  Warning,
  AttachMoney,
  Add,
  CheckCircle,
  PlayArrow
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FrotaPage() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useI18n();
  
  const [tab, setTab] = useState(0);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [fuelSupplies, setFuelSupplies] = useState<any[]>([]);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialogs
  const [fuelDialog, setFuelDialog] = useState(false);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  
  // Forms
  const [fuelForm, setFuelForm] = useState({
    vehicle_id: '',
    odometer: '',
    liters: '',
    unit_price: '',
    fuel_type: 'diesel',
    station_name: '',
    payment_method: 'cash'
  });
  
  const [maintenanceForm, setMaintenanceForm] = useState({
    vehicle_id: '',
    maintenance_type: 'preventive',
    description: '',
    scheduled_date: '',
    priority: 'medium'
  });

  const [alertForm, setAlertForm] = useState({
    vehicle_id: '',
    alert_type: 'ipva',
    description: '',
    due_date: '',
    document_number: '',
    cost: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, fuelRes, maintRes, alertsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/fuel-supplies'),
        fetch('/api/maintenances?status=scheduled'),
        fetch('/api/vehicle-alerts?status=pending')
      ]);

      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (fuelRes.ok) setFuelSupplies(await fuelRes.json());
      if (maintRes.ok) setMaintenances(await maintRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFuel = async () => {
    try {
      const res = await fetch('/api/fuel-supplies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fuelForm)
      });

      if (res.ok) {
        setFuelDialog(false);
        loadData();
        setFuelForm({
          vehicle_id: '',
          odometer: '',
          liters: '',
          unit_price: '',
          fuel_type: 'diesel',
          station_name: '',
          payment_method: 'cash'
        });
      }
    } catch (error) {
      console.error('Erro ao registrar abastecimento:', error);
    }
  };

  const handleAddMaintenance = async () => {
    try {
      const res = await fetch('/api/maintenances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintenanceForm)
      });

      if (res.ok) {
        setMaintenanceDialog(false);
        loadData();
        setMaintenanceForm({
          vehicle_id: '',
          maintenance_type: 'preventive',
          description: '',
          scheduled_date: '',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Erro ao agendar manutenção:', error);
    }
  };

  const handleAddAlert = async () => {
    try {
      const res = await fetch('/api/vehicle-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertForm)
      });

      if (res.ok) {
        setAlertDialog(false);
        loadData();
        setAlertForm({
          vehicle_id: '',
          alert_type: 'ipva',
          description: '',
          due_date: '',
          document_number: '',
          cost: ''
        });
      }
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
    }
  };

  const handleStartMaintenance = async (id: number) => {
    try {
      const res = await fetch(`/api/maintenances/${id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technician_name: 'Mecânico',
          workshop_name: 'Oficina Principal'
        })
      });

      if (res.ok) loadData();
    } catch (error) {
      console.error('Erro ao iniciar manutenção:', error);
    }
  };

  const handleResolveAlert = async (id: number) => {
    try {
      const res = await fetch(`/api/vehicle-alerts/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved_notes: 'Resolvido' })
      });

      if (res.ok) loadData();
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
    }
  };

  const items = [
    {
      key: 'veiculos',
      title: t('fleet.vehicles.title'),
      desc: t('fleet.vehicles.desc'),
      href: '/cadastro/veiculos',
      icon: '🚚',
      color: '#ef4444',
    },
    {
      key: 'motoristas',
      title: t('fleet.drivers.title'),
      desc: t('fleet.drivers.desc'),
      href: '/cadastro/motoristas',
      icon: '🧑\u200d✈️',
      color: '#0ea5e9',
    },
    {
      key: 'ordens',
      title: 'Ordens de Serviço',
      desc: 'Abertura, aprovação e execução de OS',
      href: '/frota/ordens',
      icon: '🧰',
      color: '#f59e0b',
    },
    {
      key: 'pneus',
      title: 'Gestão de Pneus',
      desc: 'Movimentação, vida útil, recapagem, TPMS',
      href: '/frota/pneus',
      icon: '🛞',
      color: '#64748b',
    },
    {
      key: 'manutencoes',
      title: 'Manutenções',
      desc: 'Programação e execução de serviços',
      href: '/frota/manutencoes',
      icon: '🔧',
      color: '#22c55e',
    },
    {
      key: 'abastecimentos',
      title: 'Abastecimentos',
      desc: 'Controle de combustível e consumo',
      href: '/frota/abastecimentos',
      icon: '⛽',
      color: '#3b82f6',
    },
    {
      key: 'estoque',
      title: 'Estoque de Peças',
      desc: 'Cadastro, entradas/saídas e mínimos',
      href: '/frota/estoque',
      icon: '📦',
      color: '#8b5cf6',
    },
    {
      key: 'ferramentas',
      title: 'Ferramentas',
      desc: 'Inventário, empréstimos e manutenção',
      href: '/frota/ferramentas',
      icon: '🛠️',
      color: '#0ea5e9',
    },
    {
      key: 'pedidos',
      title: 'Pedidos/Compras',
      desc: 'Requisições, cotações e pedidos',
      href: '/frota/pedidos',
      icon: '🧾',
      color: '#10b981',
    },
    {
      key: 'lavajato',
      title: 'Lava Jato',
      desc: 'Agenda e histórico de lavagens',
      href: '/frota/lava-jato',
      icon: '🧼',
      color: '#06b6d4',
    },
    {
      key: 'rastreamento',
      title: t('fleet.tracking.title'),
      desc: t('fleet.tracking.desc'),
      href: '/dashboard/logistica',
      icon: '📡',
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>{t('fleet.title')}</h1>
      <p style={{ color: colors.muted }}>{t('fleet.subtitle')}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: spacing.medium,
          marginTop: spacing.medium,
        }}
      >
        {items.map((item) => (
          <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: spacing.medium,
                backgroundColor: colors.surface,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 12,
                    backgroundColor: item.color,
                    fontSize: 24,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <h2 style={{ fontSize: typography.h2, marginTop: 0, marginBottom: 4 }}>
                    {item.title}
                  </h2>
                  <p style={{ color: colors.muted, marginBottom: 0 }}>{item.desc}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
