"use client";
import type { Metadata } from 'next';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import SimpleDonutChart from '@/components/charts/SimpleDonutChart';
import { getDb } from '@/lib/firebaseClient';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import GridLite from '@/components/ui/GridLite';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

const modules = [
  { key: 'visao-geral', title: 'Visão Geral', desc: 'KPIs e status operacional em tempo real.' },
  { key: 'pedidos', title: 'Pedidos', desc: 'Gestão de pedidos, tracking e SLA.' },
  { key: 'logistica', title: 'Logística', desc: 'Rotas, last-mile e custos.' },
  { key: 'estoque', title: 'Estoque', desc: 'Níveis, reposição e rupturas.' },
  { key: 'frota', title: 'Gestão de Frota', desc: 'Veículos, manutenções e pneus.' },
  { key: 'financeiro', title: 'Financeiro', desc: 'Faturamento, custos e conciliações.' },
  { key: 'analise', title: 'Análise', desc: 'Relatórios e insights preditivos.' },
];

// Em páginas client, não utilizamos generateStaticParams/metadata.

type Metric = { label: string; value: string | number; ok?: boolean; help?: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function ModulePage({ params }: { params: { module: string } }) {
  const mod = useMemo(() => modules.find((m) => m.key === params.module), [params.module]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [latestShipments, setLatestShipments] = useState<Array<{ id: string; status?: string; created_at?: number; userId?: string }>>([]);
  const [latestInvoices, setLatestInvoices] = useState<Array<{ id: string; status?: string; amount?: number; issued_at?: number }>>([]);
  const [financeSummary, setFinanceSummary] = useState<{ open: number; paid: number; overdue: number }>({ open: 0, paid: 0, overdue: 0 });
  const [agingBuckets, setAgingBuckets] = useState<{ b0_30: number; b31_60: number; b61_90: number; b90p: number }>({ b0_30: 0, b31_60: 0, b61_90: 0, b90p: 0 });
  const [insightText, setInsightText] = useState<string>('');
  const [insightLoading, setInsightLoading] = useState<boolean>(false);
  const [githubStatus, setGithubStatus] = useState<{ open_issues_count?: number; open_prs_count?: number; stargazers_count?: number; forks_count?: number; full_name?: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costTop, setCostTop] = useState<Array<{ id: string; cost?: number; status?: string }>>([]);
  const [alerts, setAlerts] = useState<Array<{ id: string; type?: string; created_at?: number; message?: string }>>([]);
  const [checklist, setChecklist] = useState<Array<{ id: string; item?: string; done?: boolean; updated_at?: number }>>([]);
  const [fleetHealth, setFleetHealth] = useState<{ avgKm: number; avgConsumption: number; preventiveUpcoming: number }>({ avgKm: 0, avgConsumption: 0, preventiveUpcoming: 0 });
  const [lowLifeTires, setLowLifeTires] = useState<Array<{ id: string; life?: number; position?: string; vehicleId?: string }>>([]);
  const [vehiclesData, setVehiclesData] = useState<Array<{ id: string; plate?: string; modelo?: string; km?: number; odometer?: number; status?: string }>>([]);
  const [invoicesData, setInvoicesData] = useState<Array<{ id: string; status?: string; amount?: number; issued_at?: number }>>([]);
  const [inventoryData, setInventoryData] = useState<Array<{ id: string; item?: string; nivel?: number; pontoReposicao?: number }>>([]);
  const [ordersData, setOrdersData] = useState<Array<{ id: string; status?: string; created_at?: number; sla?: number }>>([]);
  // Filtros de visualização (Logística)
  const [vehicleSelected, setVehicleSelected] = useState<string[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<Array<{ id: string; plate?: string; name?: string }>>([]);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND');
  const [statusFilter, setStatusFilter] = useState<{ in_transit: boolean; stopped: boolean; loading_unloading: boolean }>({ in_transit: true, stopped: false, loading_unloading: false });
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');
  const [optShowRoutes, setOptShowRoutes] = useState<boolean>(false);
  const [optShowStops, setOptShowStops] = useState<boolean>(false);
  const [optShowAlerts, setOptShowAlerts] = useState<boolean>(false);
  const [mapShipments, setMapShipments] = useState<Array<{ id: string; status?: string; created_at?: number; lat?: number; lng?: number; location?: { lat?: number; lng?: number }; geo?: { lat?: number; lng?: number }; vehicleId?: string; vehicle_id?: string }>>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setReady(false);
      setError(null);
      setMetrics([]);
      const db = await getDb();
      if (!db) {
        setError('Ambiente não configurado ou sem acesso ao Firestore. Defina NEXT_PUBLIC_FIREBASE_* e faça login se necessário.');
        setReady(true);
        return;
      }
      try {
        const { collection, getDocs, where, limit, query, orderBy } = await import('firebase/firestore');
        const data: Metric[] = [];
        // KPIs básicos comuns
        const postsQ = query(collection(db, 'posts'), where('is_published', '==', true), limit(10));
        const postsSnap = await getDocs(postsQ);
        data.push({ label: 'Posts publicados', value: postsSnap.size, ok: true });
        const shipmentsSnap = await getDocs(collection(db, 'shipments'));
        data.push({ label: 'Shipments', value: shipmentsSnap.size, ok: true });
        // KPIs de logística
        const inTransitSnap = await getDocs(query(collection(db, 'shipments'), where('status', '==', 'in_transit')));
        data.push({ label: 'Em trânsito', value: inTransitSnap.size, ok: true });
        const delayedSnap = await getDocs(query(collection(db, 'shipments'), where('status', '==', 'delayed')));
        data.push({ label: 'Atrasados', value: delayedSnap.size, ok: true });
        const deliveredSnap = await getDocs(query(collection(db, 'shipments'), where('status', '==', 'delivered')));
        data.push({ label: 'Entregues', value: deliveredSnap.size, ok: true });
        const veiculosSnap = await getDocs(collection(db, 'veiculos'));
        data.push({ label: 'Veículos', value: veiculosSnap.size, ok: true });
        try {
          const vOpts = veiculosSnap.docs.map((d) => {
            const v = d.data() as any;
            return { id: d.id, plate: v.placa || v.plate, name: v.modelo || v.name };
          });
          setVehicleOptions(vOpts);
        } catch {}
        const pneusSnap = await getDocs(collection(db, 'pneus'));
        data.push({ label: 'Pneus', value: pneusSnap.size, ok: true });
        // Custos de logística (usa snapshot de shipments já obtido)
        try {
          let totalCost = 0;
          let countCost = 0;
          const shipmentsCostDocs = shipmentsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          const orderedByCost = shipmentsCostDocs.sort((a, b) => (b.cost || 0) - (a.cost || 0));
          for (const s of shipmentsCostDocs) {
            if (typeof s.cost === 'number') { totalCost += s.cost; countCost++; }
          }
          if (countCost > 0) {
            const avg = totalCost / countCost;
            data.push({ label: 'Custo total (shipments)', value: totalCost.toFixed(2), ok: true });
            data.push({ label: 'Custo médio', value: avg.toFixed(2), ok: true });
          }
          setCostTop(orderedByCost.slice(0, 5));
        } catch {}

        if (mod?.key === 'pedidos') {
          try {
            const pedidosQ = query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(50));
            const pedidosSnap = await getDocs(pedidosQ);
            const list = pedidosSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            setOrdersData(list);
            data.push({ label: 'Pedidos (últimos)', value: pedidosSnap.size, ok: true, help: 'Total dos últimos registros.' });
          } catch {
            // Fallback: usar shipments como pedidos
            const pedidosQ = query(collection(db, 'shipments'), orderBy('created_at', 'desc'), limit(50));
            const pedidosSnap = await getDocs(pedidosQ);
            const list = pedidosSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            setOrdersData(list);
            data.push({ label: 'Pedidos (via shipments)', value: pedidosSnap.size, ok: true });
          }
        }
        if (mod?.key === 'financeiro') {
          const invoicesColl = collection(db, 'invoices');
          let invoicesSnap;
          try {
            const q = query(invoicesColl, orderBy('issued_at', 'desc'), limit(5));
            invoicesSnap = await getDocs(q);
          } catch {
            invoicesSnap = await getDocs(invoicesColl);
          }
          const receivablesSnap = await getDocs(collection(db, 'receivables'));
          const payablesSnap = await getDocs(collection(db, 'payables'));
          data.push({ label: 'Invoices', value: invoicesSnap.size, ok: true });
          data.push({ label: 'Recebíveis', value: receivablesSnap.size, ok: true });
          data.push({ label: 'Pagáveis', value: payablesSnap.size, ok: true });

          let totalOpen = 0, totalPaid = 0, totalOverdue = 0;
          for (const d of invoicesSnap.docs) {
            const v = d.data() as any;
            const amt = typeof v.amount === 'number' ? v.amount : 0;
            const status = v.status || 'open';
            if (status === 'paid') totalPaid += amt;
            else if (status === 'overdue') totalOverdue += amt;
            else totalOpen += amt;
          }
          setFinanceSummary({ open: totalOpen, paid: totalPaid, overdue: totalOverdue });
          data.push({ label: 'A receber (open)', value: totalOpen.toFixed(2), ok: true });
          data.push({ label: 'Recebido (paid)', value: totalPaid.toFixed(2), ok: true });
          data.push({ label: 'Em atraso', value: totalOverdue.toFixed(2), ok: true });

          const latestInv = invoicesSnap.docs.slice(0, 5).map((d) => ({ id: d.id, ...(d.data() as any) }));
          setLatestInvoices(latestInv);
          // full list for DataGrid (limit to 200 to avoid heavy UI)
          setInvoicesData(invoicesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })).slice(0, 200));

          // Aging de recebíveis por due_at
          try {
            let b0_30 = 0, b31_60 = 0, b61_90 = 0, b90p = 0;
            const now = Date.now();
            for (const d of receivablesSnap.docs) {
              const v = d.data() as any;
              const amt = typeof v.amount === 'number' ? v.amount : 0;
              const due = typeof v.due_at === 'number' ? v.due_at : (v.dueAt || 0);
              const status = v.status || 'open';
              if (status === 'paid') continue;
              const days = due ? Math.floor((now - due) / (1000 * 60 * 60 * 24)) : 0;
              if (days <= 30) b0_30 += amt;
              else if (days <= 60) b31_60 += amt;
              else if (days <= 90) b61_90 += amt;
              else b90p += amt;
            }
            setAgingBuckets({ b0_30, b31_60, b61_90, b90p });
          } catch {}
        }
        if (mod?.key === 'analise') {
          data.push({ label: 'Relatórios gerados', value: 0, ok: true, help: 'Conecte pipeline de IA/BI para popular.' });
        }
        if (mod?.key === 'estoque') {
          const estoqueSnap = await getDocs(collection(db, 'estoque'));
          data.push({ label: 'Itens de estoque', value: estoqueSnap.size, ok: true });
          const list = estoqueSnap.docs.map((d) => {
            const v = d.data() as any;
            return {
              id: d.id,
              item: v.item || v.itemName || v.name || d.id,
              nivel: typeof v.nivel === 'number' ? v.nivel : (typeof v.nivelAtual === 'number' ? v.nivelAtual : (typeof v.stock === 'number' ? v.stock : 0)),
              pontoReposicao: typeof v.pontoReposicao === 'number' ? v.pontoReposicao : (typeof v.reorderPoint === 'number' ? v.reorderPoint : 0),
            };
          });
          setInventoryData(list);
        }
        if (mod?.key === 'logistica') {
          // Lista de últimos shipments
          let latestDocs;
          try {
            const latestQ = query(collection(db, 'shipments'), orderBy('created_at', 'desc'), limit(5));
            latestDocs = await getDocs(latestQ);
          } catch {
            latestDocs = await getDocs(collection(db, 'shipments'));
          }
          const latest = latestDocs.docs.slice(0, 5).map((d) => ({ id: d.id, ...(d.data() as any) }));
          setLatestShipments(latest);
          // Status do GitHub (opcional)
          const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
          const repo = process.env.NEXT_PUBLIC_GITHUB_REPO; // owner/name
          if (projectId && repo) {
            const url = `https://us-central1-${projectId}.cloudfunctions.net/githubProxy`;
            try {
              const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo }) });
              const j = await r.json();
              setGithubStatus(j);
            } catch {}
          }
          // Alertas e Checklist
          try {
            const alertsSnap = await getDocs(collection(db, 'alerts'));
            setAlerts(alertsSnap.docs.slice(0, 5).map((d) => ({ id: d.id, ...(d.data() as any) })));
          } catch {}
          try {
            const checklistSnap = await getDocs(collection(db, 'checklist'));
            setChecklist(checklistSnap.docs.slice(0, 5).map((d) => ({ id: d.id, ...(d.data() as any) })));
          } catch {}
        }
        if (mod?.key === 'frota') {
          const veiculosSnap2 = await getDocs(collection(db, 'veiculos'));
          data.push({ label: 'Veículos', value: veiculosSnap2.size, ok: true });
          const manutencoesSnap = await getDocs(collection(db, 'manutencoes'));
          data.push({ label: 'Manutenções', value: manutencoesSnap.size, ok: true });
          const pneusSnap2 = await getDocs(collection(db, 'pneus'));
          data.push({ label: 'Pneus', value: pneusSnap2.size, ok: true });
          // Próximas manutenções
          let maintDocs;
          try {
            const { orderBy } = await import('firebase/firestore');
            maintDocs = await getDocs(query(collection(db, 'manutencoes'), orderBy('schedule_at', 'desc'), limit(5)));
          } catch {
            maintDocs = await getDocs(collection(db, 'manutencoes'));
          }
          setLatestShipments(maintDocs.docs.slice(0, 5).map((d) => ({ id: d.id, ...(d.data() as any) })));

          // Painel de saúde: agregados
          try {
            const vs = veiculosSnap2.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            const pneus = pneusSnap2.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            let kmSum = 0, kmCount = 0, consSum = 0, consCount = 0;
            for (const v of vs) {
              const km = typeof v.km === 'number' ? v.km : (typeof v.odometer === 'number' ? v.odometer : null);
              if (typeof km === 'number') { kmSum += km; kmCount++; }
              const cons = typeof v.avg_consumption === 'number' ? v.avg_consumption : (typeof v.consumption === 'number' ? v.consumption : null);
              if (typeof cons === 'number') { consSum += cons; consCount++; }
            }
            setVehiclesData(vs);
            const avgKm = kmCount ? kmSum / kmCount : 0;
            const avgConsumption = consCount ? consSum / consCount : 0;
            const preventiveUpcoming = maintDocs.docs.filter((d) => {
              const v = d.data() as any;
              const status = v.status || 'scheduled';
              return status === 'scheduled';
            }).length;
            setFleetHealth({ avgKm, avgConsumption, preventiveUpcoming });

            const low = pneus.filter((p) => typeof p.life === 'number' && p.life <= 20).sort((a, b) => (a.life || 0) - (b.life || 0)).slice(0, 5);
            setLowLifeTires(low);
          } catch {}
        }
        if (active) setMetrics(data);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setReady(true);
      }
    })();
    return () => { active = false; };
  }, [params.module, mod?.key]);

  async function refreshMap() {
    try {
      const db = await getDb();
      if (!db) return;
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const statusesSelected = Object.entries(statusFilter).filter(([, v]) => v).map(([k]) => k);
      const vehiclesSelected = (typeof (vehicleSelected as any) !== 'undefined') ? vehicleSelected : [];
      const startTs = periodStart ? Date.parse(periodStart) : null;
      const endTs = periodEnd ? Date.parse(periodEnd) : null;

      let items: Array<any> = [];
      const baseColl = collection(db, 'shipments');
      try {
        if ((filterMode as any) === 'AND') {
          let q: any = baseColl;
          if (statusesSelected.length > 0) {
            if (statusesSelected.length === 1) q = query(q, where('status', '==', statusesSelected[0]));
            else q = query(q, where('status', 'in', statusesSelected.slice(0, 10)));
          }
          if (vehiclesSelected.length > 0) {
            try {
              if (vehiclesSelected.length === 1) q = query(q, where('vehicleId', '==', vehiclesSelected[0]));
              else q = query(q, where('vehicleId', 'in', vehiclesSelected.slice(0, 10)));
            } catch {
              if (vehiclesSelected.length === 1) q = query(q, where('vehicle_id', '==', vehiclesSelected[0]));
              else q = query(q, where('vehicle_id', 'in', vehiclesSelected.slice(0, 10)));
            }
          }
          if (startTs) q = query(q, where('created_at', '>=', startTs));
          if (endTs) q = query(q, where('created_at', '<=', endTs));
          const docs = await getDocs(q);
          items = docs.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        } else {
          // OR: união de resultados por status e por veículos
          let byStatus: any[] = [];
          let byVehicle: any[] = [];
          if (statusesSelected.length > 0) {
            let q1: any = baseColl;
            if (statusesSelected.length === 1) q1 = query(q1, where('status', '==', statusesSelected[0]));
            else q1 = query(q1, where('status', 'in', statusesSelected.slice(0, 10)));
            const docs1 = await getDocs(q1);
            byStatus = docs1.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          }
          if (vehiclesSelected.length > 0) {
            let q2: any = baseColl;
            try {
              if (vehiclesSelected.length === 1) q2 = query(q2, where('vehicleId', '==', vehiclesSelected[0]));
              else q2 = query(q2, where('vehicleId', 'in', vehiclesSelected.slice(0, 10)));
            } catch {
              if (vehiclesSelected.length === 1) q2 = query(q2, where('vehicle_id', '==', vehiclesSelected[0]));
              else q2 = query(q2, where('vehicle_id', 'in', vehiclesSelected.slice(0, 10)));
            }
            const docs2 = await getDocs(q2);
            byVehicle = docs2.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          }
          const m = new Map<string, any>();
          [...byStatus, ...byVehicle].forEach((s) => { m.set(s.id, s); });
          items = Array.from(m.values());
        }
      } catch {
        // Fallback: carrega todos e filtra em memória
        const docs = await getDocs(baseColl);
        items = docs.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      }

      // Filtros por período e segurança
      if (startTs) items = items.filter((s) => typeof s.created_at === 'number' ? s.created_at >= startTs : true);
      if (endTs) items = items.filter((s) => typeof s.created_at === 'number' ? s.created_at <= endTs : true);
      if (statusesSelected.length > 0) items = items.filter((s) => statusesSelected.includes(s.status));
      if (vehiclesSelected.length > 0) items = items.filter((s) => {
        const vid = (s as any).vehicleId || (s as any).vehicle_id || (s as any).veiculoId || (s as any).veiculo_id;
        return vid ? vehiclesSelected.includes(vid) : false;
      });

      setMapShipments(items.slice(0, 50));
      setLatestShipments(items.slice(0, 5));
    } catch {}
  }

  async function generateInsights() {
    setInsightLoading(true);
    try {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!projectId) throw new Error('Defina NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      const url = `https://us-central1-${projectId}.cloudfunctions.net/geminiProxy`;
      const summary = metrics.map(m => `${m.label}: ${m.value}`).join('\n');
      const prompt = `Você é um analista logístico. A partir dos KPIs a seguir, produza um resumo curto com pontos de atenção e ações recomendadas (bullet points).\n\n${summary}`;
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, model: 'gemini-1.5-flash-latest' }) });
      const j = await r.json();
      const text = j?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('\n') || JSON.stringify(j);
      setInsightText(text);
    } catch (e: any) {
      setInsightText(e?.message || String(e));
    } finally {
      setInsightLoading(false);
    }
  }

  if (!mod) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
        <h1>Dashboard</h1>
        <p>Módulo não encontrado.</p>
        <Link href="/dashboard" style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>Voltar</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '1rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
      <aside style={{ border: '1px solid #333', borderRadius: 8, padding: 16, height: 'fit-content' }}>
        <h3 style={{ marginTop: 0 }}>Módulos</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {modules.map((m) => (
            <Link key={m.key} href={`/dashboard/${m.key}`} style={{ textDecoration: 'none' }}>
              <div style={{
                border: '1px solid #333', borderRadius: 8, padding: '8px 12px',
                background: m.key === mod.key ? '#1b1b1b' : '#111', color: '#ddd'
              }}>
                <strong>{m.title}</strong>
                <div style={{ color: '#888', fontSize: 12 }}>{m.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <hr style={{ borderColor: '#333', margin: '12px 0' }} />
        <h4 style={{ marginTop: 0 }}>Atalhos</h4>
        <div style={{ display: 'grid', gap: 6 }}>
          <Link href="/driver" style={{ color: '#9ecfff' }}>App do Motorista</Link>
          <Link href="/mechanic" style={{ color: '#9ecfff' }}>App do Mecânico</Link>
          <Link href="/cadastro/motoristas" style={{ color: '#9ecfff' }}>Cadastro: Motoristas</Link>
          <Link href="/cadastro/veiculos" style={{ color: '#9ecfff' }}>Cadastro: Veículos</Link>
          <Link href="/usuarios" style={{ color: '#9ecfff' }}>Cadastro: Usuários</Link>
        </div>
      </aside>
      <div>
        <h1 style={{ marginTop: 0 }}>{mod.title}</h1>
        <p style={{ color: '#888' }}>{mod.desc}</p>

        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        {error && (
          <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
            <p style={{ color: '#d32f2f' }}>{error}</p>
          </div>
        )}

        <Section title="KPIs">
          {ready && metrics.length === 0 ? (
            <p style={{ color: '#aaa' }}>Sem dados para exibir.</p>
          ) : (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ border: '1px solid #333', borderRadius: 8, padding: 16, minWidth: 180 }}>
                  <p style={{ margin: 0, color: '#aaa' }}>{m.label}</p>
                  <p style={{ margin: 0, fontSize: 20 }}>{String(m.value)}</p>
                  {m.help && <small style={{ color: '#888' }}>{m.help}</small>}
                  {m.ok !== undefined && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, background: m.ok ? '#1b5e20' : '#555', color: '#fff' }}>{m.ok ? 'OK' : 'N/A'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {mod.key === 'logistica' && (
          <Section title="Filtros de Visualização">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#aaa' }}>Veículos</p>
                <div style={{ border: '1px solid #333', borderRadius: 6, padding: 8, maxHeight: 140, overflow: 'auto' }}>
                  {vehicleOptions.length === 0 ? (
                    <small style={{ color: '#888' }}>Sem veículos cadastrados.</small>
                  ) : (
                    <div style={{ display: 'grid', gap: 6 }}>
                      {vehicleOptions.map((v) => {
                        const label = v.plate ? `${v.plate} (${v.id})` : (v.name ? `${v.name} (${v.id})` : v.id);
                        const checked = vehicleSelected.includes(v.id);
                        return (
                          <label key={v.id} style={{ color: '#ddd', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="checkbox" checked={checked} onChange={(e) => {
                              setVehicleSelected((prev) => e.target.checked ? [...prev, v.id] : prev.filter((x) => x !== v.id));
                            }} />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button onClick={() => setVehicleSelected([])} style={{ border: '1px solid #333', borderRadius: 6, padding: '4px 8px' }}>Limpar</button>
                  <button onClick={() => setVehicleSelected(vehicleOptions.map(v => v.id))} style={{ border: '1px solid #333', borderRadius: 6, padding: '4px 8px' }}>Selecionar todos</button>
                </div>
              </div>
              <div>
                <p style={{ margin: 0, color: '#aaa' }}>Status</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => setStatusFilter(s => ({ ...s, in_transit: !s.in_transit }))} style={{ border: '1px solid #333', borderRadius: 16, padding: '4px 10px', background: statusFilter.in_transit ? '#1b5e20' : '#222', color: '#fff' }}>Em trânsito</button>
                  <button onClick={() => setStatusFilter(s => ({ ...s, stopped: !s.stopped }))} style={{ border: '1px solid #333', borderRadius: 16, padding: '4px 10px', background: statusFilter.stopped ? '#1b5e20' : '#222', color: '#fff' }}>Parado</button>
                  <button onClick={() => setStatusFilter(s => ({ ...s, loading_unloading: !s.loading_unloading }))} style={{ border: '1px solid #333', borderRadius: 16, padding: '4px 10px', background: statusFilter.loading_unloading ? '#1b5e20' : '#222', color: '#fff' }}>Em carga/descarga</button>
                </div>
              </div>
              <div>
                <p style={{ margin: 0, color: '#aaa' }}>Período</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} style={{ background: '#111', color: '#ddd', border: '1px solid #333', borderRadius: 6, padding: 8 }} />
                  <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} style={{ background: '#111', color: '#ddd', border: '1px solid #333', borderRadius: 6, padding: 8 }} />
                </div>
              </div>
              <div>
                <p style={{ margin: 0, color: '#aaa' }}>Combinação dos filtros</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setFilterMode('AND')} style={{ border: '1px solid #333', borderRadius: 16, padding: '4px 10px', background: filterMode === 'AND' ? '#1b5e20' : '#222', color: '#fff' }}>AND</button>
                  <button onClick={() => setFilterMode('OR')} style={{ border: '1px solid #333', borderRadius: 16, padding: '4px 10px', background: filterMode === 'OR' ? '#1b5e20' : '#222', color: '#fff' }}>OR</button>
                </div>
              </div>
            </div>
            <hr style={{ borderColor: '#333', margin: '12px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <label style={{ color: '#ddd' }}>
                  <input type="checkbox" checked={optShowRoutes} onChange={(e) => setOptShowRoutes(e.target.checked)} style={{ marginRight: 8 }} /> Mostrar rotas planejadas
                </label>
                <label style={{ color: '#ddd' }}>
                  <input type="checkbox" checked={optShowStops} onChange={(e) => setOptShowStops(e.target.checked)} style={{ marginRight: 8 }} /> Mostrar pontos de parada
                </label>
                <label style={{ color: '#ddd' }}>
                  <input type="checkbox" checked={optShowAlerts} onChange={(e) => setOptShowAlerts(e.target.checked)} style={{ marginRight: 8 }} /> Mostrar alertas
                </label>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button onClick={refreshMap} style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>Atualizar Mapa</button>
              </div>
            </div>
          </Section>
        )}

        {mod.key === 'logistica' && (
          <Section title="Mapa de Rastreamento em Tempo Real">
            {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
              <>
                <p style={{ color: '#888' }}>
                  Configure `NEXT_PUBLIC_MAPBOX_TOKEN` para habilitar o mapa real (Mapbox GL). Em dev, exibimos um placeholder.
                </p>
                <div style={{ border: '1px dashed #444', borderRadius: 8, height: 280, marginTop: 8, display: 'grid', placeItems: 'center' }}>
                  <small style={{ color: '#888' }}>Área do mapa (placeholder)</small>
                </div>
              </>
            ) : (
              <div style={{ border: '1px solid #333', borderRadius: 8, height: 320, marginTop: 8 }}>
                <LiveMap shipments={mapShipments} showStops={optShowStops} showRoutes={optShowRoutes} showAlerts={optShowAlerts} />
              </div>
            )}
          </Section>
        )}

        {mod.key === 'logistica' && (
          <Section title="Insights IA">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <button onClick={generateInsights} disabled={insightLoading} style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>
                {insightLoading ? 'Gerando...' : 'Gerar insights IA'}
              </button>
              {!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && (
                <small style={{ color: '#d32f2f' }}>Configure NEXT_PUBLIC_FIREBASE_PROJECT_ID para usar IA.</small>
              )}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', color: '#ddd' }}>{insightText || 'Sem insights gerados ainda.'}</div>
          </Section>
        )}

        {mod.key === 'logistica' && (
          <Section title="Últimos Shipments">
            {latestShipments.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem registros recentes.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {latestShipments.map((s) => (
                  <div key={s.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{s.id}</strong>
                      <div style={{ color: '#888' }}>Status: {s.status || 'N/A'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: '#888' }}>Criado: {s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}</small>
                      <div><small style={{ color: '#888' }}>User: {s.userId || 'N/A'}</small></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {mod.key === 'logistica' && (
          <Section title="Tabela de Shipments">
            {latestShipments.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem dados.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Veículo</TableCell>
                      <TableCell>Data/Hora</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {latestShipments.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.id}</TableCell>
                        <TableCell>{s.status || 'N/A'}</TableCell>
                        <TableCell>{(s as any).vehicleId || (s as any).vehicle_id || '-'}</TableCell>
                        <TableCell>{s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Section>
        )}

        {mod.key === 'logistica' && (
          <Section title="Análise de Custos">
            {costTop.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem custos registrados nos shipments.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {costTop.map((c) => (
                  <div key={c.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{c.id}</strong>
                      <div style={{ color: '#888' }}>Status: {c.status || 'N/A'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: '#888' }}>Custo: {typeof c.cost === 'number' ? c.cost.toFixed(2) : 'N/A'}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {mod.key === 'logistica' && (
          <Section title="Alertas e Checklist">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <h4 style={{ marginTop: 0 }}>Últimos Alertas</h4>
                {alerts.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Sem alertas.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {alerts.map((a) => (
                      <div key={a.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>{a.type || 'alerta'}</strong>
                          <small style={{ color: '#888' }}>{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</small>
                        </div>
                        <div style={{ color: '#888' }}>{a.message || ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ marginTop: 0 }}>Checklist</h4>
                {checklist.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Sem itens.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {checklist.map((c) => (
                      <div key={c.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{c.item || c.id}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, background: c.done ? '#1b5e20' : '#555', color: '#fff' }}>{c.done ? 'OK' : 'Pendente'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {mod.key === 'logistica' && githubStatus && (
          <Section title="Status do GitHub">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, color: '#aaa' }}>Repo</p>
                <p style={{ margin: 0 }}>{githubStatus.full_name}</p>
              </div>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, color: '#aaa' }}>Issues abertas</p>
                <p style={{ margin: 0 }}>{githubStatus.open_issues_count ?? 'N/A'}</p>
              </div>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, color: '#aaa' }}>PRs abertos</p>
                <p style={{ margin: 0 }}>{githubStatus.open_prs_count ?? 'N/A'}</p>
              </div>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, color: '#aaa' }}>Stars</p>
                <p style={{ margin: 0 }}>{githubStatus.stargazers_count ?? 'N/A'}</p>
              </div>
              <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                <p style={{ margin: 0, color: '#aaa' }}>Forks</p>
                <p style={{ margin: 0 }}>{githubStatus.forks_count ?? 'N/A'}</p>
              </div>
            </div>
          </Section>
        )}

        {mod.key === 'pedidos' && (
          <Section title="Filtros de Visualização">
            <small style={{ color: '#888' }}>Em trânsito · Parado · Em carga/descarga</small>
            <hr style={{ borderColor: '#333' }} />
            <small style={{ color: '#888' }}>Período: selecione intervalo e opções para atualizar o mapa.</small>
          </Section>
        )}

        {mod.key === 'frota' && (
          <Section title="Próximas Manutenções">
            {latestShipments.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem manutenções futuras registradas.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {latestShipments.map((m) => (
                  <div key={m.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{m.id}</strong>
                      <div style={{ color: '#888' }}>Status: {(m as any).status || 'N/A'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: '#888' }}>Programada: {(m as any).schedule_at ? new Date((m as any).schedule_at).toLocaleDateString() : 'N/A'}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {mod.key === 'frota' && (
          <Section title="Saúde da Frota">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                    <p style={{ margin: 0, color: '#888' }}>Quilometragem média</p>
                    <p style={{ margin: 0, fontSize: 20 }}>{fleetHealth.avgKm.toFixed(0)} km</p>
                  </div>
                  <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                    <p style={{ margin: 0, color: '#888' }}>Consumo médio</p>
                    <p style={{ margin: 0, fontSize: 20 }}>{fleetHealth.avgConsumption.toFixed(2)} L/100km</p>
                  </div>
                  <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                    <p style={{ margin: 0, color: '#888' }}>Manutenção preventiva pendente</p>
                    <p style={{ margin: 0, fontSize: 20 }}>{fleetHealth.preventiveUpcoming}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ marginTop: 0 }}>Pneus com vida útil baixa (≤ 20%)</h4>
                {lowLifeTires.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Nenhum pneu crítico.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {lowLifeTires.map((p) => (
                      <div key={p.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{p.position || p.id}</strong>
                          <div style={{ color: '#888' }}>Veículo: {p.vehicleId || '-'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <small style={{ color: '#888' }}>Vida: {typeof p.life === 'number' ? `${p.life.toFixed(0)}%` : 'N/A'}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {mod.key === 'frota' && (
          <Section title="Veículos">
            {vehiclesData.length === 0 ? (
              <p style={{ color: '#aaa' }}>Nenhum veículo encontrado.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Placa</TableCell>
                      <TableCell>Modelo</TableCell>
                      <TableCell>KM</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehiclesData.slice(0, 20).map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.id}</TableCell>
                        <TableCell>{(v as any).placa || v.plate || '-'}</TableCell>
                        <TableCell>{(v as any).modelo || (v as any).name || '-'}</TableCell>
                        <TableCell>{typeof v.km === 'number' ? v.km : (typeof v.odometer === 'number' ? v.odometer : 'N/A')}</TableCell>
                        <TableCell>{(v as any).status || 'active'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Section>
        )}

        {mod.key === 'financeiro' && (
          <Section title="Últimas Invoices">
            {latestInvoices.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem invoices recentes.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {latestInvoices.map((s) => (
                  <div key={s.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{s.id}</strong>
                      <div style={{ color: '#888' }}>Status: {s.status || 'open'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: '#888' }}>Valor: {typeof s.amount === 'number' ? s.amount.toFixed(2) : 'N/A'}</small>
                      <div><small style={{ color: '#888' }}>Emitida: {s.issued_at ? new Date(s.issued_at).toLocaleDateString() : 'N/A'}</small></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {mod.key === 'financeiro' && (
          <Section title="Gráficos Financeiros">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <h4 style={{ marginTop: 0 }}>Receita x A receber x Em atraso</h4>
                <SimpleBarChart
                  labels={['Recebido (paid)', 'A receber (open)', 'Em atraso (overdue)']}
                  values={[financeSummary.paid, financeSummary.open, financeSummary.overdue]}
                  colors={["#43a047", "#1976d2", "#e53935"]}
                />
              </div>
              <div>
                <h4 style={{ marginTop: 0 }}>Aging de Recebíveis</h4>
                <SimpleDonutChart
                  labels={['0-30', '31-60', '61-90', '90+']}
                  values={[agingBuckets.b0_30, agingBuckets.b31_60, agingBuckets.b61_90, agingBuckets.b90p]}
                  colors={["#43a047", "#ffb300", "#1976d2", "#e53935"]}
                />
              </div>
            </div>
          </Section>
        )}

        {mod.key === 'financeiro' && (
          <Section title="Tabela de Invoices">
            {invoicesData.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem invoices.</p>
            ) : (
              <div style={{ width: '100%' }}>
                <GridLite
                  rows={invoicesData.map((r) => ({
                    id: r.id,
                    status: r.status || 'open',
                    amount: typeof r.amount === 'number' ? r.amount : 0,
                    issued_at: r.issued_at ? new Date(r.issued_at).toLocaleDateString() : '',
                  }))}
                  columns={[
                    { field: 'id', headerName: 'ID', flex: 1 },
                    { field: 'status', headerName: 'Status', flex: 1 },
                    { field: 'amount', headerName: 'Valor', flex: 1, valueFormatter: (v) => Number(v).toFixed(2) },
                    { field: 'issued_at', headerName: 'Emissão', flex: 1 },
                  ]}
                  pageSizeOptions={[10, 20, 50]}
                />
              </div>
            )}
          </Section>
        )}

        {mod.key === 'estoque' && (
          <Section title="Tabela de Estoque">
            {inventoryData.length === 0 ? (
              <p style={{ color: '#aaa' }}>Nenhum item de estoque.</p>
            ) : (
              <div style={{ width: '100%' }}>
                <GridLite
                  rows={inventoryData.map((r) => ({
                    id: r.id,
                    item: r.item || r.id,
                    nivel: typeof r.nivel === 'number' ? r.nivel : 0,
                    pontoReposicao: typeof r.pontoReposicao === 'number' ? r.pontoReposicao : 0,
                    alerta: (typeof r.nivel === 'number' ? r.nivel : 0) <= (typeof r.pontoReposicao === 'number' ? r.pontoReposicao : 0),
                  }))}
                  columns={[
                    { field: 'item', headerName: 'Item', flex: 1 },
                    { field: 'nivel', headerName: 'Nível', flex: 1 },
                    { field: 'pontoReposicao', headerName: 'Ponto de Reposição', flex: 1 },
                    { field: 'alerta', headerName: 'Alerta', flex: 1, valueFormatter: (v) => (v ? 'Repor' : 'OK') },
                  ]}
                  pageSizeOptions={[10, 20, 50]}
                />
              </div>
            )}
          </Section>
        )}

        {mod.key === 'pedidos' && (
          <Section title="Tabela de Pedidos">
            {ordersData.length === 0 ? (
              <p style={{ color: '#aaa' }}>Sem pedidos.</p>
            ) : (
              <div style={{ width: '100%' }}>
                <GridLite
                  rows={ordersData.map((r) => ({
                    id: r.id,
                    status: r.status || 'N/A',
                    created_at: r.created_at ? new Date(r.created_at).toLocaleString() : '',
                    sla: typeof r.sla === 'number' ? r.sla : (typeof (r as any).sla_hours === 'number' ? (r as any).sla_hours : null),
                  }))}
                  columns={[
                    { field: 'id', headerName: 'ID', flex: 1 },
                    { field: 'status', headerName: 'Status', flex: 1 },
                    { field: 'created_at', headerName: 'Criado em', flex: 1 },
                    { field: 'sla', headerName: 'SLA (h)', flex: 1 },
                  ]}
                  pageSizeOptions={[10, 20, 50]}
                />
              </div>
            )}
          </Section>
        )}

        <Section title="Ações">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>Voltar</Link>
            <Link href="/login" style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>Login</Link>
            <Link href="/signup" style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>Cadastro</Link>
          </div>
        </Section>
        </div>
      </div>
    </div>
  );
}