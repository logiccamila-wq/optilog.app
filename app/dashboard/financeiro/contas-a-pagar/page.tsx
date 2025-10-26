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
  Box,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Payable {
  id: number;
  supplier: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'approved' | 'paid' | 'overdue';
  category: string;
}

export default function ContasAPagarPage() {
  const [payables, setPayables] = useState<Payable[]>([
    {
      id: 1,
      supplier: 'Fornecedor XYZ Ltda',
      description: 'Combustível - Outubro',
      amount: 15000,
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      status: 'approved',
      category: 'Combustível',
    },
    {
      id: 2,
      supplier: 'Oficina ABC',
      description: 'Manutenção Caminhão 001',
      amount: 8500,
      dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'overdue',
      category: 'Manutenção',
    },
    {
      id: 3,
      supplier: 'Seguradora Delta',
      description: 'Seguro Frota - Novembro',
      amount: 12000,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      status: 'pending',
      category: 'Seguro',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const statusColors: Record<Payable['status'], 'default' | 'primary' | 'success' | 'error'> = {
    pending: 'default',
    approved: 'primary',
    paid: 'success',
    overdue: 'error',
  };

  const statusLabels: Record<Payable['status'], string> = {
    pending: 'Pendente Aprovação',
    approved: 'Aprovado',
    paid: 'Pago',
    overdue: 'Vencido',
  };

  const handlePayment = (id: number) => {
    setPayables(payables.map(p => p.id === id ? { ...p, status: 'paid' as const } : p));
  };

  const handleApprove = (id: number) => {
    setPayables(payables.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
  };

  const totals = payables.reduce((acc, p) => {
    acc.total += p.amount;
    if (p.status === 'overdue') acc.overdue += p.amount;
    if (p.status === 'approved') acc.approved += p.amount;
    if (p.status === 'paid') acc.paid += p.amount;
    return acc;
  }, { total: 0, overdue: 0, approved: 0, paid: 0 });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Contas a Pagar
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Nova Conta
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total a Pagar</Typography>
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
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Aprovados</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.approved.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pagos</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.paid.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Fornecedor</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell align="right"><strong>Valor</strong></TableCell>
              <TableCell><strong>Vencimento</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payables.map((payable) => (
              <TableRow key={payable.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{payable.supplier}</TableCell>
                <TableCell>{payable.description}</TableCell>
                <TableCell>{payable.category}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  R$ {payable.amount.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  {new Date(payable.dueDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={statusLabels[payable.status]} 
                    color={statusColors[payable.status]} 
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {payable.status === 'pending' && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleApprove(payable.id)}
                      title="Aprovar"
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                  {payable.status === 'approved' && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handlePayment(payable.id)}
                      title="Pagar"
                    >
                      <PaymentIcon fontSize="small" />
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
