'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { getDb } from '@/lib/firebaseClient';

export default function CadastroMotoristasPage() {
  const [name, setName] = useState('');
  const [cnh, setCnh] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      // Firestore removido deste projeto: cadastro desativado
      await getDb();
      throw new Error('Cadastro de motoristas desativado (Firebase removido).');
    } catch (err: any) {
      setError(err?.message || 'Falha ao salvar motorista.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">Cadastro de Motoristas</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">Coleção: motoristas</Typography>
      </Paper>
      {error && <Alert severity="error">{error}</Alert>}
      {ok && <Alert severity="success">{ok}</Alert>}
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
        <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="CNH" value={cnh} onChange={(e) => setCnh(e.target.value)} required />
        <TextField label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Motorista'}
        </Button>
      </Box>
    </main>
  );
}
