'use client';
import { useMemo, useState } from 'react';
// Firebase removido; cálculo será realizado localmente.
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const sampleReceivables = `[
  { "amount": 12000, "dueDate": "2025-11-10", "customer": "Cliente A" },
  { "amount": 8000, "dueDate": "2025-12-03", "customer": "Cliente B" }
]`;

const samplePayables = `[
  { "amount": 7000, "dueDate": "2025-11-05", "vendor": "Fornecedor X" },
  { "amount": 4000, "dueDate": "2025-12-12", "vendor": "Fornecedor Y" }
]`;

type ForecastRow = { month: string; receivables: number; payables: number; net: number };

function ForecastChart({ data }: { data: ForecastRow[] }) {
  const width = 720;
  const height = 260;
  const padding = 40;
  const xs = data.map(
    (_, i) => padding + (i * (width - 2 * padding)) / Math.max(1, data.length - 1)
  );
  const values = {
    receivables: data.map((d) => d.receivables),
    payables: data.map((d) => d.payables),
    net: data.map((d) => d.net),
  } as const;
  const all = [...values.receivables, ...values.payables, ...values.net, 0];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const y = (v: number) => padding + (height - 2 * padding) * (1 - (v - min) / range);
  const x = (i: number) => xs[i];
  const pathFor = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const months = data.map((d) => d.month);
  const seriesMeta = {
    receivables: { color: '#4caf50', label: 'Recebíveis' },
    payables: { color: '#f44336', label: 'Pagáveis' },
    net: { color: '#2196f3', label: 'Líquido' },
  } as const;
  const [hover, setHover] = useState<{ series: keyof typeof seriesMeta; i: number } | null>(null);
  const hoveredPoint = hover ? { x: x(hover.i), y: y(values[hover.series][hover.i]) } : null;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Gráfico de previsão"
      onMouseLeave={() => setHover(null)}
    >
      <rect
        x={padding}
        y={padding}
        width={width - 2 * padding}
        height={height - 2 * padding}
        fill="transparent"
        stroke="#555"
      />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yy = padding + (height - 2 * padding) * t;
        const val = max - range * t;
        return (
          <g key={t}>
            <line x1={padding} y1={yy} x2={width - padding} y2={yy} stroke="#333" />
            <text x={8} y={yy + 4} fill="#aaa" fontSize="12">
              {val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </text>
          </g>
        );
      })}
      {months.map((m, i) => (
        <text key={m} x={x(i)} y={height - 12} fill="#aaa" fontSize="12" textAnchor="middle">
          {m}
        </text>
      ))}
      <path
        d={pathFor(values.receivables)}
        stroke={seriesMeta.receivables.color}
        fill="none"
        strokeWidth={2}
      />
      <path
        d={pathFor(values.payables)}
        stroke={seriesMeta.payables.color}
        fill="none"
        strokeWidth={2}
      />
      <path d={pathFor(values.net)} stroke={seriesMeta.net.color} fill="none" strokeWidth={2} />

      {(['receivables', 'payables', 'net'] as const).map((s) => (
        <g key={s}>
          {values[s].map((v, i) => (
            <circle
              key={`${s}-${i}`}
              cx={x(i)}
              cy={y(v)}
              r={3.5}
              fill={seriesMeta[s].color}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover({ series: s, i })}
              onMouseMove={() => setHover({ series: s, i })}
              onFocus={() => setHover({ series: s, i })}
            />
          ))}
        </g>
      ))}

      {hover && hoveredPoint && (
        <g>
          <line
            x1={hoveredPoint.x}
            y1={padding}
            x2={hoveredPoint.x}
            y2={height - padding}
            stroke="#666"
            strokeDasharray="4 4"
          />
          <circle
            cx={hoveredPoint.x}
            cy={hoveredPoint.y}
            r={6}
            fill="none"
            stroke={seriesMeta[hover.series].color}
          />
          <g
            transform={`translate(${Math.min(width - padding - 180, hoveredPoint.x + 12)}, ${Math.max(padding + 12, hoveredPoint.y - 44)})`}
          >
            <rect width="180" height="48" rx="6" ry="6" fill="#111" stroke="#444" />
            <text x="10" y="18" fill="#fff" fontSize="12">
              {seriesMeta[hover.series].label}
            </text>
            <text x="10" y="34" fill="#ccc" fontSize="12">
              {months[hover.i]} •{' '}
              {values[hover.series][hover.i].toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </text>
          </g>
        </g>
      )}

      <g transform={`translate(${padding}, ${padding - 12})`}>
        <circle cx="0" cy="0" r="4" fill={seriesMeta.receivables.color} />
        <text x="10" y="4" fill="#ccc" fontSize="12">
          {seriesMeta.receivables.label}
        </text>
        <g transform="translate(120,0)">
          <circle cx="0" cy="0" r="4" fill={seriesMeta.payables.color} />
          <text x="10" y="4" fill="#ccc" fontSize="12">
            {seriesMeta.payables.label}
          </text>
        </g>
        <g transform="translate(220,0)">
          <circle cx="0" cy="0" r="4" fill={seriesMeta.net.color} />
          <text x="10" y="4" fill="#ccc" fontSize="12">
            {seriesMeta.net.label}
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function FpaForecastPage() {
  const [receivablesJson, setReceivablesJson] = useState(sampleReceivables);
  const [payablesJson, setPayablesJson] = useState(samplePayables);
  const [horizonMonths, setHorizonMonths] = useState(6);
  const [saveToFirestore, setSaveToFirestore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<any[] | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  // Firebase Functions removido

  async function runForecast() {
    setError(null);
    setForecast(null);
    setSavedId(null);

    let receivables: any[] = [];
    let payables: any[] = [];
    try {
      receivables = JSON.parse(receivablesJson || '[]');
      payables = JSON.parse(payablesJson || '[]');
      if (!Array.isArray(receivables) || !Array.isArray(payables))
        throw new Error('JSON deve ser arrays.');
    } catch (e: any) {
      setError('JSON inválido: ' + (e?.message || String(e)));
      return;
    }

    setLoading(true);
    try {
      const start = new Date();
      start.setDate(1);
      const months: Date[] = Array.from(
        { length: Math.max(1, horizonMonths) },
        (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1)
      );
      const monthKey = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const labelFor = (d: Date) =>
        d.toLocaleString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
      const sumByMonth = (items: any[]) => {
        const map: Record<string, number> = {};
        for (const it of items) {
          const amt = Number(it?.amount ?? 0);
          const due = it?.dueDate ? new Date(it.dueDate) : null;
          if (!isFinite(amt) || !due || isNaN(due.getTime())) continue;
          const k = monthKey(new Date(due.getFullYear(), due.getMonth(), 1));
          map[k] = (map[k] ?? 0) + amt;
        }
        return map;
      };
      const recvMap = sumByMonth(receivables);
      const payMap = sumByMonth(payables);
      const data: ForecastRow[] = months.map((d) => {
        const k = monthKey(d);
        const r = recvMap[k] ?? 0;
        const p = payMap[k] ?? 0;
        return { month: labelFor(d), receivables: r, payables: p, net: r - p };
      });
      setForecast(data as any);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Previsão Financeira (FPA)
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, display: 'grid', gap: 2 }}>
        <Typography variant="subtitle1">Entradas</Typography>
        <TextField
          label="Recebíveis (JSON)"
          multiline
          minRows={6}
          value={receivablesJson}
          onChange={(e) => setReceivablesJson(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Pagáveis (JSON)"
          multiline
          minRows={6}
          value={payablesJson}
          onChange={(e) => setPayablesJson(e.target.value)}
          disabled={loading}
        />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Horizonte (meses)"
            type="number"
            inputProps={{ min: 1, max: 24 }}
            value={horizonMonths}
            onChange={(e) => setHorizonMonths(Number(e.target.value))}
            disabled={loading}
            sx={{ maxWidth: 160 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={saveToFirestore}
                onChange={(e) => setSaveToFirestore(e.target.checked)}
              />
            }
            label="Salvar resultado"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={runForecast} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Calculando...
              </>
            ) : (
              'Calcular previsão'
            )}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setForecast(null);
              setSavedId(null);
            }}
            disabled={loading}
          >
            Limpar
          </Button>
        </Box>
        {error && (
          <Alert severity="error" aria-live="polite">
            {error}
          </Alert>
        )}
        {savedId && <Alert severity="success">Resultado salvo com ID: {savedId}</Alert>}
        {forecast && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Previsão
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mês</TableCell>
                  <TableCell align="right">Recebíveis</TableCell>
                  <TableCell align="right">Pagáveis</TableCell>
                  <TableCell align="right">Líquido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forecast.map((row: any) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell align="right">
                      {row.receivables.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {row.payables.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell align="right">
                      {row.net.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, overflowX: 'auto' }}>
              <ForecastChart data={forecast as any} />
            </Box>
          </Paper>
        )}
      </Paper>
    </main>
  );
}
