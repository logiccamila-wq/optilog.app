'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Snackbar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import Card from '@/components/ui/card';

export default function CadastroMotoristasPage() {
  const [name, setName] = useState('');
  const [cnh, setCnh] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);
  const load = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(
        `/api/drivers?page=${page}&pageSize=${pageSize}${search ? `&q=${encodeURIComponent(search)}` : ''}`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Falha ao carregar motoristas.');
      const data = await res.json();
      const countHeader = res.headers.get('X-Total-Count');
      const count = countHeader ? parseInt(countHeader, 10) : Array.isArray(data) ? data.length : 0;
      setTotalCount(Number.isFinite(count) ? count : 0);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, pageSize]);

  const startEdit = (v: any) => {
    setEditingId(v.id);
    setName(v.name || '');
    setCnh(v.cnh || '');
    setPhone(v.phone || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setCnh('');
    setPhone('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/drivers/${editingId}` : '/api/drivers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cnh, phone }),
      });
      if (!res.ok) {
        let msg = editingId ? 'Falha ao atualizar motorista.' : 'Falha ao salvar motorista.';
        try {
          const data = await res.json();
          msg = data?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      setOk(editingId ? 'Motorista atualizado com sucesso!' : 'Motorista cadastrado com sucesso!');
      cancelEdit();
      await load();
    } catch (err: any) {
      setError(
        err?.message || (editingId ? 'Falha ao atualizar motorista.' : 'Falha ao salvar motorista.')
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Excluir este motorista?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let msg = 'Falha ao excluir motorista.';
        try {
          const data = await res.json();
          msg = data?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      setOk('Motorista excluído com sucesso!');
      await load();
    } catch (err: any) {
      setError(err?.message || 'Falha ao excluir motorista.');
    } finally {
      setDeletingId(null);
    }
  };

  // validações cliente
  const cnhDigits = cnh.replace(/\D/g, '');
  const phoneDigits = phone.replace(/\D/g, '');
  const isCnhValid = cnhDigits.length === 11;
  const isPhoneValid = phoneDigits.length === 0 || phoneDigits.length >= 10;
  const canSubmit = !saving && !!name && isCnhValid && isPhoneValid;

  // formatação de telefone (exibição)
  const formatPhone = (digits: string) => {
    const d = (digits || '').replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  // KPIs simples baseados na página atual
  const totalDrivers = list.length;
  const cnhValidCount = list.filter(
    (v) => String(v.cnh || '').replace(/\D/g, '').length === 11
  ).length;
  const phoneFilledCount = list.filter(
    (v) => String(v.phone || '').replace(/\D/g, '').length >= 10
  ).length;
  const createdTodayCount = list.filter((v) => {
    const dt = v.created_at ? new Date(v.created_at) : null;
    if (!dt) return false;
    const today = new Date();
    return dt.toDateString() === today.toDateString();
  }).length;

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">Cadastro de Motoristas</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">Coleção: motoristas</Typography>
      </Paper>

      {/* KPIs */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 2,
        }}
      >
        <Card title="Motoristas (total)" className="">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totalCount}</div>
        </Card>
        <Card title="CNHs válidas">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{cnhValidCount}</div>
        </Card>
        <Card title="Telefones preenchidos">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{phoneFilledCount}</div>
        </Card>
        <Card title="Novos hoje">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{createdTodayCount}</div>
        </Card>
      </Box>

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
        <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField
          label="CNH"
          value={cnh}
          onChange={(e) => setCnh(e.target.value.replace(/\D/g, '').slice(0, 11))}
          inputProps={{ inputMode: 'numeric', maxLength: 11 }}
          required
          error={!!cnh && !isCnhValid}
          helperText={!!cnh && !isCnhValid ? 'CNH deve ter 11 dígitos' : 'Informe apenas números'}
        />
        <TextField
          label="Telefone"
          value={formatPhone(phone)}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
          inputProps={{ inputMode: 'tel', maxLength: 16 }}
          error={!!phone && !isPhoneValid}
          helperText={
            !!phone && !isPhoneValid
              ? 'Telefone inválido (mínimo 10 dígitos)'
              : 'Opcional — formata automaticamente'
          }
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={!canSubmit}>
            {saving
              ? editingId
                ? 'Atualizando...'
                : 'Salvando...'
              : editingId
                ? 'Atualizar Motorista'
                : 'Salvar Motorista'}
          </Button>
          {editingId && (
            <Button onClick={cancelEdit} variant="text" disabled={saving}>
              Cancelar Edição
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 2 }} variant="outlined">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            label="Buscar"
            placeholder="Nome, CNH ou Telefone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <TextField
            size="small"
            type="number"
            label="Itens"
            value={pageSize}
            onChange={(e) => setPageSize(Math.min(100, Math.max(1, Number(e.target.value) || 10)))}
            inputProps={{ min: 1, max: 100 }}
            sx={{ width: 100 }}
          />
          <Typography variant="body2" sx={{ mx: 1 }}>
            Página {page}
          </Typography>
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loadingList || page <= 1}
            variant="outlined"
          >
            Anterior
          </Button>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={loadingList || page * pageSize >= totalCount}
            variant="outlined"
          >
            Próxima
          </Button>
          <Button onClick={load} disabled={loadingList} variant="outlined">
            {loadingList ? 'Atualizando...' : 'Atualizar'}
          </Button>
          {loadingList && <CircularProgress size={18} />}
        </Box>
        {loadingList ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} /> Carregando...
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CNH</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Cadastrado</TableCell>
                <TableCell>Atualizado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.cnh}</TableCell>
                  <TableCell>{v.phone ? formatPhone(String(v.phone)) : '—'}</TableCell>
                  <TableCell>
                    {v.created_at ? new Date(v.created_at).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell>
                    {v.updated_at ? new Date(v.updated_at).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => startEdit(v)}
                        disabled={saving || deletingId === v.id}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => onDelete(v.id)}
                        disabled={deletingId === v.id}
                      >
                        {deletingId === v.id ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && !loadingList && (
                <TableRow>
                  <TableCell colSpan={6}>Nenhum motorista encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Snackbar
        open={!!error || !!ok}
        autoHideDuration={4000}
        onClose={() => {
          setError(null);
          setOk(null);
        }}
      >
        <Alert severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || ok}
        </Alert>
      </Snackbar>
    </main>
  );
}
