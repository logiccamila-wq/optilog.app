'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, MenuItem } from '@mui/material';
import Card from '@/components/ui/card';

export default function CadastroCustosFixosPage() {
  const [custos, setCustos] = useState([
    { id: 1, tipo: 'Aluguel', descricao: 'Galpão Principal', valorMensal: 8500, vencimento: 10, categoria: 'Instalações', fornecedor: 'Imobiliária Central' },
    { id: 2, tipo: 'Energia', descricao: 'Conta de luz', valorMensal: 2800, vencimento: 15, categoria: 'Utilidades', fornecedor: 'CPFL' },
    { id: 3, tipo: 'Telefonia/Internet', descricao: 'Link 500Mbps', valorMensal: 450, vencimento: 5, categoria: 'Comunicação', fornecedor: 'Vivo Empresas' },
  ]);

  const totalMensal = custos.reduce((acc, c) => acc + c.valorMensal, 0);
  const totalAnual = totalMensal * 12;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">💰 Cadastro de Custos Fixos</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Custos"><div style={{ fontSize: 28, fontWeight: 700 }}>{custos.length}</div></Card>
        <Card title="Total Mensal"><div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>R$ {totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
        <Card title="Total Anual"><div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>R$ {totalAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
      </Box>

      {/* Formulário */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#f9fafb' }}>
        <TextField label="Tipo" select><MenuItem value="Aluguel">Aluguel</MenuItem><MenuItem value="Energia">Energia</MenuItem><MenuItem value="Água">Água</MenuItem><MenuItem value="Telefonia/Internet">Telefonia/Internet</MenuItem><MenuItem value="Seguros">Seguros</MenuItem><MenuItem value="Impostos">Impostos</MenuItem><MenuItem value="Taxas Bancárias">Taxas Bancárias</MenuItem><MenuItem value="Softwares/Sistemas">Softwares/Sistemas</MenuItem></TextField>
        <TextField label="Descrição" placeholder="Galpão Principal" />
        <TextField label="Valor Mensal (R$)" type="number" placeholder="8500.00" />
        <TextField label="Dia Vencimento" type="number" placeholder="10" inputProps={{ min: 1, max: 31 }} />
        <TextField label="Categoria" placeholder="Instalações" />
        <TextField label="Fornecedor/Credor" placeholder="Imobiliária Central" />
        <Box sx={{ gridColumn: '1 / -1' }}><Button variant="contained" fullWidth>Cadastrar Custo Fixo</Button></Box>
      </Box>

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>Tipo</strong></TableCell>
            <TableCell><strong>Descrição</strong></TableCell>
            <TableCell><strong>Valor Mensal</strong></TableCell>
            <TableCell><strong>Valor Anual</strong></TableCell>
            <TableCell><strong>Vencimento</strong></TableCell>
            <TableCell><strong>Categoria</strong></TableCell>
            <TableCell><strong>Fornecedor</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {custos.map(c => (
            <TableRow key={c.id}>
              <TableCell><strong>{c.tipo}</strong></TableCell>
              <TableCell>{c.descricao}</TableCell>
              <TableCell style={{ fontWeight: 700, color: '#dc2626' }}>R$ {c.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>R$ {(c.valorMensal * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>Dia {c.vencimento}</TableCell>
              <TableCell>{c.categoria}</TableCell>
              <TableCell>{c.fornecedor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Resumo por Categoria */}
      <Box sx={{ p: 3, border: '1px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📊 Resumo por Categoria</Typography>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <div><strong>Instalações:</strong> R$ {custos.filter(c => c.categoria === 'Instalações').reduce((acc, c) => acc + c.valorMensal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
          <div><strong>Utilidades:</strong> R$ {custos.filter(c => c.categoria === 'Utilidades').reduce((acc, c) => acc + c.valorMensal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
          <div><strong>Comunicação:</strong> R$ {custos.filter(c => c.categoria === 'Comunicação').reduce((acc, c) => acc + c.valorMensal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</div>
        </Box>
      </Box>
    </main>
  );
}
