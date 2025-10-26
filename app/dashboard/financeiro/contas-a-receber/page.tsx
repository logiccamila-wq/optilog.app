"use client";
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Receivable {
  id: number;
  customer: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue';
  invoiceNumber: string;
}

export default function ContasAReceberPage() {
  const [receivables, setReceivables] = useState<Receivable[]>([
    {
      id: 1,
      customer: 'Cliente ABC Ltda',
      description: 'Frete SP-RJ - Carga 1234',
      amount: 25000,
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
      status: 'pending',
      invoiceNumber: 'NF-2025001',
    },
    {
      id: 2,
      customer: 'Empresa XYZ S/A',
      description: 'Serviço logístico',
      amount: 18500,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      status: 'pending',
      invoiceNumber: 'NF-2025002',
    },
    {
      id: 3,
      customer: 'Indústria Beta',
      description: 'Transporte dedicado',
      amount: 42000,
      dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      status: 'overdue',
      invoiceNumber: 'NF-2024998',
    },
  ]);

  const statusColors: Record<Receivable['status'], 'default' | 'success' | 'error'> = {
    pending: 'default',
    received: 'success',
    overdue: 'error',
  };

  const statusLabels: Record<Receivable['status'], string> = {
    pending: 'Pendente',
    received: 'Recebido',
    overdue: 'Vencido',
  };

  const handleReceive = (id: number) => {
    setReceivables(receivables.map(r => r.id === id ? { ...r, status: 'received' as const } : r));
  };

  const totals = receivables.reduce((acc, r) => {
    acc.total += r.amount;
    if (r.status === 'overdue') acc.overdue += r.amount;
    if (r.status === 'pending') acc.pending += r.amount;
    if (r.status === 'received') acc.received += r.amount;
    return acc;
  }, { total: 0, overdue: 0, pending: 0, received: 0 });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Contas a Receber
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Novo Recebível
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total a Receber</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.total.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Vencidos</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.overdue.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pendentes</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.pending.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Recebidos</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.received.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>NF</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell align="right"><strong>Valor</strong></TableCell>
              <TableCell><strong>Vencimento</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivables.map((receivable) => (
              <TableRow key={receivable.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{receivable.invoiceNumber}</TableCell>
                <TableCell>{receivable.customer}</TableCell>
                <TableCell>{receivable.description}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  R$ {receivable.amount.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  {new Date(receivable.dueDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={statusLabels[receivable.status]} 
                    color={statusColors[receivable.status]} 
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {receivable.status !== 'received' && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleReceive(receivable.id)}
                      title="Confirmar Recebimento"
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
