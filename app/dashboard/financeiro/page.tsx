'use client';
import { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { neonClient, FinanceEntry } from '@/lib/neonClient';

const typeColors: Record<FinanceEntry['type'], 'success' | 'error'> = {
  income: 'success',
  expense: 'error',
};

const typeLabels: Record<FinanceEntry['type'], string> = {
  income: 'Receita',
  expense: 'Despesa',
};

export default function FinancePage() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    type: 'expense' as FinanceEntry['type'],
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    const response = await neonClient.list<FinanceEntry>('finance_entries');
    setLoading(false);

    if (response.success && response.data) {
      setEntries(response.data);
    } else {
      setError(response.error || 'Erro ao carregar lançamentos');
      // Mock data
      setEntries([
        {
          id: 1,
          description: 'Frete - São Paulo',
          amount: 5000.00,
          type: 'income',
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          description: 'Combustível',
          amount: 1200.00,
          type: 'expense',
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          description: 'Manutenção Frota',
          amount: 3500.00,
          type: 'expense',
          date: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleCreate = async () => {
    const response = await neonClient.create<FinanceEntry>('finance_entries', formData);
    
    if (response.success && response.data) {
      setEntries([...entries, response.data]);
      handleCloseDialog();
    } else {
      const newEntry: FinanceEntry = {
        id: Math.max(...entries.map(e => e.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setEntries([...entries, newEntry]);
      handleCloseDialog();
    }
  };

  const handleUpdate = async () => {
    if (!editingEntry) return;

    const response = await neonClient.update<FinanceEntry>('finance_entries', editingEntry.id, formData);
    
    if (response.success && response.data) {
      setEntries(entries.map(e => e.id === editingEntry.id ? response.data! : e));
      handleCloseDialog();
    } else {
      setEntries(entries.map(e => 
        e.id === editingEntry.id 
          ? { ...e, ...formData, updated_at: new Date().toISOString() }
          : e
      ));
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;
    const response = await neonClient.delete('finance_entries', id);
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleOpenDialog = (entry?: FinanceEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        description: entry.description,
        amount: entry.amount,
        type: entry.type,
        date: entry.date.split('T')[0],
      });
    } else {
      setEditingEntry(null);
      setFormData({
        description: '',
        amount: 0,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setError(null);
  };

  const totals = entries.reduce((acc, entry) => {
    if (entry.type === 'income') {
      acc.income += entry.amount;
    } else {
      acc.expense += entry.amount;
    }
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Núcleo Financeiro
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadEntries}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Lançamento
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error} (Usando dados de exemplo)
        </Alert>
      )}

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Receitas</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
            R$ {totals.income.toFixed(2)}
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Despesas</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
            R$ {totals.expense.toFixed(2)}
          </Typography>
        </Paper>
        <Paper sx={{ 
          p: 3, 
          borderRadius: 3, 
          background: balance >= 0 
            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
            : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Saldo</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>
            R$ {balance.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Data</strong></TableCell>
                <TableCell><strong>Descrição</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell align="right"><strong>Valor</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={typeLabels[entry.type]}
                      color={typeColors[entry.type]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600,
                    color: entry.type === 'income' ? 'success.main' : 'error.main'
                  }}>
                    {entry.type === 'income' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(entry)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(entry.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Nenhum lançamento financeiro.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEntry ? 'Editar Lançamento' : 'Novo Lançamento'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                label="Tipo"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as FinanceEntry['type'] })}
              >
                <MenuItem value="income">Receita</MenuItem>
                <MenuItem value="expense">Despesa</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Valor"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
              fullWidth
              InputProps={{
                startAdornment: 'R$',
              }}
            />
            <TextField
              label="Data"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={editingEntry ? handleUpdate : handleCreate}
            disabled={!formData.description || formData.amount <= 0}
          >
            {editingEntry ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
