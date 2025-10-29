'use client';
import { useState, useMemo } from 'react';
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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Transaction {
  id: number;
  date: string;
  description: string;
  bankValue: number;
  systemValue: number | null;
  status: 'matched' | 'unmatched' | 'pending';
}

export default function ConciliacaoBancariaPage() {
  const [transactions] = useState<Transaction[]>([
    { id: 1, date: '2025-10-15', description: 'Pagamento Fornecedor A', bankValue: -15000, systemValue: -15000, status: 'matched' },
    { id: 2, date: '2025-10-14', description: 'Recebimento Cliente B', bankValue: 25000, systemValue: 25000, status: 'matched' },
    { id: 3, date: '2025-10-13', description: 'Taxa Bancária', bankValue: -45, systemValue: null, status: 'unmatched' },
    { id: 4, date: '2025-10-12', description: 'Depósito', bankValue: 8000, systemValue: 8000, status: 'pending' },
  ]);

  // Optimize: Single pass to count all statuses instead of multiple filter operations
  const statusCounts = useMemo(() => {
    return transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const matched = statusCounts.matched || 0;
  const unmatched = statusCounts.unmatched || 0;
  const pending = statusCounts.pending || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'success';
      case 'unmatched': return 'error';
      default: return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'matched': return 'Conciliado';
      case 'unmatched': return 'Divergente';
      default: return 'Pendente';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Conciliação Bancária
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<UploadFileIcon />}>
          Importar Extrato
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Conciliados</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {matched}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pendentes</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {pending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Divergentes</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {unmatched}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell align="right"><strong>Valor Banco</strong></TableCell>
              <TableCell align="right"><strong>Valor Sistema</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id} hover>
                <TableCell>{new Date(txn.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{txn.description}</TableCell>
                <TableCell align="right" sx={{ color: txn.bankValue < 0 ? 'error.main' : 'success.main', fontWeight: 600 }}>
                  R$ {txn.bankValue.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell align="right">
                  {txn.systemValue ? `R$ ${txn.systemValue.toLocaleString('pt-BR')}` : '-'}
                </TableCell>
                <TableCell>
                  <Chip label={getStatusLabel(txn.status)} color={getStatusColor(txn.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  {txn.status === 'unmatched' && (
                    <IconButton size="small" color="success">
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton size="small" color="error">
                    <CancelIcon fontSize="small" />
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
