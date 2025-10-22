'use client';
import { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper, Snackbar, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, MenuItem, Chip } from '@mui/material';
import Card from '@/components/ui/card';

export default function CadastroVeiculosPage() {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [odometer, setOdometer] = useState<number | ''>('');
  const [chassis, setChassis] = useState('');
  const [renavam, setRenavam] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [goal, setGoal] = useState('');
  const [axlesCount, setAxlesCount] = useState<number | ''>('');
  const [tireType, setTireType] = useState('');
  const [tireDimensions, setTireDimensions] = useState('');
  const [purchaseValue, setPurchaseValue] = useState<number | ''>('');
  const [ownership, setOwnership] = useState('');

  // Presets de configuração de eixos (Lei da Balança)
  const [axleConfigSuggested, setAxleConfigSuggested] = useState('');
  const axlePresets = [
    { name: 'Toco', axles: 2, weights: [6, 10], gross: 16 },
    { name: 'Trucado', axles: 3, weights: [6, 17], gross: 23 },
    { name: 'Cavalo toco + carreta LS', axles: 5, weights: [6, 10, 25.5], gross: 41.5 },
    { name: 'Cavalo trucado + carreta LS', axles: 6, weights: [6, 17, 25.5], gross: 48.5 },
    { name: 'Cavalo toco + carreta vanderleia', axles: 5, weights: [6, 10, 10, 10, 10], gross: 46 },
    { name: 'Romeu e Julieta trucado', axles: 6, weights: [6, 17, 10, 10, 10], gross: 43 },
  ];
  function normalize(s: string) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  function detectPreset(brand: string, model: string) {
    const b = normalize(brand);
    const m = normalize(model);
    if (m.includes('romeu') || m.includes('julieta')) return 'Romeu e Julieta trucado';
    if (m.includes('vanderleia')) return 'Cavalo toco + carreta vanderleia';
    if (m.includes('carreta ls') || m.includes('ls') || m.includes('bitrem')) {
      if (m.includes('trucado') || m.includes('cavalo trucado')) return 'Cavalo trucado + carreta LS';
      return 'Cavalo toco + carreta LS';
    }
    if (m.includes('trucado') || b.includes('trucado')) return 'Trucado';
    if (m.includes('toco')) return 'Toco';
    return '';
  }
  useEffect(() => {
    // Sugestão automática ao digitar marca/modelo
    const preset = detectPreset(brand, model);
    // Evita sobrescrever quando já há seleção explícita (edição)
    if (!axleConfigSuggested) {
      setAxleConfigSuggested(preset);
      const p = axlePresets.find((x) => x.name === preset);
      if (p) setAxlesCount(p.axles);
    }
  }, [brand, model]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);
  const load = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/vehicles?page=${page}&pageSize=${pageSize}${search ? `&q=${encodeURIComponent(search)}` : ''}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao carregar veículos.');
      const data = await res.json();
      const countHeader = res.headers.get('X-Total-Count');
      const count = countHeader ? parseInt(countHeader, 10) : (Array.isArray(data) ? data.length : 0);
      setTotalCount(Number.isFinite(count) ? count : 0);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, pageSize]);

  const startEdit = (v: any) => {
    setEditingId(v.id);
    setPlate((v.plate || '').toUpperCase());
    setModel(v.model || '');
    setYear(v.year ?? '');
    setOdometer(v.odometer ?? '');
    setChassis((v.chassis || '').toUpperCase());
    setRenavam(v.renavam || '');
    setColor(v.color || '');
    setBrand(v.brand || '');
    setCostCenter(v.cost_center || '');
    setGoal(v.goal_desc || v.goal || '');
    setAxlesCount(v.axles_count ?? '');
    setTireType(v.tire_type || '');
    setTireDimensions(v.tire_dimensions || '');
    setPurchaseValue(v.purchase_value ?? '');
    setOwnership(v.ownership || '');
    // Carrega preset salvo (se existir)
    setAxleConfigSuggested(v.axle_config_name || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPlate('');
    setModel('');
    setYear('');
    setOdometer('');
    setChassis('');
    setRenavam('');
    setColor('');
    setBrand('');
    setCostCenter('');
    setGoal('');
    setAxlesCount('');
    setTireType('');
    setTireDimensions('');
    setPurchaseValue('');
    setOwnership('');
    setAxleConfigSuggested('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/vehicles/${editingId}` : '/api/vehicles';
      const selectedPreset = axlePresets.find((p) => p.name === axleConfigSuggested);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plate,
          model,
          year: year || null,
          odometer: odometer || null,
          chassis: chassis || null,
          renavam: renavam || null,
          color: color || null,
          brand: brand || null,
          cost_center: costCenter || null,
          goal: goal || null,
          axles_count: axlesCount || null,
          // novos campos de preset
          axle_config_name: axleConfigSuggested || null,
          axle_weights: selectedPreset?.weights || null,
          gross_weight_estimated: selectedPreset?.gross || null,
          tire_type: tireType || null,
          tire_dimensions: tireDimensions || null,
          purchase_value: purchaseValue || null,
          ownership: ownership || null,
        }),
      });
      if (!res.ok) {
        let msg = editingId ? 'Falha ao atualizar veículo.' : 'Falha ao salvar veículo.';
        try {
          const data = await res.json();
          msg = data?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      setOk(editingId ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
      cancelEdit();
      await load();
    } catch (err: any) {
      setError(err?.message || (editingId ? 'Falha ao atualizar veículo.' : 'Falha ao salvar veículo.'));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Excluir este veículo?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let msg = 'Falha ao excluir veículo.';
        try {
          const data = await res.json();
          msg = data?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      setOk('Veículo excluído com sucesso!');
      await load();
    } catch (err: any) {
      setError(err?.message || 'Falha ao excluir veículo.');
    } finally {
      setDeletingId(null);
    }
  };

  const currentYearMax = new Date().getFullYear() + 1;
  const plateRegexOld = /^[A-Z]{3}[0-9]{4}$/; // AAA0000
  const plateRegexMercosur = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/; // AAA0A00
  const isPlateValid = plateRegexOld.test(plate) || plateRegexMercosur.test(plate);
  const isYearValid = year === '' || (year >= 1900 && year <= currentYearMax);
  const isOdometerValid = odometer === '' || (odometer >= 0);

  const isChassisValid = chassis === '' || /^[A-HJ-NPR-Z0-9]{17}$/.test(chassis);
  const renavamDigits = renavam.replace(/\D/g, '');
  const isRenavamValid = renavam === '' || renavamDigits.length === 11;
  const isAxlesValid = axlesCount === '' || axlesCount >= 0;
  const isPurchaseValueValid = purchaseValue === '' || purchaseValue >= 0;
  const isOwnershipValid = ownership === '' || ['financiado','proprio','alugado','agregado','autonomo'].includes(ownership);

  const canSubmit = !saving && isPlateValid && isYearValid && isOdometerValid && !!plate && isChassisValid && isRenavamValid && isAxlesValid && isPurchaseValueValid && isOwnershipValid;

  // KPIs simples baseados na página atual
  const totalVehicles = list.length;
  const validPlateCount = list.filter((v) => {
    const p = String(v.plate || '').toUpperCase();
    return plateRegexOld.test(p) || plateRegexMercosur.test(p);
  }).length;
  const avgYear = (() => {
    const ys = list.map((v) => v.year).filter((y) => typeof y === 'number');
    return ys.length ? Math.round(ys.reduce((a: number, b: number) => a + b, 0) / ys.length) : 0;
  })();
  const avgOdometer = (() => {
    const os = list.map((v) => v.odometer).filter((o) => typeof o === 'number');
    return os.length ? Math.round(os.reduce((a: number, b: number) => a + b, 0) / os.length) : 0;
  })();
  const createdTodayCount = list.filter((v) => {
    const dt = v.created_at ? new Date(v.created_at) : null;
    if (!dt) return false;
    const today = new Date();
    return dt.toDateString() === today.toDateString();
  }).length;

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <Typography variant="h4">Cadastro de Veículos</Typography>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="caption">Coleção: veiculos</Typography>
      </Paper>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
        <Card title="Veículos (página)">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totalVehicles}</div>
        </Card>
        <Card title="Placas válidas">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{validPlateCount}</div>
        </Card>
        <Card title="Média do ano">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{avgYear || '—'}</div>
        </Card>
        <Card title="Média hodômetro">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{avgOdometer || '—'}</div>
        </Card>
        <Card title="Novos hoje">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{createdTodayCount}</div>
        </Card>
      </Box>

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 920 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
          <TextField
            label="Placa"
            value={plate}
            onChange={(e) => {
              const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
              setPlate(v);
            }}
            inputProps={{ maxLength: 7 }}
            required
            error={!!plate && !isPlateValid}
            helperText={!!plate && !isPlateValid ? 'Formato válido: AAA0000 ou AAA0A00' : undefined}
          />
          <TextField label="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
          <TextField
            label="Ano"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
            inputProps={{ min: 1900, max: currentYearMax }}
            error={!isYearValid}
            helperText={!isYearValid ? `Ano entre 1900 e ${currentYearMax}` : undefined}
          />
          <TextField
            label="Hodômetro"
            type="number"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value ? Number(e.target.value) : '')}
            inputProps={{ min: 0 }}
            error={!isOdometerValid}
            helperText={!isOdometerValid ? 'Hodômetro deve ser não negativo' : undefined}
          />
          <TextField
            label="Chassi (VIN)"
            value={chassis}
            onChange={(e) => setChassis(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17))}
            inputProps={{ maxLength: 17 }}
            error={!isChassisValid}
            helperText={!isChassisValid ? 'VIN deve ter 17 caracteres (sem I/O/Q)' : undefined}
          />
          <TextField
            label="RENAVAM"
            value={renavam}
            onChange={(e) => setRenavam(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
            inputProps={{ maxLength: 11 }}
            error={!isRenavamValid}
            helperText={!isRenavamValid ? 'RENAVAM deve ter 11 dígitos' : undefined}
          />
          <TextField label="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <TextField label="Cor" value={color} onChange={(e) => setColor(e.target.value)} />
          <TextField label="Centro de custo" value={costCenter} onChange={(e) => setCostCenter(e.target.value)} />
          <TextField label="Meta/Objetivo" value={goal} onChange={(e) => setGoal(e.target.value)} />

          {/* Seletor de configuração de eixos (sugestão) */}
          <TextField
            label="Configuração de eixos (sugestão)"
            select
            value={axleConfigSuggested}
            onChange={(e) => {
              const val = e.target.value;
              setAxleConfigSuggested(val);
              const p = axlePresets.find((x) => x.name === val);
              if (p) setAxlesCount(p.axles);
            }}
          >
            <MenuItem value="">—</MenuItem>
            {axlePresets.map((p) => (
              <MenuItem key={p.name} value={p.name}>
                {p.name} — {p.weights.join('t + ')}t = {p.gross}t
              </MenuItem>
            ))}
          </TextField>
          {axleConfigSuggested && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {axlePresets
                .find((x) => x.name === axleConfigSuggested)?.weights.map((w, i) => (
                  <Chip key={i} label={`${w}t`} size="small" />
                ))}
            <Typography variant="caption" sx={{ ml: 1 }}>
              Peso bruto estimado: {axlePresets.find((x) => x.name === axleConfigSuggested)?.gross}t
            </Typography>
          </Box>
          )}
          {axleConfigSuggested && (() => {
            const p = axlePresets.find((x) => x.name === axleConfigSuggested);
            return p && axlesCount !== '' && Number(axlesCount) !== p.axles ? (
              <Alert severity="info" sx={{ mt: 1 }}
                action={<Button size="small" onClick={() => setAxlesCount(p.axles)}>Aplicar preset</Button>}>
                Eixos ({axlesCount}) diferente do preset selecionado ({p.axles}).
              </Alert>
            ) : null;
          })()}
          {/* Campo Eixos (continua permitindo ajuste manual) */}
          <TextField
            label="Eixos"
            type="number"
            value={axlesCount}
            onChange={(e) => setAxlesCount(e.target.value ? Number(e.target.value) : '')}
            inputProps={{ min: 0 }}
            error={!isAxlesValid}
            helperText={!isAxlesValid ? 'Eixos deve ser não negativo' : undefined}
          />
          <TextField label="Tipo de pneu" value={tireType} onChange={(e) => setTireType(e.target.value)} />
          <TextField label="Dimensões do pneu" value={tireDimensions} onChange={(e) => setTireDimensions(e.target.value)} />
          <TextField
            label="Valor de compra"
            type="number"
            value={purchaseValue}
            onChange={(e) => setPurchaseValue(e.target.value ? Number(e.target.value) : '')}
            inputProps={{ min: 0, step: '0.01' }}
            error={!isPurchaseValueValid}
            helperText={!isPurchaseValueValid ? 'Valor deve ser não negativo' : undefined}
          />
          <TextField
            label="Posse"
            select
            value={ownership}
            onChange={(e) => setOwnership(e.target.value)}
          >
            <MenuItem value="">—</MenuItem>
            <MenuItem value="financiado">Financiado</MenuItem>
            <MenuItem value="proprio">Próprio</MenuItem>
            <MenuItem value="alugado">Alugado</MenuItem>
            <MenuItem value="agregado">Agregado</MenuItem>
            <MenuItem value="autonomo">Autônomo</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={!canSubmit}>
            {saving ? (editingId ? 'Atualizando...' : 'Salvando...') : editingId ? 'Atualizar Veículo' : 'Salvar Veículo'}
          </Button>
          {editingId && (
            <Button onClick={cancelEdit} variant="text" disabled={saving}>
              Cancelar Edição
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 2 }} variant="outlined">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            label="Buscar"
            placeholder="Placa ou Modelo"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <TextField
            size="small"
            type="number"
            label="Itens"
            value={pageSize}
            onChange={(e) => setPageSize(Math.min(100, Math.max(1, Number(e.target.value) || 10)))}
            inputProps={{ min: 1, max: 100 }}
            sx={{ width: 100 }}
          />
          <Typography variant="body2" sx={{ mx: 1 }}>Página {page}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            <Card title="Veículos (total)">
              <div style={{ fontSize: 24, fontWeight: 700 }}>{totalCount}</div>
            </Card>
          </Box>
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loadingList || page <= 1} variant="outlined">Anterior</Button>
          <Button onClick={() => setPage((p) => p + 1)} disabled={loadingList || page * pageSize >= totalCount} variant="outlined">Próxima</Button>
          <Button onClick={load} disabled={loadingList} variant="outlined">
            {loadingList ? 'Atualizando...' : 'Atualizar'}
          </Button>
          {loadingList && <CircularProgress size={18} />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Posse</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Hodômetro</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.plate}</TableCell>
                <TableCell>{v.model || '—'}</TableCell>
                <TableCell>{v.brand || '—'}</TableCell>
                <TableCell>{v.ownership || '—'}</TableCell>
                <TableCell>{v.year ?? '—'}</TableCell>
                <TableCell>{v.odometer ?? '—'}</TableCell>
                <TableCell>{v.created_at ? new Date(v.created_at).toLocaleString() : '—'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => startEdit(v)} disabled={saving || deletingId === v.id}>Editar</Button>
                    <Button size="small" color="error" onClick={() => onDelete(v.id)} disabled={deletingId === v.id}>
                      {deletingId === v.id ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && !loadingList && (
              <TableRow>
                <TableCell colSpan={8}>Nenhum veículo encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={!!ok}
        autoHideDuration={3000}
        onClose={() => setOk(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setOk(null)} variant="filled">
          {ok}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </main>
  );
}
