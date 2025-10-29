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
  Box,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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

  // Optimize: Single pass through array to calculate all statistics
  const statistics = useMemo(() => {
    return taxes.reduce((acc, tax) => {
      // Accumulate totals by status
      acc.totals[tax.status] = (acc.totals[tax.status] || 0) + tax.taxValue;
      
      // Count by status
      acc.counts[tax.status] = (acc.counts[tax.status] || 0) + 1;
      
      // Identify critical items
      const dueDate = new Date(tax.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (tax.status === 'overdue' || (tax.status === 'pending' && daysUntilDue < 7)) {
        acc.critical.push(tax);
      }
      
      return acc;
    }, {
      totals: {} as Record<string, number>,
      counts: {} as Record<string, number>,
      critical: [] as Tax[]
    });
  }, [taxes]);

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'paid': return 'success';
      case 'calculated': return 'warning';
      case 'pending': return 'default';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'calculated': return 'Calculado';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
      default: return status;
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
            Apurar Impostos
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards - Using precomputed statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Calculado</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {(statistics.totals.calculated || 0).toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              {statistics.counts.calculated || 0} imposto(s)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pago</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {(statistics.totals.paid || 0).toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              {statistics.counts.paid || 0} imposto(s)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pendente</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {(statistics.totals.pending || 0).toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              {statistics.counts.pending || 0} imposto(s)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Vencido</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {(statistics.totals.overdue || 0).toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              {statistics.counts.overdue || 0} imposto(s)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Critical Items Alert */}
      {statistics.critical.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#e65100', mb: 1 }}>
            ⚠️ Atenção: {statistics.critical.length} Imposto(s) Crítico(s)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {statistics.critical.map((tax) => (
              <Typography key={tax.id} variant="body2" sx={{ color: '#bf360c' }}>
                • {tax.type} - Vencimento: {new Date(tax.dueDate).toLocaleDateString('pt-BR')} - R$ {tax.taxValue.toLocaleString('pt-BR')}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}

      {/* Tabs Section */}
      <Paper sx={{ borderRadius: 3, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Apurações" />
          <Tab label="Regime Tributário" />
        </Tabs>
      </Paper>

      {/* Tax List Table */}
      {tab === 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Período</strong></TableCell>
                <TableCell align="right"><strong>Base de Cálculo</strong></TableCell>
                <TableCell align="right"><strong>Alíquota</strong></TableCell>
                <TableCell align="right"><strong>Valor</strong></TableCell>
                <TableCell><strong>Vencimento</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxes.map((tax) => (
                <TableRow key={tax.id} hover>
                  <TableCell>{tax.type}</TableCell>
                  <TableCell>{tax.period}</TableCell>
                  <TableCell align="right">R$ {tax.baseValue.toLocaleString('pt-BR')}</TableCell>
                  <TableCell align="right">{tax.rate}%</TableCell>
                  <TableCell align="right">
                    <strong>R$ {tax.taxValue.toLocaleString('pt-BR')}</strong>
                  </TableCell>
                  <TableCell>{new Date(tax.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(tax.status)}
                      color={getStatusColor(tax.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Regime Tributário Tab */}
      {tab === 1 && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Regime Tributário Atual
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Regime:</strong> Lucro Presumido
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Informações sobre regime tributário, alíquotas e benefícios fiscais aplicáveis.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
