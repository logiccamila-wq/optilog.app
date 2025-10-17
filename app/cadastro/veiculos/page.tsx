"use client";
import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { getDb } from '@/lib/firebaseClient';

export default function CadastroVeiculosPage() {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [odometer, setOdometer] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      const db = await getDb();
      if (!db) throw new Error('Firestore não configurado. Preencha NEXT_PUBLIC_FIREBASE_* no .env.local.');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const ref = await addDoc(collection(db, 'veiculos'), {
        plate,
        modelo: model,
        year: typeof year === 'number' ? year : null,
        odometer: typeof odometer === 'number' ? odometer : null,
        status: 'active',
        created_at: Date.now(),
        created_server: serverTimestamp(),
      });
      setOk(`Veículo cadastrado: ${ref.id}`);
      setPlate(''); setModel(''); setYear(''); setOdometer('');
    } catch (err: any) {
      setError(err?.message || 'Falha ao salvar veículo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">Cadastro de Veículos</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">Coleção: veiculos</Typography>
      </Paper>
      {error && <Alert severity="error">{error}</Alert>}
      {ok && <Alert severity="success">{ok}</Alert>}
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
        <TextField label="Placa" value={plate} onChange={(e) => setPlate(e.target.value)} required />
        <TextField label="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
        <TextField label="Ano" type="number" value={year} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')} />
        <TextField label="Hodômetro" type="number" value={odometer} onChange={(e) => setOdometer(e.target.value ? Number(e.target.value) : '')} />
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Veículo'}
        </Button>
      </Box>
    </main>
  );
}