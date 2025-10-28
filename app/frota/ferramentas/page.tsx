'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell, Paper
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Link from 'next/link';

interface Tool {
  id?: number;
  code: string;
  name: string;
  category?: string;
  status?: 'disponivel'|'emprestada'|'manutencao'|'perdida';
  condition?: 'nova'|'boa'|'reparo'|'sucata';
  location?: string;
  assigned_to?: string;
  last_os_id?: number;
  purchase_date?: string;
  purchase_price?: number;
  notes?: string;
}

export default function FerramentasPage() {
  const [items, setItems] = useState<Tool[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tool | null>(null);

  const filtered = useMemo(() => {
    return items.filter(i =>
      (!q || i.name.toLowerCase().includes(q.toLowerCase()) || i.code.toLowerCase().includes(q.toLowerCase())) &&
      (!status || i.status === status)
    );
  }, [items, q, status]);

  const load = async () => {
    const url = new URL('/api/tools', window.location.origin);
    if (q) url.searchParams.set('q', q);
    if (status) url.searchParams.set('status', status);
    const res = await fetch(url.toString());
    const data = await res.json();
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const onSave = async (data: Tool) => {
    if (editing?.id) {
      await fetch(`/api/tools/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else {
      await fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    setOpen(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (row: Tool) => {
    if (!row.id) return;
    if (!confirm(`Excluir ferramenta ${row.code}?`)) return;
    await fetch(`/api/tools/${row.id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>🛠️ Inventário de Ferramentas</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Buscar por código/nome" value={q} onChange={(e) => setQ(e.target.value)} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="disponivel">Disponível</MenuItem>
              <MenuItem value="emprestada">Emprestada</MenuItem>
              <MenuItem value="manutencao">Manutenção</MenuItem>
              <MenuItem value="perdida">Perdida</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setOpen(true); }}>Cadastrar</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Integrações</Typography>
              <Box sx={{ mt: 1, display: 'grid', gap: 1 }}>
                <Link href="/frota/ordens">🔧 Ordens de Serviço</Link>
                <Link href="/frota/estoque">📦 Estoque de Peças</Link>
                <Link href="/frota/pedidos">🧾 Pedidos/Compras</Link>
                <Link href="/supergestor">🧠 Super Gestor (IA)</Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Condição</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Responsável</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>
                      <Chip size="small" label={row.status} color={row.status === 'disponivel' ? 'success' : row.status === 'manutencao' ? 'warning' : row.status === 'emprestada' ? 'primary' : 'default'} />
                    </TableCell>
                    <TableCell>{row.condition}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.assigned_to}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar"><IconButton onClick={() => { setEditing(row); setOpen(true); }}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Excluir"><IconButton color="error" onClick={() => onDelete(row)}><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <FerramentaDialog open={open} onClose={() => setOpen(false)} editing={editing} onSave={onSave} />
    </Box>
  );
}

function FerramentaDialog({ open, onClose, editing, onSave }: { open: boolean; onClose: () => void; editing: Tool | null; onSave: (t: Tool) => void; }) {
  const [form, setForm] = useState<Tool>({
    code: '', name: '', category: '', status: 'disponivel', condition: 'boa', location: '', assigned_to: '', purchase_price: undefined, purchase_date: '', last_os_id: undefined, notes: ''
  });

  useEffect(() => {
    if (editing) setForm({ ...editing });
    else setForm({ code: '', name: '', category: '', status: 'disponivel', condition: 'boa', location: '', assigned_to: '', purchase_price: undefined, purchase_date: '', last_os_id: undefined, notes: '' });
  }, [editing, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editing ? 'Editar Ferramenta' : 'Cadastrar Ferramenta'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}><TextField label="Código" fullWidth value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Grid>
          <Grid item xs={12} md={8}><TextField label="Nome" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Categoria" fullWidth value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <MenuItem value="disponivel">Disponível</MenuItem>
                <MenuItem value="emprestada">Emprestada</MenuItem>
                <MenuItem value="manutencao">Manutenção</MenuItem>
                <MenuItem value="perdida">Perdida</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Condição</InputLabel>
              <Select value={form.condition} label="Condição" onChange={(e) => setForm({ ...form, condition: e.target.value as any })}>
                <MenuItem value="nova">Nova</MenuItem>
                <MenuItem value="boa">Boa</MenuItem>
                <MenuItem value="reparo">Reparo</MenuItem>
                <MenuItem value="sucata">Sucata</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}><TextField label="Local" fullWidth value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Responsável (email/nome)" fullWidth value={form.assigned_to || ''} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Vincular OS (ID)" type="number" fullWidth value={form.last_os_id || ''} onChange={(e) => setForm({ ...form, last_os_id: Number(e.target.value) })} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Data de Compra" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.purchase_date || ''} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Valor de Compra" type="number" fullWidth value={form.purchase_price || ''} onChange={(e) => setForm({ ...form, purchase_price: Number(e.target.value) })} /></Grid>
          <Grid item xs={12}><TextField label="Observações" fullWidth multiline rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)}>{editing ? 'Salvar' : 'Cadastrar'}</Button>
      </DialogActions>
    </Dialog>
  );
}
