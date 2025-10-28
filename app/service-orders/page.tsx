'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,

  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Build,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';

interface ServiceOrder {
  id: number;
  number: string;
  vehicle_id: number;
  type: string;
  priority: string;
  status: string;
  description: string;
  created_at: string;
  scheduled_date: string | null;
  total_cost: number;
  labor_hours: number;
}

export default function ServiceOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Formulário nova OS
  const [formData, setFormData] = useState({
    vehicle_id: '',
    type: 'preventiva',
    priority: 'media',
    description: '',
    scheduled_date: '',
    checklist: ['Verificar nível de óleo', 'Verificar freios', 'Verificar pneus'],
  });

  useEffect(() => {
    loadOrders();
  }, [filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url =
        filterStatus === 'all'
          ? '/api/service-orders'
          : `/api/service-orders?status=${filterStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar ordens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOS = async () => {
    try {
      const res = await fetch('/api/service-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vehicle_id: parseInt(formData.vehicle_id),
        }),
      });

      if (res.ok) {
        setOpenDialog(false);
        loadOrders();
        // Reset form
        setFormData({
          vehicle_id: '',
          type: 'preventiva',
          priority: 'media',
          description: '',
          scheduled_date: '',
          checklist: [],
        });
      }
    } catch (error) {
      console.error('Erro ao criar OS:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      aberta: '#f59e0b',
      aprovada: '#3b82f6',
      em_execucao: '#8b5cf6',
      fechada: '#10b981',
      cancelada: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      baixa: '#10b981',
      media: '#f59e0b',
      alta: '#ef4444',
      urgente: '#dc2626',
    };
    return colors[priority] || '#6b7280';
  };

  const stats = {
    total: orders.length,
    abertas: orders.filter((o) => o.status === 'aberta').length,
    em_execucao: orders.filter((o) => o.status === 'em_execucao').length,
    fechadas: orders.filter((o) => o.status === 'fechada').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          🔧 Ordens de Serviço
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Nova OS
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                </div>
                <Build sx={{ fontSize: 40, color: '#6b7280' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Abertas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {stats.abertas}
                  </Typography>
                </div>
                <Warning sx={{ fontSize: 40, color: '#f59e0b' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

  <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Em Execução
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                    {stats.em_execucao}
                  </Typography>
                </div>
                <Schedule sx={{ fontSize: 40, color: '#8b5cf6' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Fechadas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {stats.fechadas}
                  </Typography>
                </div>
                <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filterStatus}
          label="Status"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="aberta">Abertas</MenuItem>
          <MenuItem value="aprovada">Aprovadas</MenuItem>
          <MenuItem value="em_execucao">Em Execução</MenuItem>
          <MenuItem value="fechada">Fechadas</MenuItem>
        </Select>
      </FormControl>

      {/* Lista de OS */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {order.number}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{ bgcolor: getStatusColor(order.status), color: 'white' }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={order.type}
                      size="small"
                      sx={{ mr: 1 }}
                      variant="outlined"
                    />
                    <Chip
                      label={order.priority}
                      size="small"
                      sx={{ bgcolor: getPriorityColor(order.priority), color: 'white' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {order.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </Typography>
                    {order.total_cost > 0 && (
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        R$ {order.total_cost.toFixed(2)}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => window.location.href = `/service-orders/${order.id}`}
                    >
                      Ver Detalhes
                    </Button>
                    {order.status === 'aberta' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        Aprovar
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Nova OS */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="ID do Veículo"
                type="number"
                fullWidth
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  label="Tipo"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="preventiva">Preventiva</MenuItem>
                  <MenuItem value="corretiva">Corretiva</MenuItem>
                  <MenuItem value="preditiva">Preditiva</MenuItem>
                  <MenuItem value="inspeção">Inspeção</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={formData.priority}
                  label="Prioridade"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="baixa">Baixa</MenuItem>
                  <MenuItem value="media">Média</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="urgente">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Data Agendada"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Checklist Inicial
              </Typography>
              <List>
                {formData.checklist.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Checkbox edge="start" disabled />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateOS} variant="contained">
            Criar OS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
