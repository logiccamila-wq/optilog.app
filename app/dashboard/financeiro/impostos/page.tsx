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
  Chip,
  IconButton,
  Box,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface Tax {
  id: number;
  type: string;
  period: string;
  baseValue: number;
  rate: number;
  taxValue: number;
  dueDate: string;
  status: 'pending' | 'calculated' | 'paid';
}

export default function ImpostosPage() {
  const [tab, setTab] = useState(0);
  const [taxes] = useState<Tax[]>([
    { id: 1, type: 'ICMS', period: 'Out/2025', baseValue: 250000, rate: 12, taxValue: 30000, dueDate: '2025-11-15', status: 'calculated' },
    { id: 2, type: 'ISS', period: 'Out/2025', baseValue: 180000, rate: 5, taxValue: 9000, dueDate: '2025-11-10', status: 'paid' },
    { id: 3, type: 'PIS', period: 'Out/2025', baseValue: 500000, rate: 1.65, taxValue: 8250, dueDate: '2025-11-20', status: 'pending' },
    { id: 4, type: 'COFINS', period: 'Out/2025', baseValue: 500000, rate: 7.6, taxValue: 38000, dueDate: '2025-11-20', status: 'pending' },
  ]);

  const totals = taxes.reduce((acc, t) => {
    acc.calculated += t.status === 'calculated' ? t.taxValue : 0;
    acc.paid += t.status === 'paid' ? t.taxValue : 0;
    acc.pending += t.status === 'pending' ? t.taxValue : 0;
    return acc;
  }, { calculated: 0, paid: 0, pending: 0 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'calculated': return 'warning';
      default: return 'error';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'calculated': return 'Calculado';
      default: return 'Pendente';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Impostos
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Apurar Impostos
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Calculado</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.calculated.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pago</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.paid.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pendente</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.pending.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Apurações" />
          <Tab label="Regime Tributário" />
          <Tab label="Calendário Fiscal" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Imposto</strong></TableCell>
                <TableCell><strong>Período</strong></TableCell>
                <TableCell align="right"><strong>Base Cálculo</strong></TableCell>
                <TableCell align="right"><strong>Alíquota</strong></TableCell>
                <TableCell align="right"><strong>Valor</strong></TableCell>
                <TableCell><strong>Vencimento</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxes.map((tax) => (
                <TableRow key={tax.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{tax.type}</TableCell>
                  <TableCell>{tax.period}</TableCell>
                  <TableCell align="right">R$ {tax.baseValue.toLocaleString('pt-BR')}</TableCell>
                  <TableCell align="right">{tax.rate}%</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    R$ {tax.taxValue.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{new Date(tax.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(tax.status)} color={getStatusColor(tax.status)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="success">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Regime: Simples Nacional</Typography>
          <Typography variant="body2" color="text.secondary">
            Configure o regime tributário e alíquotas de cada imposto. Integrações com SPED e eSocial.
          </Typography>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Próximos Vencimentos</Typography>
          <Typography variant="body2" color="text.secondary">
            Calendário fiscal com lembretes automáticos e sincronização com obrigações acessórias.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
