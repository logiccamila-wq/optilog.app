'use client';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { neonClient, Vehicle } from '@/lib/neonClient';

const statusColors: Record<Vehicle['status'], 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
  active: 'success',
  maintenance: 'warning',
  inactive: 'default',
};

const statusLabels: Record<Vehicle['status'], string> = {
  active: 'Ativo',
  maintenance: 'Manutenção',
  inactive: 'Inativo',
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    status: 'active' as Vehicle['status'],
    last_maintenance: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    setError(null);
    const response = await neonClient.list<Vehicle>('vehicles');
    setLoading(false);

    if (response.success && response.data) {
      setVehicles(response.data);
    } else {
      setError(response.error || 'Erro ao carregar veículos');
      // Mock data
      setVehicles([
        {
          id: 1,
          plate: 'ABC-1234',
          model: 'Mercedes-Benz Actros',
          status: 'active',
          last_maintenance: new Date(Date.now() - 30 * 86400000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          plate: 'XYZ-5678',
          model: 'Volvo FH',
          status: 'maintenance',
          last_maintenance: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleCreate = async () => {
    const response = await neonClient.create<Vehicle>('vehicles', formData);
    
    if (response.success && response.data) {
      setVehicles([...vehicles, response.data]);
      handleCloseDialog();
    } else {
      const newVehicle: Vehicle = {
        id: Math.max(...vehicles.map(v => v.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setVehicles([...vehicles, newVehicle]);
      handleCloseDialog();
    }
  };

  const handleUpdate = async () => {
    if (!editingVehicle) return;

    const response = await neonClient.update<Vehicle>('vehicles', editingVehicle.id, formData);
    
    if (response.success && response.data) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? response.data! : v));
      handleCloseDialog();
    } else {
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...v, ...formData, updated_at: new Date().toISOString() }
          : v
      ));
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return;
    const response = await neonClient.delete('vehicles', id);
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        plate: vehicle.plate,
        model: vehicle.model,
        status: vehicle.status,
        last_maintenance: vehicle.last_maintenance.split('T')[0],
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        plate: '',
        model: '',
        status: 'active',
        last_maintenance: new Date().toISOString().split('T')[0],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVehicle(null);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Gestão de Frota
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadVehicles}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Veículo
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error} (Usando dados de exemplo)
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Placa</strong></TableCell>
                <TableCell><strong>Modelo</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Última Manutenção</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} hover>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[vehicle.status]}
                      color={statusColors[vehicle.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(vehicle.last_maintenance).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(vehicle)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(vehicle.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Nenhum veículo cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Placa"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
              required
              fullWidth
              inputProps={{ maxLength: 8 }}
            />
            <TextField
              label="Modelo"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="maintenance">Manutenção</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Última Manutenção"
              type="date"
              value={formData.last_maintenance}
              onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={editingVehicle ? handleUpdate : handleCreate}
            disabled={!formData.plate || !formData.model}
          >
            {editingVehicle ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
