'use client';
import { useMemo, useState } from 'react';
// JWT: usa token do localStorage para autenticação
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';

export default function RiskScorePage() {
  const [workingCapital, setWorkingCapital] = useState<number>(250000);
  const [retainedEarnings, setRetainedEarnings] = useState<number>(180000);
  const [operatingIncome, setOperatingIncome] = useState<number>(120000);
  const [marketValueEquity, setMarketValueEquity] = useState<number>(900000);
  const [sales, setSales] = useState<number>(1500000);
  const [totalAssets, setTotalAssets] = useState<number>(1000000);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(400000);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isLoggedIn = Boolean(token);

  async function calculate() {
    setError(null);
    setResult(null);
    if (!isLoggedIn) {
      setError('Faça login para calcular o score de risco.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          workingCapital,
          retainedEarnings,
          operatingIncome,
          marketValueEquity,
          sales,
          totalAssets,
          totalLiabilities,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Falha ao calcular risco');
      }
      setResult(data.result);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Score de Risco (Altman Z)
      </Typography>
      {!isLoggedIn && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Você precisa estar autenticado para usar esta função. <a href="/jwt/login">Fazer login</a>
        </Alert>
      )}
      <Paper variant="outlined" sx={{ p: 2, display: 'grid', gap: 2 }}>
        <Typography variant="subtitle1">Entradas</Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))' }}>
          <TextField
            label="Capital de Giro (WC)"
            type="number"
            value={workingCapital}
            onChange={(e) => setWorkingCapital(Number(e.target.value))}
          />
          <TextField
            label="Lucros Retidos (RE)"
            type="number"
            value={retainedEarnings}
            onChange={(e) => setRetainedEarnings(Number(e.target.value))}
          />
          <TextField
            label="Lucro Operacional (EBIT)"
            type="number"
            value={operatingIncome}
            onChange={(e) => setOperatingIncome(Number(e.target.value))}
          />
          <TextField
            label="Valor de Mercado do Patrimônio (MVE)"
            type="number"
            value={marketValueEquity}
            onChange={(e) => setMarketValueEquity(Number(e.target.value))}
          />
          <TextField
            label="Vendas (S)"
            type="number"
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
          />
          <TextField
            label="Ativos Totais (TA)"
            type="number"
            value={totalAssets}
            onChange={(e) => setTotalAssets(Number(e.target.value))}
          />
          <TextField
            label="Passivos Totais (TL)"
            type="number"
            value={totalLiabilities}
            onChange={(e) => setTotalLiabilities(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={calculate} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Calculando...
              </>
            ) : (
              'Calcular'
            )}
          </Button>
          <Button variant="text" onClick={() => setResult(null)} disabled={loading}>
            Limpar
          </Button>
        </Box>
        {error && (
          <Alert severity="error" aria-live="polite">
            {error}
          </Alert>
        )}
        {result && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Resultado
            </Typography>
            <Typography>Z-Score: {result.zScore}</Typography>
            <Typography>Risco: {result.risk}</Typography>
            <Typography>Explicação: {result.explanation}</Typography>
          </Paper>
        )}
      </Paper>
    </main>
  );
}
