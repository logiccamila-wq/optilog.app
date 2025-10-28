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
  Chip,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';

interface Maintenance {
  id: number;
  vehicle: string;
  type: 'preventive' | 'corrective';
  service: string;
  mechanic: string;
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  cost: number;
}

export default function ManutencoesPage() {
  const [maintenances] = useState<Maintenance[]>([
    { id: 1, vehicle: 'ABC-1234', type: 'preventive', service: 'Troca de óleo', mechanic: 'João Silva', scheduledDate: '2025-10-20', status: 'scheduled', cost: 450 },
    { id: 2, vehicle: 'XYZ-5678', type: 'corrective', service: 'Freios', mechanic: 'Ana Santos', scheduledDate: '2025-10-18', status: 'in_progress', cost: 1200 },
    { id: 3, vehicle: 'DEF-9012', type: 'preventive', service: 'Revisão 10.000km', mechanic: 'Carlos Oliveira', scheduledDate: '2025-10-15', status: 'completed', cost: 800 },
  ]);

  const scheduled = maintenances.filter(m => m.status === 'scheduled').length;
  const inProgress = maintenances.filter(m => m.status === 'in_progress').length;
  const completed = maintenances.filter(m => m.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Andamento';
      default: return 'Agendado';
    }
  };

  const getTypeColor = (type: string) => type === 'preventive' ? 'primary' : 'error';
  const getTypeLabel = (type: string) => type === 'preventive' ? 'Preventiva' : 'Corretiva';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BuildIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Manutenções
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Nova Ordem de Serviço
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Agendadas</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {scheduled}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Em Andamento</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {inProgress}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Concluídas</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {completed}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Veículo</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Serviço</strong></TableCell>
              <TableCell><strong>Mecânico</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell align="right"><strong>Custo</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenances.map((maint) => (
              <TableRow key={maint.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{maint.vehicle}</TableCell>
                <TableCell>
                  <Chip label={getTypeLabel(maint.type)} color={getTypeColor(maint.type)} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{maint.service}</TableCell>
                <TableCell>{maint.mechanic}</TableCell>
                <TableCell>{new Date(maint.scheduledDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell align="right">R$ {maint.cost.toLocaleString('pt-BR')}</TableCell>
                <TableCell>
                  <Chip label={getStatusLabel(maint.status)} color={getStatusColor(maint.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  {maint.status !== 'completed' && (
                    <IconButton size="small" color="success">
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
