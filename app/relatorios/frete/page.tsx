'use client';
import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { calcTrip, type CostParams, type TripBreakdown } from '@/lib/cost';

export default function RelatorioFretePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [params, setParams] = useState<CostParams | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [payloadTon, setPayloadTon] = useState<number>(20);
  const [tollsPerKm, setTollsPerKm] = useState<number | undefined>(undefined);
  const [monthsEq, setMonthsEq] = useState<number>(0.2);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [vRes, pRes] = await Promise.all([
        fetch('/api/vehicles?page=1&pageSize=1000', { cache: 'no-store' }),
        fetch('/api/cost-params', { cache: 'no-store' }),
      ]);
      const vData = await vRes.json();
      const pData = await pRes.json();
      setVehicles(Array.isArray(vData) ? vData : []);
      setParams(pData && !pData.error ? pData : null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const breakdown: TripBreakdown | null = useMemo(() => {
    if (!params) return null;
    return calcTrip(params, {
      distance_km: distanceKm,
      payload_ton: payloadTon,
      tolls_per_km: tollsPerKm,
      months_equivalent: monthsEq,
    });
  }, [params, distanceKm, payloadTon, tollsPerKm, monthsEq]);

  const saveParams = async () => {
    if (!params) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cost-params', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
      if (!res.ok) throw new Error('Falha ao salvar parâmetros');
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">Relatório de Estimativa de Frete</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">Metodologia: Sicro2/CONAB (parâmetros configuráveis)</Typography>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
        <Paper sx={{ p: 2 }} variant="outlined">
          <Typography variant="subtitle1">Parâmetros</Typography>
          {params ? (
            <Box sx={{ display: 'grid', gap: 1 }}>
              {Object.entries(params).map(([k, v]) => (
                <TextField key={k} label={k} type="number" value={v as number} onChange={(e) => setParams({ ...params, [k]: Number(e.target.value) })} size="small" />
              ))}
              <Button onClick={saveParams} disabled={loading} variant="outlined">{loading ? 'Salvando...' : 'Salvar parâmetros'}</Button>
            </Box>
          ) : (
            <CircularProgress size={18} />
          )}
        </Paper>

        <Paper sx={{ p: 2 }} variant="outlined">
          <Typography variant="subtitle1">Viagem</Typography>
          <Box sx={{ display: 'grid', gap: 1 }}>
            <TextField label="Distância (km)" type="number" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} size="small" />
            <TextField label="Carga (ton)" type="number" value={payloadTon} onChange={(e) => setPayloadTon(Number(e.target.value))} size="small" />
            <TextField label="Pedágio (R$/km)" type="number" value={tollsPerKm ?? ''} onChange={(e) => setTollsPerKm(Number(e.target.value))} size="small" placeholder="usar default" />
            <TextField label="Rateio fixos (mês)" type="number" value={monthsEq} onChange={(e) => setMonthsEq(Number(e.target.value))} size="small" />
            <TextField label="Veículo (id)" value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)} size="small" placeholder="opcional" />
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }} variant="outlined">
          <Typography variant="subtitle1">Resultados</Typography>
          {breakdown ? (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1 }}>
                <Paper sx={{ p: 1 }} variant="outlined">Custo por km: R$ {breakdown.totals.cost_per_km.toFixed(2)}</Paper>
                <Paper sx={{ p: 1 }} variant="outlined">Custo por ton-km: R$ {breakdown.totals.cost_per_ton_km.toFixed(4)}</Paper>
                <Paper sx={{ p: 1 }} variant="outlined">Custo da viagem: R$ {breakdown.totals.cost_trip.toFixed(2)}</Paper>
                <Paper sx={{ p: 1 }} variant="outlined">Frete (com margem): R$ {breakdown.totals.freight_with_margin.toFixed(2)}</Paper>
              </Box>
              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Componente</TableCell>
                    <TableCell>Valor (R$)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(breakdown.components).map(([k, v]) => (
                    <TableRow key={k}><TableCell>{k}</TableCell><TableCell>{v.toFixed(2)}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <CircularProgress size={18} />
          )}
        </Paper>
      </Box>
    </main>
  );
}