'use client'
import { useEffect, useMemo, useState } from 'react'
import { Box, Paper, Typography, TextField, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Chip, Alert, Button } from '@mui/material'
import Card from '@/components/ui/card'

export default function RelatorioCapacidadePage() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  // Presets replicados para validação básica
  const axlePresets = [
    { name: 'Toco', axles: 2, weights: [6, 10], gross: 16 },
    { name: 'Trucado', axles: 3, weights: [6, 17], gross: 23 },
    { name: 'Cavalo toco + carreta LS', axles: 5, weights: [6, 10, 25.5], gross: 41.5 },
    { name: 'Cavalo trucado + carreta LS', axles: 6, weights: [6, 17, 25.5], gross: 48.5 },
    { name: 'Cavalo toco + carreta vanderleia', axles: 5, weights: [6, 10, 10, 10, 10], gross: 46 },
    { name: 'Romeu e Julieta trucado', axles: 6, weights: [6, 17, 10, 10, 10], gross: 50 },
  ]
  // Limites oficiais por configuração (PBTC), baseados em CONTRAN/DER
  const officialPBTC: Record<string, number> = {
    'Toco': 16,
    'Trucado': 23,
    'Cavalo toco + carreta LS': 41.5,
    'Cavalo trucado + carreta LS': 48.5,
    'Cavalo toco + carreta vanderleia': 46,
    'Romeu e Julieta trucado': 50,
  }
  const TOL_GROSS = 0.05; // 5% PBTC
  const TOL_AXLE = 0.10;  // 10% por eixo

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/vehicles?page=1&pageSize=1000${q ? `&q=${encodeURIComponent(q)}` : ''}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar veículos')
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = setTimeout(() => load(), 300)
    return () => clearTimeout(id)
  }, [q])

  const groups = useMemo(() => {
    const map = new Map<string, any>()
    for (const v of list) {
      const key = v.axle_config_name || '—'
      const g = map.get(key) || {
        name: key,
        items: [] as any[],
        expectedAxles: (() => axlePresets.find(p => p.name === key)?.axles ?? null)(),
        presetGross: (() => axlePresets.find(p => p.name === key)?.gross ?? null)(),
      }
      g.items.push(v)
      map.set(key, g)
    }
    return Array.from(map.values())
  }, [list])

  const totals = useMemo(() => {
    const totalVehicles = list.length
    const withPreset = list.filter(v => !!v.axle_config_name).length
    const divergence = list.filter(v => {
      const preset = axlePresets.find(p => p.name === v.axle_config_name)
      if (!preset || typeof v.axles_count !== 'number') return false
      return v.axles_count !== preset.axles
    }).length
    const totalGross = list.reduce((acc, v) => {
      const preset = axlePresets.find(p => p.name === v.axle_config_name)
      const gross = v.gross_weight_estimated ?? preset?.gross ?? 0
      return acc + (typeof gross === 'number' ? gross : 0)
    }, 0)
    const compliantGross = list.filter(v => {
      const name = v.axle_config_name
      const gross = v.gross_weight_estimated ?? axlePresets.find(p => p.name === name)?.gross ?? null
      if (gross == null || !officialPBTC[name]) return false
      return gross <= officialPBTC[name]
    }).length
    const withinToleranceGross = list.filter(v => {
      const name = v.axle_config_name
      const gross = v.gross_weight_estimated ?? axlePresets.find(p => p.name === name)?.gross ?? null
      const limit = officialPBTC[name]
      if (gross == null || !limit) return false
      return gross > limit && gross <= limit * (1 + TOL_GROSS)
    }).length
    const exceededGross = list.filter(v => {
      const name = v.axle_config_name
      const gross = v.gross_weight_estimated ?? axlePresets.find(p => p.name === name)?.gross ?? null
      const limit = officialPBTC[name]
      if (gross == null || !limit) return false
      return gross > limit * (1 + TOL_GROSS)
    }).length
    return { totalVehicles, withPreset, divergence, totalGross, compliantGross, withinToleranceGross, exceededGross }
  }, [list])

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">Relatório de Capacidade por Configuração</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">Fonte: /api/vehicles</Typography>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
        <Card title="Veículos (total)">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totals.totalVehicles}</div>
        </Card>
        <Card title="Com preset">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totals.withPreset}</div>
        </Card>
        <Card title="Divergências de eixos">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totals.divergence}</div>
        </Card>
        <Card title="Peso bruto estimado (t)">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(totals.totalGross)}</div>
        </Card>
        <Card title="PBTC ok (≤ limite)">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totals.compliantGross}</div>
        </Card>
        <Card title="PBTC na tolerância (≤ +5%)">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totals.withinToleranceGross}</div>
        </Card>
        <Card title="PBTC excedido (＞ +5%)">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totals.exceededGross}</div>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField label="Buscar" placeholder="Placa ou Modelo" value={q} onChange={(e) => setQ(e.target.value)} size="small" />
        <Button onClick={load} disabled={loading} variant="outlined">{loading ? 'Atualizando...' : 'Atualizar'}</Button>
        {loading && <CircularProgress size={18} />}
      </Box>

      {groups.map((g) => {
        const mismatch = g.items.filter((v: any) => typeof v.axles_count === 'number' && g.expectedAxles !== null && v.axles_count !== g.expectedAxles)
        return (
          <Paper key={g.name} sx={{ p: 2, display: 'grid', gap: 1 }} variant="outlined">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6">{g.name}</Typography>
              {g.presetGross != null && (
                <Chip label={`Bruto estimado: ${g.presetGross}t`} size="small" />
              )}
              {g.expectedAxles != null && (
                <Chip label={`Eixos preset: ${g.expectedAxles}`} size="small" />
              )}
              <Chip label={`Veículos: ${g.items.length}`} size="small" />
              {mismatch.length > 0 && (
                <Chip color="warning" label={`Divergências: ${mismatch.length}`} size="small" />
              )}
            </Box>
            {mismatch.length > 0 && (
              <Alert severity="warning">
                {`Há ${mismatch.length} veículos com eixos diferentes do preset`} —
                {mismatch.slice(0, 6).map((v: any) => (
                  <Chip key={v.id} label={`${v.plate} (${v.axles_count})`} size="small" sx={{ ml: 1 }} />
                ))}
                {mismatch.length > 6 && (
                  <Chip label={`+${mismatch.length - 6}`} size="small" sx={{ ml: 1 }} />
                )}
              </Alert>
            )}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Placa</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Eixos</TableCell>
                  <TableCell>Preset</TableCell>
                  <TableCell>Peso bruto estimado (t)</TableCell>
                  <TableCell>PBTC limite (t)</TableCell>
                  <TableCell>Status PBTC</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {g.items.map((v: any) => {
                  const limit = officialPBTC[v.axle_config_name] ?? null
                  const gross = v.gross_weight_estimated ?? axlePresets.find(p => p.name === v.axle_config_name)?.gross ?? null
                  const status = (() => {
                    if (limit == null || gross == null) return '—'
                    if (gross <= limit) return 'OK'
                    if (gross <= limit * (1 + TOL_GROSS)) return 'Tolerância'
                    return 'Excede'
                  })()
                  return (
                    <TableRow key={v.id}>
                      <TableCell>{v.plate}</TableCell>
                      <TableCell>{v.model || '—'}</TableCell>
                      <TableCell>{v.brand || '—'}</TableCell>
                      <TableCell>{v.axles_count ?? '—'}</TableCell>
                      <TableCell>{v.axle_config_name || '—'}</TableCell>
                      <TableCell>{gross ?? '—'}</TableCell>
                      <TableCell>{limit ?? '—'}</TableCell>
                      <TableCell>{status}</TableCell>
                    </TableRow>
                  )
                })}
                {g.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>Sem veículos na configuração.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )
      })}
    </main>
  )
 }