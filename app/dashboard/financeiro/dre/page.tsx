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
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface DRELine {
  id: string;
  name: string;
  value: number;
  level: number;
  type: 'revenue' | 'expense' | 'subtotal' | 'total';
}

export default function DREPage() {
  const [period, setPeriod] = useState('2025-10');
  
  const dreData: DRELine[] = [
    { id: '1', name: 'RECEITA BRUTA', value: 500000, level: 0, type: 'revenue' },
    { id: '1.1', name: 'Receita de Serviços', value: 450000, level: 1, type: 'revenue' },
    { id: '1.2', name: 'Outras Receitas', value: 50000, level: 1, type: 'revenue' },
    
    { id: '2', name: '(-) DEDUÇÕES', value: -75000, level: 0, type: 'expense' },
    { id: '2.1', name: 'Impostos sobre Vendas', value: -75000, level: 1, type: 'expense' },
    
    { id: '3', name: '= RECEITA LÍQUIDA', value: 425000, level: 0, type: 'subtotal' },
    
    { id: '4', name: '(-) CUSTOS OPERACIONAIS', value: -250000, level: 0, type: 'expense' },
    { id: '4.1', name: 'Combustível', value: -120000, level: 1, type: 'expense' },
    { id: '4.2', name: 'Manutenção', value: -80000, level: 1, type: 'expense' },
    { id: '4.3', name: 'Seguro', value: -50000, level: 1, type: 'expense' },
    
    { id: '5', name: '= LUCRO BRUTO', value: 175000, level: 0, type: 'subtotal' },
    
    { id: '6', name: '(-) DESPESAS ADMINISTRATIVAS', value: -100000, level: 0, type: 'expense' },
    { id: '6.1', name: 'Pessoal', value: -60000, level: 1, type: 'expense' },
    { id: '6.2', name: 'Aluguel', value: -20000, level: 1, type: 'expense' },
    { id: '6.3', name: 'Outros', value: -20000, level: 1, type: 'expense' },
    
    { id: '7', name: '= LUCRO OPERACIONAL', value: 75000, level: 0, type: 'subtotal' },
    
    { id: '8', name: '(-) DESPESAS FINANCEIRAS', value: -15000, level: 0, type: 'expense' },
    
    { id: '9', name: '= LUCRO LÍQUIDO', value: 60000, level: 0, type: 'total' },
  ];

  const margemBruta = (175000 / 425000) * 100;
  const margemOperacional = (75000 / 425000) * 100;
  const margemLiquida = (60000 / 425000) * 100;

  const exportDRE = () => {
    const csv = [
      ['Conta', 'Valor'],
      ...dreData.map(line => [line.name, line.value]),
    ].map(row => row.join(';')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dre_${period}.csv`;
    link.click();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            DRE - Demonstração do Resultado
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={period}
              label="Período"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="2025-10">Outubro/2025</MenuItem>
              <MenuItem value="2025-09">Setembro/2025</MenuItem>
              <MenuItem value="2025-08">Agosto/2025</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportDRE}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon sx={{ color: 'white' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Margem Bruta
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {margemBruta.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon sx={{ color: 'white' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Margem Operacional
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {margemOperacional.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon sx={{ color: 'white' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Margem Líquida
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              {margemLiquida.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Conta</strong></TableCell>
              <TableCell align="right"><strong>Valor (R$)</strong></TableCell>
              <TableCell align="right"><strong>% Receita Líquida</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dreData.map((line) => (
              <TableRow 
                key={line.id} 
                hover
                sx={{
                  backgroundColor: line.type === 'total' ? 'action.selected' : 
                                   line.type === 'subtotal' ? 'action.hover' : 'inherit',
                }}
              >
                <TableCell 
                  sx={{ 
                    pl: 2 + line.level * 3,
                    fontWeight: line.level === 0 ? 700 : 400,
                  }}
                >
                  {line.name}
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: line.level === 0 ? 700 : 400,
                    color: line.value >= 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {line.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  {line.type !== 'total' && line.value !== 425000 ? 
                    ((Math.abs(line.value) / 425000) * 100).toFixed(1) + '%' : 
                    line.value === 425000 ? '100.0%' : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
