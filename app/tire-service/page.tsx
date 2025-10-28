'use client';
import { useState } from 'react';
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, TextField } from '@mui/material';
import Card from '@/components/ui/card';

export default function TireServicePage() {
  const [pneus, setPneus] = useState([
    { id: 'PN-001', numero: '001', veiculo: 'ABC1234', posicao: 'Dianteiro Esq', marca: 'Pirelli', modelo: 'TH88', medida: '295/80R22.5', pressaoIdeal: 120, pressaoAtual: 115, vidaUtil: 80000, kmAtual: 45000, recapagens: 0, status: 'Em uso' },
    { id: 'PN-002', numero: '002', veiculo: 'ABC1234', posicao: 'Dianteiro Dir', marca: 'Michelin', modelo: 'X Multi', medida: '295/80R22.5', pressaoIdeal: 120, pressaoAtual: 90, vidaUtil: 80000, kmAtual: 52000, recapagens: 1, status: 'Alerta' },
  ]);

  const emUso = pneus.filter(p => p.status === 'Em uso').length;
  const alerta = pneus.filter(p => p.status === 'Alerta').length;
  const vidaMedia = pneus.reduce((acc, p) => acc + ((p.vidaUtil - p.kmAtual) / p.vidaUtil * 100), 0) / pneus.length;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4">🔩 Portal Borracheiro</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Pneus em Uso"><div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{emUso}</div></Card>
        <Card title="Alertas"><div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{alerta}</div></Card>
        <Card title="Total Pneus"><div style={{ fontSize: 32, fontWeight: 700 }}>{pneus.length}</div></Card>
        <Card title="Vida Média"><div style={{ fontSize: 32, fontWeight: 700 }}>{vidaMedia.toFixed(0)}%</div></Card>
      </Box>

      {/* Gestão de Pneus */}
      <Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>🛞 Gestão de Pneus</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Veículo</strong></TableCell>
              <TableCell><strong>Posição</strong></TableCell>
              <TableCell><strong>Marca/Modelo</strong></TableCell>
              <TableCell><strong>Pressão</strong></TableCell>
              <TableCell><strong>Vida Útil</strong></TableCell>
              <TableCell><strong>Recapagens</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pneus.map(p => {
              const vidaPercent = ((p.vidaUtil - p.kmAtual) / p.vidaUtil * 100);
              const pressaoPercent = (p.pressaoAtual / p.pressaoIdeal * 100);
              return (
                <TableRow key={p.id}>
                  <TableCell><strong>{p.id}</strong></TableCell>
                  <TableCell>{p.veiculo}</TableCell>
                  <TableCell>{p.posicao}</TableCell>
                  <TableCell>{p.marca} {p.modelo}<br /><small>{p.medida}</small></TableCell>
                  <TableCell style={{ color: pressaoPercent < 90 ? '#dc2626' : '#10b981' }}>
                    {p.pressaoAtual} / {p.pressaoIdeal} psi<br />
                    <small>{pressaoPercent.toFixed(0)}%</small>
                  </TableCell>
                  <TableCell>
                    {p.kmAtual.toLocaleString('pt-BR')} / {p.vidaUtil.toLocaleString('pt-BR')} km<br />
                    <small style={{ color: vidaPercent < 20 ? '#dc2626' : '#10b981' }}>{vidaPercent.toFixed(0)}% restante</small>
                  </TableCell>
                  <TableCell>{p.recapagens}x</TableCell>
                  <TableCell><Chip label={p.status} size="small" color={p.status === 'Alerta' ? 'warning' : 'success'} /></TableCell>
                  <TableCell><Button variant="contained" size="small">Calibrar</Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      {/* Registro de Recapagem */}
      <Box sx={{ p: 3, border: '1px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>♻️ Registro de Recapagem</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <TextField label="ID do Pneu" placeholder="PN-001" />
          <TextField label="Tipo" select SelectProps={{ native: true }}>
            <option>Recapagem</option>
            <option>Recauchutagem</option>
            <option>Remoldagem</option>
          </TextField>
          <TextField label="Custo (R$)" type="number" placeholder="280.00" />
          <TextField label="Data" type="date" InputLabelProps={{ shrink: true }} />
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>Registrar Recapagem</Button>
      </Box>
    </main>
  );
}
