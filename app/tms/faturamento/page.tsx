'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import Card from '@/components/ui/card';

export default function TMSFaturamentoPage() {
  const [faturas, setFaturas] = useState([
    { id: 'FAT-001', cliente: 'Empresa ABC', carga: 'CG-001', valorFrete: 6200, valorICMS: 744, valorTotal: 6944, dataEmissao: '2025-10-28', vencimento: '2025-11-12', status: 'Pendente', nfe: null, cte: 'CT-e 12345' },
    { id: 'FAT-002', cliente: 'Distribuidora XYZ', carga: 'CG-002', valorFrete: 8500, valorICMS: 1020, valorTotal: 9520, dataEmissao: '2025-10-27', vencimento: '2025-11-11', status: 'Paga', nfe: 'NF-e 67890', cte: 'CT-e 12346' },
  ]);

  const totalFaturas = faturas.length;
  const valorTotal = faturas.reduce((acc, f) => acc + f.valorTotal, 0);
  const pendentes = faturas.filter(f => f.status === 'Pendente').length;
  const valorPendente = faturas.filter(f => f.status === 'Pendente').reduce((acc, f) => acc + f.valorTotal, 0);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">💳 TMS - Faturamento</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Faturas"><div style={{ fontSize: 28, fontWeight: 700 }}>{totalFaturas}</div></Card>
        <Card title="Valor Total"><div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
        <Card title="Pendentes"><div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{pendentes}</div></Card>
        <Card title="Valor Pendente"><div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>R$ {valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
      </Box>

      {/* Geração NF-e / CT-e */}
      <Box sx={{ p: 3, border: '1px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📄 Geração de Documentos Fiscais</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <TextField label="Cliente" placeholder="Empresa ABC" />
          <TextField label="Carga" placeholder="CG-001" />
          <TextField label="Valor Frete (R$)" type="number" placeholder="6200.00" />
          <TextField label="Alíquota ICMS (%)" type="number" defaultValue={12} />
          <TextField label="Vencimento" type="date" InputLabelProps={{ shrink: true }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" fullWidth>Gerar CT-e</Button>
          <Button variant="contained" fullWidth color="success">Gerar NF-e</Button>
          <Button variant="outlined" fullWidth>Gerar MDF-e</Button>
        </Box>
      </Box>

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>Carga</strong></TableCell>
            <TableCell><strong>Frete</strong></TableCell>
            <TableCell><strong>ICMS</strong></TableCell>
            <TableCell><strong>Total</strong></TableCell>
            <TableCell><strong>Emissão</strong></TableCell>
            <TableCell><strong>Vencimento</strong></TableCell>
            <TableCell><strong>NF-e</strong></TableCell>
            <TableCell><strong>CT-e</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {faturas.map(f => (
            <TableRow key={f.id} sx={{ backgroundColor: f.status === 'Pendente' ? '#fffbeb' : 'transparent' }}>
              <TableCell><strong>{f.id}</strong></TableCell>
              <TableCell>{f.cliente}</TableCell>
              <TableCell>{f.carga}</TableCell>
              <TableCell>R$ {f.valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>R$ {f.valorICMS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell style={{ fontWeight: 700 }}>R$ {f.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>{new Date(f.dataEmissao).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{new Date(f.vencimento).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{f.nfe ? <Chip label={f.nfe} size="small" color="success" /> : <Button size="small" variant="outlined">Gerar</Button>}</TableCell>
              <TableCell><Chip label={f.cte} size="small" color="primary" /></TableCell>
              <TableCell><Chip label={f.status} size="small" color={f.status === 'Paga' ? 'success' : 'warning'} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Conciliação Bancária */}
      <Box sx={{ p: 3, border: '1px solid #10b981', borderRadius: 2, backgroundColor: '#f0fdf4' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>🏦 Conciliação Bancária</Typography>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <div><strong>Recebimentos Confirmados:</strong> R$ 9.520,00</div>
          <div style={{ color: '#f59e0b' }}><strong>Aguardando Pagamento:</strong> R$ 6.944,00</div>
          <div style={{ color: '#dc2626' }}><strong>Inadimplência:</strong> R$ 0,00</div>
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 2 }} color="success">Importar Extrato Bancário (OFX)</Button>
      </Box>
    </main>
  );
}
