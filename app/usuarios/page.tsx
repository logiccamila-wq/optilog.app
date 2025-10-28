'use client';
import { useState } from 'react';
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
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Camila Lareste',
      email: 'camila@optilog.com',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-15',
      lastLogin: '2025-10-26 08:30',
    },
    {
      id: 2,
      name: 'João Silva',
      email: 'joao.silva@optilog.com',
      role: 'driver',
      status: 'active',
      createdAt: '2025-02-20',
      lastLogin: '2025-10-26 07:15',
    },
    {
      id: 3,
      name: 'Maria Santos',
      email: 'maria.santos@optilog.com',
      role: 'manager',
      status: 'active',
      createdAt: '2025-03-10',
      lastLogin: '2025-10-25 18:45',
    },
    {
      id: 4,
      name: 'Carlos Oliveira',
      email: 'carlos@optilog.com',
      role: 'mechanic',
      status: 'active',
      createdAt: '2025-04-05',
      lastLogin: '2025-10-26 06:00',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const stats = users.reduce((acc, user) => {
    acc.total++;
    acc[user.status]++;
    return acc;
  }, { total: 0, active: 0, inactive: 0, suspended: 0 } as Record<string, number>);

  const handleStatusChange = (userId: number, newStatus: User['status']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

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
                  {user.status === 'active' ? (
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleStatusChange(user.id, 'suspended')}
                    >
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => handleStatusChange(user.id, 'active')}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton size="small" color="error">
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
            <TextField label="Nome Completo" fullWidth />
            <TextField label="Email" type="email" fullWidth />
            <FormControl fullWidth>
              <InputLabel>Função</InputLabel>
              <Select label="Função" defaultValue="operator">
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Senha Temporária" type="password" fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Criar Usuário
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
