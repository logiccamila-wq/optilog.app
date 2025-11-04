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
  IconButton,
  Chip,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'driver' | 'mechanic' | 'operator';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

const ROLE_LABELS = {
  admin: 'Administrador',
  manager: 'Gestor',
  driver: 'Motorista',
  mechanic: 'Mecânico',
  operator: 'Operador',
};

const ROLE_COLORS = {
  admin: 'error',
  manager: 'warning',
  driver: 'info',
  mechanic: 'success',
  operator: 'default',
} as const;

const STATUS_LABELS = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
};

const STATUS_COLORS = {
  active: 'success',
  inactive: 'default',
  suspended: 'error',
} as const;

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState<{ name: string; email: string; role: User['role']; password: string; phone: string; cpf: string }>({ 
    name: '', 
    email: '', 
    role: 'operator', 
    password: '', 
    phone: '', 
    cpf: '' 
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => { 
    loadUsers(); 
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Erro ao carregar usuários');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao carregar usuários', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        setSnackbar({ open: true, message: 'Preencha todos os campos obrigatórios', severity: 'error' });
        return;
      }
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar usuário');
      }
      setSnackbar({ open: true, message: 'Usuário criado com sucesso!', severity: 'success' });
      setDialogOpen(false);
      setFormData({ name: '', email: '', role: 'operator', password: '', phone: '', cpf: '' });
      loadUsers();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  }

  async function handleToggleStatus(userId: number) {
    try {
      const res = await fetch(`/api/users/${userId}/toggle-status`, { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao alterar status');
      setSnackbar({ open: true, message: 'Status atualizado com sucesso!', severity: 'success' });
      loadUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao alterar status', severity: 'error' });
    }
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir usuário');
      setSnackbar({ open: true, message: 'Usuário excluído com sucesso!', severity: 'success' });
      loadUsers();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao excluir usuário', severity: 'error' });
    }
  }

  const stats = users.reduce((acc, user) => {
    acc.total++;
    acc[user.status]++;
    return acc;
  }, { total: 0, active: 0, inactive: 0, suspended: 0 } as Record<string, number>);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress size={60} />
    </Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Gestão de Usuários
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Novo Usuário
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total de Usuários</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Ativos</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {stats.active}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Inativos</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {stats.inactive}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Suspensos</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {stats.suspended}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Função</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Criado em</strong></TableCell>
              <TableCell><strong>Último Login</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={ROLE_LABELS[user.role]}
                    color={ROLE_COLORS[user.role]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={STATUS_LABELS[user.status]}
                    color={STATUS_COLORS[user.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color={user.status === 'active' ? 'error' : 'success'}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Usuário</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField 
              label="Nome Completo" 
              fullWidth 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              label="Email" 
              type="email" 
              fullWidth 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel>Função</InputLabel>
              <Select 
                label="Função" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as User['role']})}
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              label="Senha Temporária" 
              type="password" 
              fullWidth 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <TextField 
              label="Telefone (Opcional)" 
              fullWidth 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <TextField 
              label="CPF (Opcional)" 
              fullWidth 
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateUser}>
            Criar Usuário
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
