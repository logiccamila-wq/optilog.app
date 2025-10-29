'use client';'use client';

import { useState } from 'react';import { useState } from 'react';

import { DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp, Download } from 'lucide-react';import {

  Container,

interface Imposto {  Typography,

  nome: string;  Button,

  periodo: string;  Table,

  baseCalculo: number;  TableBody,

  aliquota: number;  TableCell,

  valor: number;  TableContainer,

  vencimento: string;  TableHead,

  status: 'calculado' | 'pago' | 'pendente' | 'vencido';  TableRow,

  competencia: string;  Paper,

}  Chip,

  IconButton,

export default function ImpostosPage() {  Box,

  const [filtroStatus, setFiltroStatus] = useState<string>('todos');  Grid,

  const [filtroMes, setFiltroMes] = useState<string>('out/2025');  Tabs,

  Tab,

  const impostos: Imposto[] = [} from '@mui/material';

    {import AddIcon from '@mui/icons-material/Add';

      nome: 'ICMS',import EditIcon from '@mui/icons-material/Edit';

      periodo: 'Out/2025',import DownloadIcon from '@mui/icons-material/Download';

      baseCalculo: 250000,import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

      aliquota: 12,

      valor: 30000,interface Tax {

      vencimento: '14/11/2025',  id: number;

      status: 'calculado',  type: string;

      competencia: '2025-10'  period: string;

    },  baseValue: number;

    {  rate: number;

      nome: 'ISS',  taxValue: number;

      periodo: 'Out/2025',  dueDate: string;

      baseCalculo: 180000,  status: 'pending' | 'calculated' | 'paid';

      aliquota: 5,}

      valor: 9000,

      vencimento: '09/11/2025',export default function ImpostosPage() {

      status: 'pago',  const [tab, setTab] = useState(0);

      competencia: '2025-10'  const [taxes] = useState<Tax[]>([

    },    { id: 1, type: 'ICMS', period: 'Out/2025', baseValue: 250000, rate: 12, taxValue: 30000, dueDate: '2025-11-15', status: 'calculated' },

    {    { id: 2, type: 'ISS', period: 'Out/2025', baseValue: 180000, rate: 5, taxValue: 9000, dueDate: '2025-11-10', status: 'paid' },

      nome: 'PIS',    { id: 3, type: 'PIS', period: 'Out/2025', baseValue: 500000, rate: 1.65, taxValue: 8250, dueDate: '2025-11-20', status: 'pending' },

      periodo: 'Out/2025',    { id: 4, type: 'COFINS', period: 'Out/2025', baseValue: 500000, rate: 7.6, taxValue: 38000, dueDate: '2025-11-20', status: 'pending' },

      baseCalculo: 500000,  ]);

      aliquota: 1.65,

      valor: 8250,  const totals = taxes.reduce((acc, t) => {

      vencimento: '19/11/2025',    acc.calculated += t.status === 'calculated' ? t.taxValue : 0;

      status: 'pendente',    acc.paid += t.status === 'paid' ? t.taxValue : 0;

      competencia: '2025-10'    acc.pending += t.status === 'pending' ? t.taxValue : 0;

    },    return acc;

    {  }, { calculated: 0, paid: 0, pending: 0 });

      nome: 'COFINS',

      periodo: 'Out/2025',  const getStatusColor = (status: string) => {

      baseCalculo: 500000,    switch (status) {

      aliquota: 7.6,      case 'paid': return 'success';

      valor: 38000,      case 'calculated': return 'warning';

      vencimento: '19/11/2025',      default: return 'error';

      status: 'pendente',    }

      competencia: '2025-10'  };

    },

    {  const getStatusLabel = (status: string) => {

      nome: 'IRPJ',    switch (status) {

      periodo: 'Set/2025',      case 'paid': return 'Pago';

      baseCalculo: 480000,      case 'calculated': return 'Calculado';

      aliquota: 15,      default: return 'Pendente';

      valor: 7200,    }

      vencimento: '31/10/2025',  };

      status: 'vencido',

      competencia: '2025-09'  return (

    },    <Container maxWidth="xl" sx={{ py: 4 }}>

    {      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>

      nome: 'CSLL',        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

      periodo: 'Set/2025',          <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />

      baseCalculo: 480000,          <Typography variant="h4" sx={{ fontWeight: 700 }}>

      aliquota: 9,            Impostos

      valor: 4320,          </Typography>

      vencimento: '31/10/2025',        </Box>

      status: 'vencido',        <Button variant="contained" startIcon={<AddIcon />}>

      competencia: '2025-09'          Apurar Impostos

    },        </Button>

    {      </Box>

      nome: 'INSS Patronal',

      periodo: 'Out/2025',      <Grid container spacing={2} sx={{ mb: 3 }}>

      baseCalculo: 85000,        <Grid item xs={12} md={4}>

      aliquota: 20,          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>

      valor: 17000,            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Calculado</Typography>

      vencimento: '20/11/2025',            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>

      status: 'pendente',              R$ {totals.calculated.toLocaleString('pt-BR')}

      competencia: '2025-10'            </Typography>

    },          </Paper>

    {        </Grid>

      nome: 'FGTS',        <Grid item xs={12} md={4}>

      periodo: 'Out/2025',          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>

      baseCalculo: 85000,            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pago</Typography>

      aliquota: 8,            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>

      valor: 6800,              R$ {totals.paid.toLocaleString('pt-BR')}

      vencimento: '07/11/2025',            </Typography>

      status: 'calculado',          </Paper>

      competencia: '2025-10'        </Grid>

    }        <Grid item xs={12} md={4}>

  ];          <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Pendente</Typography>

  const filtrados = impostos.filter(imp => {            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mt: 1 }}>

    if (filtroStatus !== 'todos' && imp.status !== filtroStatus) return false;              R$ {totals.pending.toLocaleString('pt-BR')}

    if (filtroMes !== 'todos' && imp.periodo !== filtroMes) return false;            </Typography>

    return true;          </Paper>

  });        </Grid>

      </Grid>

  const totais = {

    calculado: impostos.filter(i => i.status === 'calculado').reduce((acc, i) => acc + i.valor, 0),      <Paper sx={{ borderRadius: 3, mb: 2 }}>

    pago: impostos.filter(i => i.status === 'pago').reduce((acc, i) => acc + i.valor, 0),        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>

    pendente: impostos.filter(i => i.status === 'pendente').reduce((acc, i) => acc + i.valor, 0),          <Tab label="Apurações" />

    vencido: impostos.filter(i => i.status === 'vencido').reduce((acc, i) => acc + i.valor, 0)          <Tab label="Regime Tributário" />

  };          <Tab label="Calendário Fiscal" />

        </Tabs>

  const totalGeral = totais.calculado + totais.pago + totais.pendente + totais.vencido;      </Paper>

  const cargaTributaria = (totalGeral / 500000) * 100;

      {tab === 0 && (

  const hoje = new Date('2025-10-28');        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>

  const impostosCriticos = impostos.filter(imp => {          <Table>

    const venc = new Date(imp.vencimento.split('/').reverse().join('-'));            <TableHead>

    const diasRestantes = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));              <TableRow>

    return diasRestantes <= 7 && imp.status !== 'pago';                <TableCell><strong>Imposto</strong></TableCell>

  });                <TableCell><strong>Período</strong></TableCell>

                <TableCell align="right"><strong>Base Cálculo</strong></TableCell>

  return (                <TableCell align="right"><strong>Alíquota</strong></TableCell>

    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>                <TableCell align="right"><strong>Valor</strong></TableCell>

      {/* Header */}                <TableCell><strong>Vencimento</strong></TableCell>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>                <TableCell><strong>Status</strong></TableCell>

        <DollarSign size={56} color="#ef4444" />                <TableCell align="right"><strong>Ações</strong></TableCell>

        <div>              </TableRow>

          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>            </TableHead>

            💸 Gestão de Impostos            <TableBody>

          </h1>              {taxes.map((tax) => (

          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>                <TableRow key={tax.id} hover>

            Controle total de tributos federais, estaduais e municipais                  <TableCell sx={{ fontWeight: 600 }}>{tax.type}</TableCell>

          </p>                  <TableCell>{tax.period}</TableCell>

        </div>                  <TableCell align="right">R$ {tax.baseValue.toLocaleString('pt-BR')}</TableCell>

      </div>                  <TableCell align="right">{tax.rate}%</TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600 }}>

      {/* Alertas Críticos */}                    R$ {tax.taxValue.toLocaleString('pt-BR')}

      {impostosCriticos.length > 0 && (                  </TableCell>

        <div style={{                  <TableCell>{new Date(tax.dueDate).toLocaleDateString('pt-BR')}</TableCell>

          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',                  <TableCell>

          borderRadius: 12,                    <Chip label={getStatusLabel(tax.status)} color={getStatusColor(tax.status)} size="small" />

          padding: 24,                  </TableCell>

          marginBottom: 32,                  <TableCell align="right">

          color: 'white'                    <IconButton size="small" color="primary">

        }}>                      <EditIcon fontSize="small" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>                    </IconButton>

            <AlertTriangle size={32} />                    <IconButton size="small" color="success">

            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 'bold' }}>                      <DownloadIcon fontSize="small" />

              🚨 ATENÇÃO: {impostosCriticos.length} imposto(s) vencendo em até 7 dias!                    </IconButton>

            </h3>                  </TableCell>

          </div>                </TableRow>

          <div style={{ display: 'grid', gap: 8 }}>              ))}

            {impostosCriticos.map((imp, idx) => {            </TableBody>

              const venc = new Date(imp.vencimento.split('/').reverse().join('-'));          </Table>

              const diasRestantes = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));        </TableContainer>

                    )}

              return (

                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, fontSize: 14 }}>      {tab === 1 && (

                  <strong>{imp.nome}</strong> - R$ {imp.valor.toLocaleString('pt-BR')} -         <Paper sx={{ p: 3, borderRadius: 3 }}>

                  Vence em <strong>{diasRestantes} dia(s)</strong> ({imp.vencimento})          <Typography variant="h6" sx={{ mb: 2 }}>Regime: Simples Nacional</Typography>

                  {imp.status === 'vencido' && <span style={{ marginLeft: 8, color: '#fef3c7', fontWeight: 'bold' }}>⚠️ VENCIDO</span>}          <Typography variant="body2" color="text.secondary">

                </div>            Configure o regime tributário e alíquotas de cada imposto. Integrações com SPED e eSocial.

              );          </Typography>

            })}        </Paper>

          </div>      )}

        </div>

      )}      {tab === 2 && (

        <Paper sx={{ p: 3, borderRadius: 3 }}>

      {/* Dashboard */}          <Typography variant="h6" sx={{ mb: 2 }}>Próximos Vencimentos</Typography>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>          <Typography variant="body2" color="text.secondary">

        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 24, borderRadius: 12, color: 'white' }}>            Calendário fiscal com lembretes automáticos e sincronização com obrigações acessórias.

          <Clock size={32} style={{ marginBottom: 8 }} />          </Typography>

          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Calculado</div>        </Paper>

          <div style={{ fontSize: 28, fontWeight: 'bold' }}>      )}

            R$ {totais.calculado.toLocaleString('pt-BR')}    </Container>

          </div>  );

          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>}

            {impostos.filter(i => i.status === 'calculado').length} imposto(s)
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <CheckCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Pago</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            R$ {totais.pago.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            {impostos.filter(i => i.status === 'pago').length} imposto(s)
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Pendente</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            R$ {totais.pendente.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            {impostos.filter(i => i.status === 'pendente').length} imposto(s)
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Vencido</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            R$ {totais.vencido.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            {impostos.filter(i => i.status === 'vencido').length} imposto(s)
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Carga Tributária</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            {cargaTributaria.toFixed(1)}%
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            da receita mensal
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', color: '#9aa3b0', fontSize: 14, marginBottom: 8 }}>
            Status
          </label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{
              padding: 12,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              minWidth: 200
            }}
          >
            <option value="todos">Todos</option>
            <option value="calculado">Calculado</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', color: '#9aa3b0', fontSize: 14, marginBottom: 8 }}>
            Período
          </label>
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            style={{
              padding: 12,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              minWidth: 200
            }}
          >
            <option value="todos">Todos os períodos</option>
            <option value="Out/2025">Out/2025</option>
            <option value="Set/2025">Set/2025</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
              <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Imposto</th>
              <th style={{ padding: 16, textAlign: 'left', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Período</th>
              <th style={{ padding: 16, textAlign: 'right', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Base Cálculo</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Alíquota</th>
              <th style={{ padding: 16, textAlign: 'right', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Valor</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Vencimento</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#9aa3b0', fontSize: 14, fontWeight: 'bold' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((imposto, idx) => {
              const statusConfig = {
                calculado: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', label: 'Calculado' },
                pago: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', label: 'Pago' },
                pendente: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', label: 'Pendente' },
                vencido: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', label: 'Vencido' }
              };
              const config = statusConfig[imposto.status];

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>{imposto.nome}</td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14 }}>{imposto.periodo}</td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14, textAlign: 'right' }}>
                    R$ {imposto.baseCalculo.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14, textAlign: 'center' }}>{imposto.aliquota}%</td>
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>
                    R$ {imposto.valor.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14, textAlign: 'center' }}>{imposto.vencimento}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{
                      background: config.bg,
                      color: config.color,
                      padding: '6px 16px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      {config.label}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <button
                      style={{
                        background: '#3b82f6',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Download size={16} />
                      DARF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#ef4444', fontSize: 18, fontWeight: 'bold' }}>
            ⚠️ Ação Necessária
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
            <li><strong>URGENTE:</strong> R$ {totais.vencido.toLocaleString('pt-BR')} em impostos vencidos</li>
            <li><strong>Próximos 7 dias:</strong> R$ {totais.pendente.toLocaleString('pt-BR')} a pagar</li>
            <li><strong>Multas:</strong> Regularize para evitar juros Selic + 0.33%/dia</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#10b981', fontSize: 18, fontWeight: 'bold' }}>
            💡 Dicas
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
            <li>Analise mudança de regime tributário</li>
            <li>Configure débito automático</li>
            <li>Revise créditos de PIS/COFINS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
