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
  status: 'pending' | 'calculated' | 'paid' | 'overdue';
}

export default function ImpostosPage() {
  const [tab, setTab] = useState(0);
  const [taxes] = useState<Tax[]>([
    { id: 1, type: 'ICMS', period: 'Out/2025', baseValue: 250000, rate: 12, taxValue: 30000, dueDate: '2025-11-15', status: 'calculated' },
    { id: 2, type: 'ISS', period: 'Out/2025', baseValue: 180000, rate: 5, taxValue: 9000, dueDate: '2025-11-10', status: 'paid' },
    { id: 3, type: 'PIS', period: 'Out/2025', baseValue: 500000, rate: 1.65, taxValue: 8250, dueDate: '2025-11-20', status: 'pending' },
    { id: 4, type: 'COFINS', period: 'Out/2025', baseValue: 500000, rate: 7.6, taxValue: 38000, dueDate: '2025-11-20', status: 'pending' },
    { id: 5, type: 'IRPJ', period: 'Set/2025', baseValue: 480000, rate: 15, taxValue: 72000, dueDate: '2025-10-31', status: 'overdue' },
    { id: 6, type: 'CSLL', period: 'Set/2025', baseValue: 480000, rate: 9, taxValue: 43200, dueDate: '2025-10-31', status: 'overdue' },
  ]);

  const totals = taxes.reduce((acc, t) => {
    acc.calculated += t.status === 'calculated' ? t.taxValue : 0;
    acc.paid += t.status === 'paid' ? t.taxValue : 0;
    acc.pending += t.status === 'pending' ? t.taxValue : 0;
    acc.overdue += t.status === 'overdue' ? t.taxValue : 0;
    return acc;
  }, { calculated: 0, paid: 0, pending: 0, overdue: 0 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'calculated': return 'warning';
      case 'pending': return 'info';
      default: return 'error';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'calculated': return 'Calculado';
      case 'pending': return 'Pendente';
      default: return 'Vencido';
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Exportar
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Apurar Imposto
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 1 }}>
              Calculados
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              R$ {totals.calculated.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 1 }}>
              Pagos
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              R$ {totals.paid.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 1 }}>
              Pendentes
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              R$ {totals.pending.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 1 }}>
              Vencidos
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              R$ {totals.overdue.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Apurações" />
          <Tab label="Calendário Fiscal" />
          <Tab label="Regime Tributário" />
        </Tabs>

        {tab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Período</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Base de Cálculo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Alíquota</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Valor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vencimento</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxes.map((tax) => (
                  <TableRow key={tax.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{tax.type}</TableCell>
                    <TableCell>{tax.period}</TableCell>
                    <TableCell align="right">R$ {tax.baseValue.toLocaleString('pt-BR')}</TableCell>
                    <TableCell align="right">{tax.rate}%</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      R$ {tax.taxValue.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>{new Date(tax.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(tax.status)} 
                        color={getStatusColor(tax.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary">
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
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Calendário Fiscal
            </Typography>
            <Typography color="text.secondary">
              Visualize todos os vencimentos fiscais do ano.
            </Typography>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Regime Tributário
            </Typography>
            <Typography color="text.secondary">
              Configure o regime tributário da empresa (Simples Nacional, Lucro Presumido, Lucro Real).
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
