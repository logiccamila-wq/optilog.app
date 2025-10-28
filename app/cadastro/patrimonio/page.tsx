'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, MenuItem } from '@mui/material';
import Card from '@/components/ui/card';

export default function CadastroPatrimonioPage() {
  const [patrimonio, setPatrimonio] = useState([
    { id: 'PAT-001', tipo: 'Máquina', nome: 'Compressor de Ar 60L', valorAquisicao: 8500, dataAquisicao: '2023-05-15', vidaUtil: 10, depreciacaoAnual: 850, valorResidual: 7650, localizacao: 'Oficina' },
    { id: 'PAT-002', tipo: 'Equipamento', nome: 'Elevador Hidráulico 4T', valorAquisicao: 25000, dataAquisicao: '2022-03-10', vidaUtil: 15, depreciacaoAnual: 1667, valorResidual: 21667, localizacao: 'Oficina' },
  ]);

  const totalPatrimonio = patrimonio.length;
  const valorTotal = patrimonio.reduce((acc, p) => acc + p.valorResidual, 0);
  const depreciacaoAnual = patrimonio.reduce((acc, p) => acc + p.depreciacaoAnual, 0);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">🏭 Cadastro de Patrimônio</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Itens"><div style={{ fontSize: 28, fontWeight: 700 }}>{totalPatrimonio}</div></Card>
        <Card title="Valor Atual"><div style={{ fontSize: 24, fontWeight: 700 }}>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
        <Card title="Depreciação Anual"><div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>R$ {depreciacaoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
      </Box>

      {/* Formulário */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#f9fafb' }}>
        <TextField label="Tipo" select><MenuItem value="Máquina">Máquina</MenuItem><MenuItem value="Equipamento">Equipamento</MenuItem><MenuItem value="Veículo">Veículo</MenuItem><MenuItem value="Imóvel">Imóvel</MenuItem><MenuItem value="Móveis">Móveis</MenuItem><MenuItem value="TI">TI/Informática</MenuItem></TextField>
        <TextField label="Nome/Descrição" placeholder="Compressor de Ar 60L" />
        <TextField label="Valor Aquisição (R$)" type="number" placeholder="8500.00" />
        <TextField label="Data Aquisição" type="date" InputLabelProps={{ shrink: true }} />
        <TextField label="Vida Útil (anos)" type="number" placeholder="10" />
        <TextField label="Localização" placeholder="Oficina" />
        <TextField label="Número Série" placeholder="SN123456" />
        <TextField label="Fornecedor" placeholder="Equipamentos Ltda" />
        <Box sx={{ gridColumn: '1 / -1' }}><Button variant="contained" fullWidth>Cadastrar Patrimônio</Button></Box>
      </Box>

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Tipo</strong></TableCell>
            <TableCell><strong>Nome</strong></TableCell>
            <TableCell><strong>Valor Aquisição</strong></TableCell>
            <TableCell><strong>Data Aquisição</strong></TableCell>
            <TableCell><strong>Depreciação Anual</strong></TableCell>
            <TableCell><strong>Valor Residual</strong></TableCell>
            <TableCell><strong>Localização</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patrimonio.map(p => (
            <TableRow key={p.id}>
              <TableCell><strong>{p.id}</strong></TableCell>
              <TableCell>{p.tipo}</TableCell>
              <TableCell>{p.nome}</TableCell>
              <TableCell>R$ {p.valorAquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>{new Date(p.dataAquisicao).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell style={{ color: '#f59e0b' }}>R$ {p.depreciacaoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell style={{ fontWeight: 700 }}>R$ {p.valorResidual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>{p.localizacao}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
