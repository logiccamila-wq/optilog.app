'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DirectionsCar,
  Warning,
  CheckCircle,
  Build
} from '@mui/icons-material';
import Link from 'next/link';

interface Equipamento {
  id: number;
  tipo: string;
  placa: string;
  chassi: string;
  ano_fabricacao: number;
  fabricante: string;
  modelo: string;
  capacidade_carga: number;
  eixos: number;
  proprietario: string;
  status: string;
  localizado_em: string;
  alertas_ativos?: number;
}

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    tipo: 'semi-reboque',
    placa: '',
    chassi: '',
    ano_fabricacao: new Date().getFullYear(),
    fabricante: '',
    modelo: '',
    capacidade_carga: '',
    eixos: 2,
    proprietario: 'proprio',
    status: 'ativo',
    localizado_em: 'garagem',
    crlv_vencimento: '',
    seguro_vencimento: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/equipamentos');
      if (res.ok) {
        const data = await res.json();
        setEquipamentos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingId ? `/api/equipamentos/${editingId}` : '/api/equipamentos';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setDialogOpen(false);
        setEditingId(null);
        loadData();
      }
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
    }
  };

  const handleEdit = (eq: Equipamento) => {
    setForm({
      tipo: eq.tipo,
      placa: eq.placa,
      chassi: eq.chassi,
      ano_fabricacao: eq.ano_fabricacao,
      fabricante: eq.fabricante,
      modelo: eq.modelo,
      capacidade_carga: eq.capacidade_carga.toString(),
      eixos: eq.eixos,
      proprietario: eq.proprietario,
      status: eq.status,
      localizado_em: eq.localizado_em,
      crlv_vencimento: '',
      seguro_vencimento: ''
    });
    setEditingId(eq.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza?')) return;
    try {
      const res = await fetch(`/api/equipamentos/${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'success';
      case 'manutencao': return 'warning';
      default: return 'default';
    }
  };

  const stats = {
    total: equipamentos.length,
    ativos: equipamentos.filter(e => e.status === 'ativo').length,
    em_manutencao: equipamentos.filter(e => e.status === 'manutencao').length,
    com_alertas: equipamentos.filter(e => (e.alertas_ativos || 0) > 0).length
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Equipamentos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          Novo
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <Card><CardContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DirectionsCar color="primary" />
              <Typography variant="h6">{stats.total}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Total</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={3}>
          <Card><CardContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <CheckCircle color="success" />
              <Typography variant="h6">{stats.ativos}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Ativos</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={3}>
          <Card><CardContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Build color="warning" />
              <Typography variant="h6">{stats.em_manutencao}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Em Manutenção</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={3}>
          <Card><CardContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Warning color="error" />
              <Typography variant="h6">{stats.com_alertas}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Com Alertas</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Proprietário</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Localização</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipamentos.map((eq) => (
              <TableRow key={eq.id} hover>
                <TableCell>{eq.placa}</TableCell>
                <TableCell>{eq.tipo}</TableCell>
                <TableCell>{eq.fabricante} {eq.modelo}</TableCell>
                <TableCell><Chip label={eq.proprietario} size="small" /></TableCell>
                <TableCell><Chip label={eq.status} color={getStatusColor(eq.status)} size="small" /></TableCell>
                <TableCell>{eq.localizado_em}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => handleEdit(eq)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(eq.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Editar' : 'Novo'} Equipamento</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField select label="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} fullWidth>
                  <MenuItem value="semi-reboque">Semi-reboque</MenuItem>
                  <MenuItem value="carreta">Carreta</MenuItem>
                  <MenuItem value="dolly">Dolly</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField label="Placa" value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} fullWidth />
              </Grid>
            </Grid>
            <TextField label="Chassi" value={form.chassi} onChange={(e) => setForm({ ...form, chassi: e.target.value })} fullWidth />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Fabricante" value={form.fabricante} onChange={(e) => setForm({ ...form, fabricante: e.target.value })} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} fullWidth />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
