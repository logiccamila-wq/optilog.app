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
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

interface Refuel {
  id: number;
  vehicle: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalValue: number;
  odometer: number;
  driver: string;
}

export default function AbastecimentosPage() {
  const [refuels, setRefuels] = useState<Refuel[]>([
    {
      id: 1,
      vehicle: 'ABC-1234',
      date: new Date().toISOString(),
      liters: 200,
      pricePerLiter: 6.50,
      totalValue: 1300,
      odometer: 125000,
      driver: 'João Silva',
    },
    {
      id: 2,
      vehicle: 'XYZ-5678',
      date: new Date(Date.now() - 86400000).toISOString(),
      liters: 180,
      pricePerLiter: 6.45,
      totalValue: 1161,
      odometer: 98500,
      driver: 'Maria Santos',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const totals = refuels.reduce((acc, r) => {
    acc.liters += r.liters;
    acc.value += r.totalValue;
    return acc;
  }, { liters: 0, value: 0 });

  const avgPrice = totals.liters > 0 ? totals.value / totals.liters : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalGasStationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Abastecimentos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Novo Abastecimento
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Litros</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {totals.liters.toLocaleString('pt-BR')} L
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Gasto</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.value.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Preço Médio</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {avgPrice.toFixed(2)}/L
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Veículo</strong></TableCell>
              <TableCell><strong>Motorista</strong></TableCell>
              <TableCell align="right"><strong>Litros</strong></TableCell>
              <TableCell align="right"><strong>R$/Litro</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>KM</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refuels.map((refuel) => (
              <TableRow key={refuel.id} hover>
                <TableCell>{new Date(refuel.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{refuel.vehicle}</TableCell>
                <TableCell>{refuel.driver}</TableCell>
                <TableCell align="right">{refuel.liters} L</TableCell>
                <TableCell align="right">R$ {refuel.pricePerLiter.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  R$ {refuel.totalValue.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell align="right">{refuel.odometer.toLocaleString('pt-BR')}</TableCell>
                <TableCell align="right">
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
