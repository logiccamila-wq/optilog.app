'use client';
import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, MenuItem } from '@mui/material';
import Card from '@/components/ui/card';

export default function CadastroPecasPage() {
  const [pecas, setPecas] = useState([
    { id: 'P-001', codigo: 'OL-15W40', nome: 'Óleo 15W40 20L', categoria: 'Lubrificantes', fabricante: 'Shell', aplicacao: 'Todos', estoqueMin: 10, estoqueMax: 50, estoqueAtual: 25, custoMedio: 250, fornecedor: 'Auto Peças SP', garantia: '12 meses' },
    { id: 'P-002', codigo: 'FT-001', nome: 'Filtro de óleo', categoria: 'Filtros', fabricante: 'Tecfil', aplicacao: 'Scania/Volvo', estoqueMin: 20, estoqueMax: 100, estoqueAtual: 15, custoMedio: 45, fornecedor: 'Distribuidora ABC', garantia: '6 meses' },
  ]);

  const totalPecas = pecas.length;
  const valorEstoque = pecas.reduce((acc, p) => acc + (p.estoqueAtual * p.custoMedio), 0);
  const abaixoMinimo = pecas.filter(p => p.estoqueAtual < p.estoqueMin).length;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">🔩 Cadastro de Peças</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Peças"><div style={{ fontSize: 28, fontWeight: 700 }}>{totalPecas}</div></Card>
        <Card title="Valor Estoque"><div style={{ fontSize: 24, fontWeight: 700 }}>R$ {valorEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
        <Card title="Abaixo Mínimo"><div style={{ fontSize: 28, fontWeight: 700, color: '#dc2626' }}>{abaixoMinimo}</div></Card>
      </Box>

      {/* Formulário */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#f9fafb' }}>
        <TextField label="Código" placeholder="P-001" />
        <TextField label="Nome da Peça" placeholder="Filtro de óleo" />
        <TextField label="Categoria" select><MenuItem value="Lubrificantes">Lubrificantes</MenuItem><MenuItem value="Filtros">Filtros</MenuItem><MenuItem value="Freios">Freios</MenuItem><MenuItem value="Pneus">Pneus</MenuItem></TextField>
        <TextField label="Fabricante" placeholder="Tecfil" />
        <TextField label="Aplicação" placeholder="Scania/Volvo" />
        <TextField label="Estoque Mínimo" type="number" defaultValue={10} />
        <TextField label="Estoque Máximo" type="number" defaultValue={50} />
        <TextField label="Estoque Atual" type="number" defaultValue={0} />
        <TextField label="Custo Médio (R$)" type="number" placeholder="45.00" />
        <TextField label="Fornecedor" placeholder="Auto Peças SP" />
        <TextField label="Garantia" placeholder="12 meses" />
        <Box sx={{ gridColumn: '1 / -1' }}><Button variant="contained" fullWidth>Cadastrar Peça</Button></Box>
      </Box>

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>Código</strong></TableCell>
            <TableCell><strong>Nome</strong></TableCell>
            <TableCell><strong>Categoria</strong></TableCell>
            <TableCell><strong>Fabricante</strong></TableCell>
            <TableCell><strong>Estoque</strong></TableCell>
            <TableCell><strong>Custo</strong></TableCell>
            <TableCell><strong>Valor Total</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pecas.map(p => (
            <TableRow key={p.id} sx={{ backgroundColor: p.estoqueAtual < p.estoqueMin ? '#fee2e2' : 'transparent' }}>
              <TableCell><strong>{p.codigo}</strong></TableCell>
              <TableCell>{p.nome}</TableCell>
              <TableCell>{p.categoria}</TableCell>
              <TableCell>{p.fabricante}</TableCell>
              <TableCell>{p.estoqueAtual} / {p.estoqueMax} {p.estoqueAtual < p.estoqueMin && <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ Baixo</span>}</TableCell>
              <TableCell>R$ {p.custoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell style={{ fontWeight: 700 }}>R$ {(p.estoqueAtual * p.custoMedio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
