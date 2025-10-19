'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window { Chart: any }
}

function useThemeVars() {
  const readVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name)?.trim();
  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  const lighten = (hex: string, amt: number) => {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.min(255, Math.round(r + (255 - r) * amt));
    const lg = Math.min(255, Math.round(g + (255 - g) * amt));
    const lb = Math.min(255, Math.round(b + (255 - b) * amt));
    return rgbToHex(lr, lg, lb);
  };
  const darken = (hex: string, amt: number) => {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.max(0, Math.round(r * (1 - amt)));
    const lg = Math.max(0, Math.round(g * (1 - amt)));
    const lb = Math.max(0, Math.round(b * (1 - amt)));
    return rgbToHex(lr, lg, lb);
  };

  const brand = readVar('--color-brand') || '#1e3a8a';
  const text = readVar('--color-text') || '#0f172a';
  const border = readVar('--color-border') || '#cbd5e1';
  const secondary = readVar('--color-secondary') || '#f1f5f9';
  const onBrand = readVar('--color-on-brand') || '#ffffff';
  const radius = readVar('--radius') || '10px';

  return { brand, onBrand, text, border, secondary, radius, lighten, darken };
}

export default function TireDashboardPage() {
  const [chartReady, setChartReady] = useState(false);
  const donutRef = useRef<HTMLCanvasElement | null>(null);
  const trendRef = useRef<HTMLCanvasElement | null>(null);
  const donutChartRef = useRef<any>(null);
  const trendChartRef = useRef<any>(null);

  const { brand, onBrand, text, border, secondary, radius, lighten, darken } = useThemeVars();

  // Filtros e busca
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('12m');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [priority, setPriority] = useState<'Todas' | 'Alta' | 'Média'>('Todas');
  const [search, setSearch] = useState<string>('');

  const kpis = useMemo(() => {
    return [
      { label: 'Estoque Total', value: 522 },
      { label: 'Em Uso', value: 340 },
      { label: 'Preventiva em Dia', value: '87%' },
      { label: 'Pendências Críticas', value: 12 },
    ];
  }, []);

  const distribution = useMemo(() => {
    return {
      labels: ['Pronto para uso', 'Em uso', 'Desgaste (atenção)', 'Substituir'],
      values: [120, 340, 48, 14],
    };
  }, []);

  useEffect(() => {
    // Inicializa seleção de status com todos
    setSelectedStatuses(distribution.labels);
  }, [distribution]);

  const serviceTrend = useMemo(() => {
    return {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      values: [5, 12, 9, 14, 18, 21, 19, 16, 23, 25, 28, 30],
    };
  }, []);

  const alerts = useMemo(() => {
    return [
      { vehicle: 'ABC-1234', issue: 'Pneu dianteiro esq. abaixo de 28 PSI', priority: 'Alta' },
      { vehicle: 'QWE-5678', issue: 'Temperatura acima de 65°C (trajeto urbano)', priority: 'Média' },
      { vehicle: 'XYZ-9012', issue: 'Vida útil < 10% (traseiro dir.)', priority: 'Alta' },
      { vehicle: 'JKL-3456', issue: 'Desbalanceamento detectado (sensor vibração)', priority: 'Média' },
    ];
  }, []);

  // Dados filtrados
  const filteredDistribution = useMemo(() => {
    const values = distribution.values.map((v, i) => (selectedStatuses.includes(distribution.labels[i]) ? v : 0));
    return { labels: distribution.labels, values };
  }, [distribution, selectedStatuses]);

  const filteredTrend = useMemo(() => {
    const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;
    return {
      labels: serviceTrend.labels.slice(-months),
      values: serviceTrend.values.slice(-months),
    };
  }, [serviceTrend, period]);

  const filteredAlerts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return alerts.filter((a) =>
      (priority === 'Todas' || a.priority === priority) &&
      (s === '' || a.vehicle.toLowerCase().includes(s) || a.issue.toLowerCase().includes(s))
    );
  }, [alerts, priority, search]);

  // Export helpers
  const exportAlertsToCSV = () => {
    const header = ['vehicle', 'issue', 'priority'];
    const rows = filteredAlerts.map((a) => [a.vehicle, a.issue, a.priority]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alertas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCanvasToPNG = (chartObj: any, canvasRef: React.RefObject<HTMLCanvasElement>, filename: string) => {
    try {
      const dataUrl = chartObj?.toBase64Image ? chartObj.toBase64Image() : canvasRef.current?.toDataURL('image/png') || '';
      if (!dataUrl) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();
    } catch (e) {
      console.error('Falha ao exportar imagem', e);
    }
  };

  useEffect(() => {
    if (!chartReady || !window.Chart) return;

    // Colors derived from brand for charts
    const brandL = lighten(brand, 0.15);
    const brandLL = lighten(brand, 0.35);
    const brandD = darken(brand, 0.15);

    // Donut chart
    if (donutChartRef.current) {
      donutChartRef.current.destroy();
      donutChartRef.current = null;
    }
    if (donutRef.current) {
      donutChartRef.current = new window.Chart(donutRef.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: filteredDistribution.labels,
          datasets: [
            {
              data: filteredDistribution.values,
              backgroundColor: [brand, brandL, brandLL, brandD],
              borderColor: border,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: text } },
            tooltip: { enabled: true },
          },
        },
      });
    }

    // Trend chart
    if (trendChartRef.current) {
      trendChartRef.current.destroy();
      trendChartRef.current = null;
    }
    if (trendRef.current) {
      trendChartRef.current = new window.Chart(trendRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: filteredTrend.labels,
          datasets: [
            {
              label: 'Serviços/Mês',
              data: filteredTrend.values,
              borderColor: brand,
              backgroundColor: lighten(brand, 0.4),
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: text } },
          },
          scales: {
            x: {
              ticks: { color: text },
              grid: { color: border },
            },
            y: {
              ticks: { color: text },
              grid: { color: border },
            },
          },
        },
      });
    }

    return () => {
      donutChartRef.current?.destroy?.();
      trendChartRef.current?.destroy?.();
    };
  }, [chartReady, brand, text, border, filteredDistribution, filteredTrend]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: text }}>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="afterInteractive" onLoad={() => setChartReady(true)} />

      <header className="sticky top-0 z-10 shadow-md" style={{ background: secondary }}>
        <div className="container px-4 pt-4">
          <h1 className="text-2xl font-bold" style={{ color: brand }}>Painel de Gestão de Pneus</h1>
          <p className="text-sm mb-2" style={{ color: text }}>Monitoramento de estoque, serviços e alertas críticos.</p>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Filtro e exportação */}
        <section className="shadow p-4 mb-6" style={{ background: secondary, border: `1px solid ${border}`, borderRadius: radius }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm" style={{ color: text }}>Período</label>
              <select aria-label="Período" value={period} onChange={(e) => setPeriod(e.target.value as '3m' | '6m' | '12m')}
                style={{ border: `1px solid ${border}`, background: 'var(--color-bg)', color: text, borderRadius: radius, padding: '8px' }}>
                <option value="3m">3 meses</option>
                <option value="6m">6 meses</option>
                <option value="12m">12 meses</option>
              </select>
            </div>
            <div>
              <span className="text-sm block mb-1" style={{ color: text }}>Status do estoque</span>
              <div className="flex flex-wrap gap-2">
                {distribution.labels.map((l) => {
                  const checked = selectedStatuses.includes(l);
                  return (
                    <label key={l} className="text-sm flex items-center gap-2" style={{ color: text }}>
                      <input type="checkbox" checked={checked} onChange={(e) => {
                        setSelectedStatuses((prev) => e.target.checked ? [...prev, l] : prev.filter((x) => x !== l));
                      }} />
                      {l}
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm" style={{ color: text }}>Prioridade</label>
              <select aria-label="Prioridade" value={priority} onChange={(e) => setPriority(e.target.value as 'Todas' | 'Alta' | 'Média')}
                style={{ border: `1px solid ${border}`, background: 'var(--color-bg)', color: text, borderRadius: radius, padding: '8px' }}>
                <option value="Todas">Todas</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
              </select>
            </div>
            <div>
              <label className="text-sm" style={{ color: text }}>Buscar veículo</label>
              <input aria-label="Buscar veículo" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Placa ou id"
                style={{ border: `1px solid ${border}`, background: 'var(--color-bg)', color: text, borderRadius: radius, padding: '8px', width: '100%' }} />
            </div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button onClick={exportAlertsToCSV} className="px-3 py-2" style={{ background: brand, color: onBrand, borderRadius: radius }}>Exportar alertas (CSV)</button>
            <button onClick={() => exportCanvasToPNG(donutChartRef.current, donutRef, 'distribuicao.png')} className="px-3 py-2" style={{ background: brand, color: onBrand, borderRadius: radius }}>Exportar donut (PNG)</button>
            <button onClick={() => exportCanvasToPNG(trendChartRef.current, trendRef, 'servicos.png')} className="px-3 py-2" style={{ background: brand, color: onBrand, borderRadius: radius }}>Exportar linha (PNG)</button>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => (
            <div key={k.label} className="shadow p-4" style={{ background: secondary, border: `1px solid ${border}`, borderRadius: radius }}>
              <div className="text-sm" style={{ color: text }}>{k.label}</div>
              <div className="text-2xl font-extrabold" style={{ color: brand }}>{k.value}</div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="shadow p-4" style={{ background: secondary, border: `1px solid ${border}`, borderRadius: radius }}>
            <h2 className="font-semibold mb-2" style={{ color: brand }}>Distribuição do Estoque</h2>
            <div style={{ position: 'relative', height: 280 }}>
              <canvas ref={donutRef} />
            </div>
          </div>

          <div className="shadow p-4" style={{ background: secondary, border: `1px solid ${border}`, borderRadius: radius }}>
            <h2 className="font-semibold mb-2" style={{ color: brand }}>Frequência de Serviços</h2>
            <div style={{ position: 'relative', height: 280 }}>
              <canvas ref={trendRef} />
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="shadow p-4" style={{ background: secondary, border: `1px solid ${border}`, borderRadius: radius }}>
          <h2 className="font-semibold mb-3" style={{ color: brand }}>Alertas Críticos</h2>
          <ul className="grid gap-2">
            {filteredAlerts.map((a, idx) => (
              <li key={idx} className="p-3" style={{ background: 'var(--color-bg)', border: `1px solid ${border}`, borderRadius: radius }}>
                <div className="flex justify-between">
                  <span style={{ color: text }}>
                    <strong>{a.vehicle}</strong> — {a.issue}
                  </span>
                  <span className="text-xs" style={{ background: brand, color: onBrand, padding: '2px 8px', borderRadius: radius }}>{a.priority}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}