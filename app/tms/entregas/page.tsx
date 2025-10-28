'use client';
import { useState } from 'react';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, TextField } from '@mui/material';
import Card from '@/components/ui/card';

export default function TMSEntregasPage() {
  const [entregas, setEntregas] = useState([
    { id: 'ENT-001', carga: 'CG-001', cliente: 'Empresa ABC', endereco: 'Rua A, 123 - RJ', previsao: '2025-10-29 14:00', status: 'Em trânsito', pod: null, nps: null, motorista: 'João Silva', veiculo: 'ABC1234' },
    { id: 'ENT-002', carga: 'CG-002', cliente: 'Distribuidora XYZ', endereco: 'Av. B, 456 - MG', previsao: '2025-10-30 10:00', status: 'Concluída', pod: 'Assinado', nps: 5, motorista: 'Maria Santos', veiculo: 'DEF5678' },
  ]);

  const totalEntregas = entregas.length;
  const concluidas = entregas.filter(e => e.status === 'Concluída').length;
  const emTransito = entregas.filter(e => e.status === 'Em trânsito').length;
  const npsMedia = entregas.filter(e => e.nps).reduce((acc, e) => acc + (e.nps || 0), 0) / entregas.filter(e => e.nps).length || 0;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">🚚 TMS - Gestão de Entregas</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Entregas"><div style={{ fontSize: 28, fontWeight: 700 }}>{totalEntregas}</div></Card>
        <Card title="Em Trânsito"><div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>{emTransito}</div></Card>
        <Card title="Concluídas"><div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{concluidas}</div></Card>
        <Card title="NPS Médio"><div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{npsMedia.toFixed(1)} ⭐</div></Card>
      </Box>

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>Endereço</strong></TableCell>
            <TableCell><strong>Previsão</strong></TableCell>
            <TableCell><strong>Motorista</strong></TableCell>
            <TableCell><strong>Veículo</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>PoD</strong></TableCell>
            <TableCell><strong>NPS</strong></TableCell>
            <TableCell><strong>Ações</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entregas.map(e => (
            <TableRow key={e.id}>
              <TableCell><strong>{e.id}</strong></TableCell>
              <TableCell>{e.cliente}</TableCell>
              <TableCell><small>{e.endereco}</small></TableCell>
              <TableCell>{new Date(e.previsao).toLocaleString('pt-BR')}</TableCell>
              <TableCell>{e.motorista}</TableCell>
              <TableCell>{e.veiculo}</TableCell>
              <TableCell><Chip label={e.status} size="small" color={e.status === 'Concluída' ? 'success' : 'info'} /></TableCell>
              <TableCell>{e.pod ? <Chip label={e.pod} size="small" color="success" /> : '—'}</TableCell>
              <TableCell>{e.nps ? `${e.nps} ⭐` : '—'}</TableCell>
              <TableCell><Button variant="contained" size="small">Rastrear</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PoD Digital */}
      <Box sx={{ p: 3, border: '1px solid #10b981', borderRadius: 2, backgroundColor: '#f0fdf4' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📸 Registro PoD Digital</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <TextField label="ID Entrega" placeholder="ENT-001" />
          <TextField label="Recebedor" placeholder="João da Silva" />
          <TextField label="CPF Recebedor" placeholder="000.000.000-00" />
          <TextField label="Data/Hora Entrega" type="datetime-local" InputLabelProps={{ shrink: true }} />
        </Box>
        <Box sx={{ mt: 2, p: 2, border: '2px dashed #10b981', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>📷 Foto da Entrega + Assinatura Digital</Typography>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>Upload Foto</Button>
          <Button variant="outlined" size="small">Capturar Assinatura</Button>
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 2 }} color="success">✅ Confirmar Entrega</Button>
      </Box>

      {/* NPS */}
      <Box sx={{ p: 3, border: '1px solid #f59e0b', borderRadius: 2, backgroundColor: '#fffbeb' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>⭐ Avaliação NPS - Cliente</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Como foi sua experiência com a entrega?</Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <Button key={n} variant="outlined" sx={{ minWidth: 60 }}>{n} ⭐</Button>
          ))}
        </Box>
      </Box>
    </main>
  );
}
