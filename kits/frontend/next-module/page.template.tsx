'use client';
import { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { apiFetch } from '@/utils/api';

export default function NovaFeaturePage() {
  const [items, setItems] = useState<Array<{ id: string; name?: string; status?: string }>>([]);
  const [newItem, setNewItem] = useState<{ name: string }>({ name: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const data = await apiFetch('/items'); setItems(data || []); } catch {}
  };
  const add = async () => {
    if (!newItem.name.trim()) return;
    setSaving(true);
    try { const created = await apiFetch('/items', { method: 'POST', body: JSON.stringify({ name: newItem.name }) });
      setItems((prev) => [created, ...prev]); setNewItem({ name: '' }); } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Nova Feature</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <TextField size='small' label='Nome' value={newItem.name} onChange={(e) => setNewItem({ name: e.target.value })} />
        <Button variant='contained' onClick={add} disabled={saving}>Adicionar</Button>
        <Button variant='outlined' onClick={load}>Atualizar</Button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.id}</TableCell>
                <TableCell>{it.name || '-'}</TableCell>
                <TableCell>{it.status || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}