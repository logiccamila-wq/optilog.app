'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import Card from '@/components/ui/card';

export default function TMSCargasPage() {
  const [cargas, setCargas] = useState([
    { id: 'CG-001', cliente: 'Empresa ABC', produto: 'Eletrônicos', peso: 12000, volume: 45, cubagem: 65, veiculoIdeal: 'Toco', valorFrete: 6200, origem: 'São Paulo, SP', destino: 'Rio de Janeiro, RJ', status: 'Pendente' },
    { id: 'CG-002', cliente: 'Distribuidora XYZ', produto: 'Alimentos', peso: 23000, volume: 80, cubagem: 95, veiculoIdeal: 'Trucado', valorFrete: 8500, origem: 'Campinas, SP', destino: 'Belo Horizonte, MG', status: 'Alocada' },
  ]);

  const totalCargas = cargas.length;
  const pesoTotal = cargas.reduce((acc, c) => acc + c.peso, 0);
  const valorTotal = cargas.reduce((acc, c) => acc + c.valorFrete, 0);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">📦 TMS - Gestão de Cargas</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Cargas"><div style={{ fontSize: 28, fontWeight: 700 }}>{totalCargas}</div></Card>
        <Card title="Peso Total"><div style={{ fontSize: 24, fontWeight: 700 }}>{pesoTotal.toLocaleString('pt-BR')} kg</div></Card>
        <Card title="Valor Total"><div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
        <Card title="Pendentes"><div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{cargas.filter(c => c.status === 'Pendente').length}</div></Card>
      </Box>

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>Produto</strong></TableCell>
            <TableCell><strong>Peso</strong></TableCell>
            <TableCell><strong>Volume (m³)</strong></TableCell>
            <TableCell><strong>Cubagem %</strong></TableCell>
            <TableCell><strong>Veículo Ideal</strong></TableCell>
            <TableCell><strong>Rota</strong></TableCell>
            <TableCell><strong>Valor</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cargas.map(c => (
            <TableRow key={c.id}>
              <TableCell><strong>{c.id}</strong></TableCell>
              <TableCell>{c.cliente}</TableCell>
              <TableCell>{c.produto}</TableCell>
              <TableCell>{c.peso.toLocaleString('pt-BR')} kg</TableCell>
              <TableCell>{c.volume} m³</TableCell>
              <TableCell style={{ color: c.cubagem > 90 ? '#dc2626' : c.cubagem > 75 ? '#f59e0b' : '#10b981' }}>{c.cubagem}%</TableCell>
              <TableCell><Chip label={c.veiculoIdeal} size="small" color="primary" /></TableCell>
              <TableCell><small>{c.origem} → {c.destino}</small></TableCell>
              <TableCell style={{ fontWeight: 700 }}>R$ {c.valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell><Chip label={c.status} size="small" color={c.status === 'Pendente' ? 'warning' : 'success'} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Otimização */}
      <Box sx={{ p: 3, border: '2px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>🤖 Otimização IA - Sugestão de Cargas Combinadas</Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <div style={{ padding: 12, border: '1px solid #3b82f6', borderRadius: 8, backgroundColor: '#fff' }}>
            <strong>Rota Otimizada #1:</strong> Combinar CG-001 + CG-003<br />
            <small>• Mesma região: SP → RJ (economia de R$ 1.200 em frete)</small><br />
            <small>• Peso combinado: 18.000 kg (dentro do limite Toco 16t com margem)</small><br />
            <small>• Cubagem: 75% (otimizado)</small><br />
            <Button variant="contained" size="small" sx={{ mt: 1 }}>Aplicar Combinação</Button>
          </div>
        </Box>
      </Box>
    </main>
  );
}
