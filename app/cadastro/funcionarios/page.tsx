'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import Card from '@/components/ui/card';

export default function CadastroFuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, nome: 'João Silva', cpf: '123.456.789-00', cargo: 'Motorista', departamento: 'Operações', salario: 3500, admissao: '2023-01-15', tipoVinculo: 'CLT', status: 'Ativo' },
    { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00', cargo: 'Mecânico', departamento: 'Manutenção', salario: 4200, admissao: '2022-06-10', tipoVinculo: 'CLT', status: 'Ativo' },
  ]);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [salario, setSalario] = useState<number | ''>('');
  const [admissao, setAdmissao] = useState('');
  const [tipoVinculo, setTipoVinculo] = useState('CLT');
  const [beneficios, setBeneficios] = useState('');

  const calcularEncargos = (sal: number) => {
    const inss = sal * 0.08; // 8% empresa
    const fgts = sal * 0.08; // 8%
    const ferias = sal / 12; // 1/12
    const decimoTerceiro = sal / 12; // 1/12
    const total = sal + inss + fgts + ferias + decimoTerceiro;
    return { inss, fgts, ferias, decimoTerceiro, total };
  };

  const encargos = salario ? calcularEncargos(Number(salario)) : null;
  const totalFolha = funcionarios.reduce((acc, f) => acc + calcularEncargos(f.salario).total, 0);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <Typography variant="h4">💼 Cadastro de Funcionários / RH</Typography>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card title="Total Funcionários"><div style={{ fontSize: 28, fontWeight: 700 }}>{funcionarios.length}</div></Card>
        <Card title="Ativos"><div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{funcionarios.filter(f => f.status === 'Ativo').length}</div></Card>
        <Card title="Folha Mensal"><div style={{ fontSize: 24, fontWeight: 700 }}>R$ {totalFolha.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
        <Card title="Custo Anual"><div style={{ fontSize: 24, fontWeight: 700 }}>R$ {(totalFolha * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></Card>
      </Box>

      {/* Formulário */}
      <Box component="form" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, p: 3, border: '1px solid #e5e7eb', borderRadius: 2, backgroundColor: '#f9fafb' }}>
        <TextField label="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <TextField label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required />
        <TextField label="Cargo" select value={cargo} onChange={(e) => setCargo(e.target.value)} required>
          <MenuItem value="Motorista">Motorista</MenuItem>
          <MenuItem value="Mecânico">Mecânico</MenuItem>
          <MenuItem value="Borracheiro">Borracheiro</MenuItem>
          <MenuItem value="Administrativo">Administrativo</MenuItem>
          <MenuItem value="Gerente">Gerente</MenuItem>
          <MenuItem value="Auxiliar">Auxiliar</MenuItem>
        </TextField>
        <TextField label="Departamento" select value={departamento} onChange={(e) => setDepartamento(e.target.value)} required>
          <MenuItem value="Operações">Operações</MenuItem>
          <MenuItem value="Manutenção">Manutenção</MenuItem>
          <MenuItem value="Administrativo">Administrativo</MenuItem>
          <MenuItem value="Financeiro">Financeiro</MenuItem>
          <MenuItem value="Comercial">Comercial</MenuItem>
        </TextField>
        <TextField label="Salário (R$)" type="number" value={salario} onChange={(e) => setSalario(e.target.value ? Number(e.target.value) : '')} required />
        <TextField label="Data Admissão" type="date" value={admissao} onChange={(e) => setAdmissao(e.target.value)} InputLabelProps={{ shrink: true }} required />
        <TextField label="Tipo Vínculo" select value={tipoVinculo} onChange={(e) => setTipoVinculo(e.target.value)}>
          <MenuItem value="CLT">CLT</MenuItem>
          <MenuItem value="PJ">PJ</MenuItem>
          <MenuItem value="Autônomo">Autônomo</MenuItem>
          <MenuItem value="Temporário">Temporário</MenuItem>
        </TextField>
        <TextField label="Benefícios (VA/VR/Plano)" value={beneficios} onChange={(e) => setBeneficios(e.target.value)} placeholder="R$ 800/mês" />
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Button variant="contained" fullWidth>Cadastrar Funcionário</Button>
        </Box>
      </Box>

      {/* Encargos Calculados */}
      {encargos && (
        <Box sx={{ p: 3, border: '1px solid #3b82f6', borderRadius: 2, backgroundColor: '#eff6ff' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📊 Encargos Calculados (Mensal)</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
            <div><strong>Salário Base:</strong> R$ {Number(salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div><strong>INSS (8%):</strong> R$ {encargos.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div><strong>FGTS (8%):</strong> R$ {encargos.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div><strong>Férias (1/12):</strong> R$ {encargos.ferias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div><strong>13º (1/12):</strong> R$ {encargos.decimoTerceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div style={{ gridColumn: '1 / -1', fontSize: 20, fontWeight: 700, color: '#dc2626' }}>
              <strong>CUSTO TOTAL MENSAL:</strong> R$ {encargos.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </Box>
        </Box>
      )}

      {/* Tabela */}
      <Table sx={{ border: '1px solid #e5e7eb' }}>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>Nome</strong></TableCell>
            <TableCell><strong>CPF</strong></TableCell>
            <TableCell><strong>Cargo</strong></TableCell>
            <TableCell><strong>Departamento</strong></TableCell>
            <TableCell><strong>Salário</strong></TableCell>
            <TableCell><strong>Custo Total</strong></TableCell>
            <TableCell><strong>Admissão</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funcionarios.map(f => {
            const enc = calcularEncargos(f.salario);
            return (
              <TableRow key={f.id}>
                <TableCell>{f.nome}</TableCell>
                <TableCell>{f.cpf}</TableCell>
                <TableCell>{f.cargo}</TableCell>
                <TableCell>{f.departamento}</TableCell>
                <TableCell>R$ {f.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell style={{ fontWeight: 700, color: '#dc2626' }}>R$ {enc.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{new Date(f.admissao).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell><Chip label={f.status} color={f.status === 'Ativo' ? 'success' : 'default'} size="small" /></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
