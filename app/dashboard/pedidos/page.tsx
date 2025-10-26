"use client";
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
import { neonClient, Order } from '@/lib/neonClient';

const statusColors: Record<Order['status'], 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendente',
  processing: 'Processando',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    status: 'pending' as Order['status'],
    total: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    const response = await neonClient.list<Order>('orders');
    setLoading(false);

    if (response.success && response.data) {
      setOrders(response.data);
    } else {
      setError(response.error || 'Erro ao carregar pedidos');
      // Mock data para desenvolvimento
      setOrders([
        {
          id: 1,
          customer_name: 'João Silva',
          status: 'processing',
          total: 1250.50,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          customer_name: 'Maria Santos',
          status: 'delivered',
          total: 890.00,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    }
  };

  const handleCreate = async () => {
    const response = await neonClient.create<Order>('orders', formData);
    
    if (response.success && response.data) {
      setOrders([...orders, response.data]);
      handleCloseDialog();
    } else {
      setError(response.error || 'Erro ao criar pedido');
      // Simula criação para desenvolvimento
      const newOrder: Order = {
        id: Math.max(...orders.map(o => o.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
      handleCloseDialog();
    }
  };

  const handleUpdate = async () => {
    if (!editingOrder) return;

    const response = await neonClient.update<Order>('orders', editingOrder.id, formData);
    
    if (response.success && response.data) {
      setOrders(orders.map(o => o.id === editingOrder.id ? response.data! : o));
      handleCloseDialog();
    } else {
      // Simula atualização
      setOrders(orders.map(o => 
        o.id === editingOrder.id 
          ? { ...o, ...formData, updated_at: new Date().toISOString() }
          : o
      ));
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    const response = await neonClient.delete('orders', id);
    
    if (response.success) {
      setOrders(orders.filter(o => o.id !== id));
    } else {
      // Simula remoção
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleOpenDialog = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customer_name: order.customer_name,
        status: order.status,
        total: order.total,
      });
    } else {
      setEditingOrder(null);
      setFormData({
        customer_name: '',
        status: 'pending',
        total: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrder(null);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gestão de Pedidos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadOrders}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Pedido
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
                <TableCell><strong>Cliente</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell><strong>Criado em</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[order.status]}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    R$ {order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(order)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(order.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Nenhum pedido encontrado. Clique em "Novo Pedido" para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Editar Pedido' : 'Novo Pedido'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Nome do Cliente"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Order['status'] })}
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="processing">Processando</MenuItem>
                <MenuItem value="shipped">Enviado</MenuItem>
                <MenuItem value="delivered">Entregue</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Total"
              type="number"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) })}
              required
              fullWidth
              InputProps={{
                startAdornment: 'R$',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={editingOrder ? handleUpdate : handleCreate}
            disabled={!formData.customer_name || formData.total <= 0}
          >
            {editingOrder ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
