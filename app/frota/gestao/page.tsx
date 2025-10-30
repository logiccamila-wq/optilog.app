'use client';

import { useState, useEffect } from 'react';
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
import { safeNumber, safeToFixed, safeCurrency } from '@/lib/utils/number-validation';

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

export default function FleetManagementPage() {
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestão de Frota
      </Typography>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalGasStation color="primary" />
                <Typography variant="h6">{fuelSupplies.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Abastecimentos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Build color="warning" />
                <Typography variant="h6">{maintenances.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Manutenções Agendadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="error" />
                <Typography variant="h6">{alerts.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Alertas Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney color="success" />
                <Typography variant="h6">
                  {safeCurrency(
                    fuelSupplies.reduce((sum, f) => sum + safeNumber(f.total_value), 0)
                  )}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Gasto em Combustível
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Abastecimentos" />
          <Tab label="Manutenções" />
          <Tab label="Alertas" />
        </Tabs>
      </Box>

      {/* Abastecimentos */}
      <TabPanel value={tab} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFuelDialog(true)}
          >
            Registrar Abastecimento
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Veículo</TableCell>
                <TableCell>Motorista</TableCell>
                <TableCell align="right">Odômetro</TableCell>
                <TableCell align="right">Litros</TableCell>
                <TableCell align="right">R$/L</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Consumo (km/L)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fuelSupplies.map((supply) => (
                <TableRow key={supply.id}>
                  <TableCell>{new Date(supply.supply_date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{supply.vehicle_plate}</TableCell>
                  <TableCell>{supply.driver_name || '-'}</TableCell>
                  <TableCell align="right">{safeNumber(supply.odometer).toLocaleString()} km</TableCell>
                  <TableCell align="right">{safeNumber(supply.liters)} L</TableCell>
                  <TableCell align="right">{safeCurrency(supply.unit_price)}</TableCell>
                  <TableCell align="right">{safeCurrency(supply.total_value)}</TableCell>
                  <TableCell align="right">
                    {supply.consumption ? `${safeToFixed(supply.consumption, 2)} km/L` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Manutenções */}
      <TabPanel value={tab} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setMaintenanceDialog(true)}
          >
            Agendar Manutenção
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Veículo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data Agendada</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenances.map((maint) => (
                <TableRow key={maint.id}>
                  <TableCell>{maint.vehicle_plate}</TableCell>
                  <TableCell>
                    <Chip
                      label={maint.maintenance_type}
                      size="small"
                      color={maint.maintenance_type === 'preventive' ? 'info' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{maint.description}</TableCell>
                  <TableCell>
                    {maint.scheduled_date ? new Date(maint.scheduled_date).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={maint.priority}
                      size="small"
                      color={maint.priority === 'high' ? 'error' : maint.priority === 'medium' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={maint.status} size="small" />
                  </TableCell>
                  <TableCell>
                    {maint.status === 'scheduled' && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleStartMaintenance(maint.id)}
                        title="Iniciar"
                      >
                        <PlayArrow />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Alertas */}
      <TabPanel value={tab} index={2}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAlertDialog(true)}
          >
            Novo Alerta
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Veículo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell align="right">Custo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => {
                const daysUntilDue = Math.ceil(
                  (new Date(alert.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                const isOverdue = daysUntilDue < 0;
                const isUrgent = daysUntilDue <= 7 && daysUntilDue >= 0;

                return (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.vehicle_plate}</TableCell>
                    <TableCell>
                      <Chip
                        label={alert.alert_type.toUpperCase()}
                        size="small"
                        color={isOverdue ? 'error' : isUrgent ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{alert.description || '-'}</TableCell>
                    <TableCell>
                      <Box>
                        {new Date(alert.due_date).toLocaleDateString('pt-BR')}
                        {isOverdue && (
                          <Chip label={`${Math.abs(daysUntilDue)}d atrasado`} size="small" color="error" sx={{ ml: 1 }} />
                        )}
                        {isUrgent && (
                          <Chip label={`${daysUntilDue}d restantes`} size="small" color="warning" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{alert.document_number || '-'}</TableCell>
                    <TableCell align="right">
                      {alert.cost ? safeCurrency(alert.cost) : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleResolveAlert(alert.id)}
                        title="Resolver"
                      >
                        <CheckCircle />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Dialog: Abastecimento */}
      <Dialog open={fuelDialog} onClose={() => setFuelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Abastecimento</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Veículo"
              value={fuelForm.vehicle_id}
              onChange={(e) => setFuelForm({ ...fuelForm, vehicle_id: e.target.value })}
              fullWidth
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.plate} - {v.model}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Odômetro (km)"
              type="number"
              value={fuelForm.odometer}
              onChange={(e) => setFuelForm({ ...fuelForm, odometer: e.target.value })}
              fullWidth
            />
            <TextField
              label="Litros"
              type="number"
              value={fuelForm.liters}
              onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
              fullWidth
            />
            <TextField
              label="Preço por Litro (R$)"
              type="number"
              value={fuelForm.unit_price}
              onChange={(e) => setFuelForm({ ...fuelForm, unit_price: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Tipo de Combustível"
              value={fuelForm.fuel_type}
              onChange={(e) => setFuelForm({ ...fuelForm, fuel_type: e.target.value })}
              fullWidth
            >
              <MenuItem value="diesel">Diesel</MenuItem>
              <MenuItem value="gasoline">Gasolina</MenuItem>
              <MenuItem value="ethanol">Etanol</MenuItem>
            </TextField>
            <TextField
              label="Posto"
              value={fuelForm.station_name}
              onChange={(e) => setFuelForm({ ...fuelForm, station_name: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFuelDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddFuel} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Manutenção */}
      <Dialog open={maintenanceDialog} onClose={() => setMaintenanceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agendar Manutenção</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Veículo"
              value={maintenanceForm.vehicle_id}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicle_id: e.target.value })}
              fullWidth
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.plate} - {v.model}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Tipo"
              value={maintenanceForm.maintenance_type}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, maintenance_type: e.target.value })}
              fullWidth
            >
              <MenuItem value="preventive">Preventiva</MenuItem>
              <MenuItem value="corrective">Corretiva</MenuItem>
            </TextField>
            <TextField
              label="Descrição"
              value={maintenanceForm.description}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Data Agendada"
              type="date"
              value={maintenanceForm.scheduled_date}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, scheduled_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              label="Prioridade"
              value={maintenanceForm.priority}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })}
              fullWidth
            >
              <MenuItem value="low">Baixa</MenuItem>
              <MenuItem value="medium">Média</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddMaintenance} variant="contained">Agendar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Alerta */}
      <Dialog open={alertDialog} onClose={() => setAlertDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Alerta</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Veículo"
              value={alertForm.vehicle_id}
              onChange={(e) => setAlertForm({ ...alertForm, vehicle_id: e.target.value })}
              fullWidth
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.plate} - {v.model}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Tipo"
              value={alertForm.alert_type}
              onChange={(e) => setAlertForm({ ...alertForm, alert_type: e.target.value })}
              fullWidth
            >
              <MenuItem value="ipva">IPVA</MenuItem>
              <MenuItem value="insurance">Seguro</MenuItem>
              <MenuItem value="license">Licenciamento</MenuItem>
              <MenuItem value="inspection">Vistoria</MenuItem>
              <MenuItem value="other">Outro</MenuItem>
            </TextField>
            <TextField
              label="Descrição"
              value={alertForm.description}
              onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Data de Vencimento"
              type="date"
              value={alertForm.due_date}
              onChange={(e) => setAlertForm({ ...alertForm, due_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Número do Documento"
              value={alertForm.document_number}
              onChange={(e) => setAlertForm({ ...alertForm, document_number: e.target.value })}
              fullWidth
            />
            <TextField
              label="Custo (R$)"
              type="number"
              value={alertForm.cost}
              onChange={(e) => setAlertForm({ ...alertForm, cost: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddAlert} variant="contained">Criar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}