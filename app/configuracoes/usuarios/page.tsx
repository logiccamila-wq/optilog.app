'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { Users, Edit, Trash2, UserPlus } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

export default function UsuariosPage() {
  const [users] = useState<User[]>([
    { id: 1, name: 'Admin Sistema', email: 'admin@optilog.app', role: 'Administrador', status: 'active' },
    { id: 2, name: 'João Silva', email: 'joao@optilog.app', role: 'Gestor', status: 'active' },
    { id: 3, name: 'Maria Santos', email: 'maria@optilog.app', role: 'Operador', status: 'active' },
    { id: 4, name: 'Pedro Costa', email: 'pedro@optilog.app', role: 'Visualizador', status: 'inactive' },
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Users size={40} style={{ color: '#8b5cf6' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              👥 Usuários e Permissões
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Controle de acesso baseado em roles (RBAC)
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<UserPlus size={20} />}>
          Adicionar Usuário
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Função</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? 'Ativo' : 'Inativo'}
                      color={user.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <Edit size={18} />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Funções (Roles)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          O OptiLog utiliza controle de acesso baseado em funções (RBAC):
        </Typography>
        <Box component="ul" sx={{ ml: 2.5, mt: 1 }}>
          <li>
            <Typography variant="body2">
              <strong>Administrador:</strong> Acesso total ao sistema
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Gestor:</strong> Acesso a relatórios e gestão operacional
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Operador:</strong> Acesso às operações diárias
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Visualizador:</strong> Apenas visualização de dados
            </Typography>
          </li>
        </Box>
      </Paper>
    </Container>
  );
}
