'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

export default function PopPage() {
  type KPI = { name: string; target: number; unit: string };
  type Occurrence = { at: string; type: string; severity: number; desc: string };
  type Evaluation = { safety: number; health: number; environment: number; quality: number };
  type Process = {
    id: string;
    name: string;
    owner: string;
    steps: string[];
    kpis: KPI[];
    occurrences: Occurrence[];
    evaluation?: Evaluation;
    action_plan?: string;
  };

  const [list, setList] = useState<Process[]>([]);
  const [name, setName] = useState('Recebimento de Carga');
  const [owner, setOwner] = useState('Operações');
  const [stepInput, setStepInput] = useState('Conferir documentação');
  const [kpiName, setKpiName] = useState('OTIF');
  const [kpiTarget, setKpiTarget] = useState(95);
  const [kpiUnit, setKpiUnit] = useState('%');

  useEffect(() => {
    const raw = localStorage.getItem('pop_list');
    if (raw) {
      try {
        setList(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pop_list', JSON.stringify(list));
  }, [list]);

  const addProcess = () => {
    const p: Process = {
      id: String(Date.now()),
      name,
      owner,
      steps: [stepInput],
      kpis: [{ name: kpiName, target: kpiTarget, unit: kpiUnit }],
      occurrences: [],
    };
    setList((prev) => [p, ...prev]);
  };

  const addOccurrence = (procId: string) => {
    const o: Occurrence = {
      at: new Date().toISOString(),
      type: 'Operação',
      severity: 2,
      desc: 'Falha de comunicação',
    };
    setList((prev) =>
      prev.map((p) => (p.id === procId ? { ...p, occurrences: [o, ...p.occurrences] } : p))
    );
  };

  const setEvaluation = (procId: string, e: Evaluation) => {
    setList((prev) => prev.map((p) => (p.id === procId ? { ...p, evaluation: e } : p)));
  };

  const setActionPlan = (procId: string, plan: string) => {
    setList((prev) => prev.map((p) => (p.id === procId ? { ...p, action_plan: plan } : p)));
  };

  const computeSASSMAQScore = (e?: Evaluation) => {
    if (!e) return '—';
    const weights = { safety: 0.3, health: 0.2, environment: 0.2, quality: 0.3 };
    const score =
      e.safety * weights.safety +
      e.health * weights.health +
      e.environment * weights.environment +
      e.quality * weights.quality;
    return score.toFixed(2);
  };

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">POP – Processos Operacionais</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">
          Referência: guia de processos e SASSMAQ • Docs em /docs/pop-modelo.md
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="subtitle1">Novo Processo</Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <TextField
            label="Responsável"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            size="small"
          />
          <TextField
            label="Etapa inicial"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            size="small"
          />
          <TextField
            label="KPI"
            value={kpiName}
            onChange={(e) => setKpiName(e.target.value)}
            size="small"
          />
          <TextField
            label="Meta"
            type="number"
            value={kpiTarget}
            onChange={(e) => setKpiTarget(Number(e.target.value))}
            size="small"
          />
          <TextField
            label="Unidade"
            value={kpiUnit}
            onChange={(e) => setKpiUnit(e.target.value)}
            size="small"
          />
        </Box>
        <Button sx={{ mt: 1 }} onClick={addProcess} variant="contained">
          Adicionar Processo
        </Button>
      </Paper>

      {list.map((p) => (
        <Paper key={p.id} sx={{ p: 2, display: 'grid', gap: 1 }} variant="outlined">
          <Typography variant="h6">
            {p.name} • Resp: {p.owner}
          </Typography>
          <Typography variant="body2">Etapas: {p.steps.join(' → ')}</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>KPI</TableCell>
                <TableCell>Meta</TableCell>
                <TableCell>Unidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {p.kpis.map((k, idx) => (
                <TableRow key={idx}>
                  <TableCell>{k.name}</TableCell>
                  <TableCell>{k.target}</TableCell>
                  <TableCell>{k.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => addOccurrence(p.id)} variant="outlined">
              Registrar ocorrência
            </Button>
            <Button
              onClick={() =>
                setEvaluation(p.id, { safety: 4, health: 4, environment: 5, quality: 4 })
              }
              variant="outlined"
            >
              Avaliar SASSMAQ
            </Button>
            <Button
              onClick={() =>
                setActionPlan(p.id, 'Treinamento de equipe e revisão de POP em 30 dias.')
              }
              variant="outlined"
            >
              Definir plano de ação
            </Button>
          </Box>
          <Typography variant="body2">
            SASSMAQ Score: {computeSASSMAQScore(p.evaluation)}
          </Typography>
          <Typography variant="subtitle2">Ocorrências</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Severidade</TableCell>
                <TableCell>Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {p.occurrences.map((o, i) => (
                <TableRow key={i}>
                  <TableCell>{o.at}</TableCell>
                  <TableCell>{o.type}</TableCell>
                  <TableCell>{o.severity}</TableCell>
                  <TableCell>{o.desc}</TableCell>
                </TableRow>
              ))}
              {p.occurrences.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>Sem ocorrências.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {p.action_plan && <Typography variant="body2">Plano de Ação: {p.action_plan}</Typography>}
        </Paper>
      ))}
    </main>
  );
}
