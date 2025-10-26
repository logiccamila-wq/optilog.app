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
  Box,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

interface CostCenter {
  id: number;
  code: string;
  name: string;
  type: string;
  budget: number;
  spent: number;
  percentage: number;
}

export default function CentrosDeCustoPage() {
  const [costCenters] = useState<CostCenter[]>([
    { id: 1, code: 'CC-001', name: 'Operações SP', type: 'Operacional', budget: 150000, spent: 98500, percentage: 65.7 },
    { id: 2, code: 'CC-002', name: 'Frota RJ', type: 'Frota', budget: 200000, spent: 145000, percentage: 72.5 },
    { id: 3, code: 'CC-003', name: 'Administração', type: 'Administrativo', budget: 80000, spent: 42000, percentage: 52.5 },
    { id: 4, code: 'CC-004', name: 'Manutenção', type: 'Manutenção', budget: 120000, spent: 89000, percentage: 74.2 },
  ]);

  const totals = costCenters.reduce((acc, cc) => {
    acc.budget += cc.budget;
    acc.spent += cc.spent;
    return acc;
  }, { budget: 0, spent: 0 });

  const avgPercentage = (totals.spent / totals.budget) * 100;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BusinessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Centros de Custo
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Novo Centro de Custo
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Orçamento Total</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.budget.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Gasto</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              R$ {totals.spent.toLocaleString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>% Realizado</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
              {avgPercentage.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell align="right"><strong>Orçamento</strong></TableCell>
              <TableCell align="right"><strong>Gasto</strong></TableCell>
              <TableCell align="right"><strong>%</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costCenters.map((cc) => (
              <TableRow key={cc.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{cc.code}</TableCell>
                <TableCell>{cc.name}</TableCell>
                <TableCell>{cc.type}</TableCell>
                <TableCell align="right">R$ {cc.budget.toLocaleString('pt-BR')}</TableCell>
                <TableCell align="right">R$ {cc.spent.toLocaleString('pt-BR')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: cc.percentage > 80 ? 'error.main' : 'text.primary' }}>
                  {cc.percentage.toFixed(1)}%
                </TableCell>
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
