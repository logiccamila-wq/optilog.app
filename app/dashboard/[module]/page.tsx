'use client';
import type { Metadata } from 'next';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import SimpleDonutChart from '@/components/charts/SimpleDonutChart';

import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import GridLite from '@/components/ui/GridLite';
import { apiFetch } from '@/utils/api';
import { useToast } from '@/components/ui/ToastProvider';
import { useI18n } from '@/app/providers/I18nProvider';
import { mlPredictRisk, type MLPredictInput } from '@/utils/ml';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

const modules = [
  { key: 'visao-geral', title: 'Visão Geral', desc: 'KPIs e status operacional em tempo real.' },
  { key: 'pedidos', title: 'Pedidos', desc: 'Gestão de pedidos, tracking e SLA.' },
  { key: 'crm', title: 'CRM', desc: 'Clientes e Produtos.' },
  { key: 'logistica', title: 'Logística', desc: 'Rotas, last-mile e custos.' },
  { key: 'estoque', title: 'Estoque', desc: 'Níveis, reposição e rupturas.' },
  { key: 'frota', title: 'Gestão de Frota', desc: 'Veículos, manutenções e pneus.' },
  { key: 'pneus', title: 'Gestão de Pneus', desc: 'Manutenções, sensores e ciclo de vida.' },
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
  const { t } = useI18n();
  const moduleKeyMap: Record<string, string> = {
    'visao-geral': 'overview',
    pedidos: 'orders',
    crm: 'crm',
    logistica: 'logistics',
    estoque: 'inventory',
    frota: 'fleet',
    pneus: 'tires',
    financeiro: 'finance',
    analise: 'analytics',
  };
  const moduleKey = mod ? moduleKeyMap[mod.key] ?? mod.key : 'overview';
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [latestShipments, setLatestShipments] = useState<
    Array<{ id: string; status?: string; created_at?: number; userId?: string }>
  >([]);
  const [latestInvoices, setLatestInvoices] = useState<
    Array<{ id: string; status?: string; amount?: number; issued_at?: number }>
  >([]);
  const [financeSummary, setFinanceSummary] = useState<{
    open: number;
    paid: number;
    overdue: number;
  }>({ open: 0, paid: 0, overdue: 0 });
  const [agingBuckets, setAgingBuckets] = useState<{
    b0_30: number;
    b31_60: number;
    b61_90: number;
    b90p: number;
  }>({ b0_30: 0, b31_60: 0, b61_90: 0, b90p: 0 });
  const [insightText, setInsightText] = useState<string>('');
  const [insightLoading, setInsightLoading] = useState<boolean>(false);
  const [githubStatus, setGithubStatus] = useState<{
    open_issues_count?: number;
    open_prs_count?: number;
    stargazers_count?: number;
    forks_count?: number;
    full_name?: string;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costTop, setCostTop] = useState<Array<{ id: string; cost?: number; status?: string }>>([]);
  const [alerts, setAlerts] = useState<
    Array<{ id: string; type?: string; created_at?: number; message?: string }>
  >([]);
  const [checklist, setChecklist] = useState<
    Array<{ id: string; item?: string; done?: boolean; updated_at?: number }>
  >([]);
  const [fleetHealth, setFleetHealth] = useState<{
    avgKm: number;
    avgConsumption: number;
    preventiveUpcoming: number;
  }>({ avgKm: 0, avgConsumption: 0, preventiveUpcoming: 0 });
  const [lowLifeTires, setLowLifeTires] = useState<
    Array<{ id: string; life?: number; position?: string; vehicleId?: string }>
  >([]);
  const [vehiclesData, setVehiclesData] = useState<
    Array<{
      id: string;
      plate?: string;
      modelo?: string;
      km?: number;
      odometer?: number;
      status?: string;
    }>
  >([]);
  const [shipmentsData, setShipmentsData] = useState<Array<{ id: string; lat?: number; lng?: number; status?: string }>>([]);
const [riskByShipment, setRiskByShipment] = useState<Record<string, { risk_probability: number; risk_label: 0 | 1 }>>({});
  const [showStops, setShowStops] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [invoicesData, setInvoicesData] = useState<
    Array<{ id: string; status?: string; amount?: number; issued_at?: number }>
  >([]);
  const [inventoryData, setInventoryData] = useState<
    Array<{ id: string; item?: string; nivel?: number; pontoReposicao?: number }>
  >([]);
  const [ordersData, setOrdersData] = useState<
    Array<{ id: string; status?: string; created_at?: number; sla?: number }>
  >([]);
  const [customersData, setCustomersData] = useState<
    Array<{ id: string; name?: string; email?: string; phone?: string }>
  >([]);
  const [productsData, setProductsData] = useState<
    Array<{ id: string; name?: string; sku?: string; price?: number }>
  >([]);
  const [customerQuery, setCustomerQuery] = useState<string>('');
  const [productQuery, setProductQuery] = useState<string>('');
  const [ordersByCustomer, setOrdersByCustomer] = useState<
    Record<string, { count: number; last: number }>
  >({});
  const [newCustomer, setNewCustomer] = useState<{ name: string; email?: string; phone?: string }>({
    name: '',
    email: '',
    phone: '',
  });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<{
    name: string;
    email?: string;
    phone?: string;
  }>({ name: '', email: '', phone: '' });
  const [savingCust, setSavingCust] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    sku?: string;
    price?: number | string;
  }>({ name: '', sku: '', price: '' });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<{
    name: string;
    sku?: string;
    price?: number | string;
  }>({ name: '', sku: '', price: '' });
  const [savingProd, setSavingProd] = useState<boolean>(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  // Modal de confirmação e timers de deleção
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'customer' | 'product';
    id: string;
    name?: string;
  } | null>(null);
  const deleteTimersRef = useRef<Record<string, number>>({});
  // Activity Log simples
  const [activityLog, setActivityLog] = useState<
    Array<{ ts: number; entidade: 'Cliente' | 'Produto'; acao: string; id: string; nome?: string }>
  >([]);
  const [custPage, setCustPage] = useState<number>(0);
  const [prodPage, setProdPage] = useState<number>(0);
  const [custPageSize, setCustPageSize] = useState<number>(10);
  const [prodPageSize, setProdPageSize] = useState<number>(10);
  const [custSort, setCustSort] = useState<{
    field: 'id' | 'name' | 'email' | 'phone' | 'orders' | 'last';
    dir: 'asc' | 'desc';
  }>({ field: 'id', dir: 'asc' });
  const [prodSort, setProdSort] = useState<{
    field: 'id' | 'name' | 'sku' | 'price';
    dir: 'asc' | 'desc';
  }>({ field: 'id', dir: 'asc' });
  const custFiltered = useMemo(() => {
    const list = customersData.filter(
      (c) =>
        !customerQuery ||
        (c.name || '').toLowerCase().includes(customerQuery.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(customerQuery.toLowerCase()) ||
        (c.phone || '').toLowerCase().includes(customerQuery.toLowerCase())
    );
    const arr = [...list];
    arr.sort((a, b) => {
      const dir = custSort.dir === 'asc' ? 1 : -1;
      const num = (x: any) => (Number.isFinite(Number(x)) ? Number(x) : 0);
      const str = (x: any) => (x ?? '').toString().toLowerCase();
      switch (custSort.field) {
        case 'name':
          return dir * str(a.name).localeCompare(str(b.name));
        case 'email':
          return dir * str(a.email).localeCompare(str(b.email));
        case 'phone':
          return dir * str(a.phone).localeCompare(str(b.phone));
        case 'orders':
          return (
            dir *
            (num(ordersByCustomer[a.id]?.count ?? 0) - num(ordersByCustomer[b.id]?.count ?? 0))
          );
        case 'last':
          return (
            dir * (num(ordersByCustomer[a.id]?.last ?? 0) - num(ordersByCustomer[b.id]?.last ?? 0))
          );
        case 'id':
        default: {
          const aid = num(a.id);
          const bid = num(b.id);
          if (aid !== 0 || bid !== 0) return dir * (aid - bid);
          return dir * str(a.id).localeCompare(str(b.id));
        }
      }
    });
    return arr;
  }, [customersData, customerQuery, custSort, ordersByCustomer]);
  const prodFiltered = useMemo(() => {
    const list = productsData.filter(
      (p) =>
        !productQuery ||
        (p.name || '').toLowerCase().includes(productQuery.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(productQuery.toLowerCase())
    );
    const arr = [...list];
    arr.sort((a, b) => {
      const dir = prodSort.dir === 'asc' ? 1 : -1;
      const num = (x: any) => (Number.isFinite(Number(x)) ? Number(x) : 0);
      const str = (x: any) => (x ?? '').toString().toLowerCase();
      switch (prodSort.field) {
        case 'name':
          return dir * str(a.name).localeCompare(str(b.name));
        case 'sku':
          return dir * str(a.sku).localeCompare(str(b.sku));
        case 'price':
          return dir * (num(a.price) - num(b.price));
        case 'id':
        default: {
          const aid = num(a.id);
          const bid = num(b.id);
          if (aid !== 0 || bid !== 0) return dir * (aid - bid);
          return dir * str(a.id).localeCompare(str(b.id));
        }
      }
    });
    return arr;
  }, [productsData, productQuery, prodSort]);
  useEffect(() => {
    setCustPage(0);
  }, [customerQuery, custPageSize, customersData.length]);
  useEffect(() => {
    setProdPage(0);
  }, [productQuery, prodPageSize, productsData.length]);
  // Filtros de visualização (Logística)
  const [vehicleSelected, setVehicleSelected] = useState<string[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<
    Array<{ id: string; plate?: string; name?: string }>
  >([]);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND');
  const [statusFilter, setStatusFilter] = useState<{
    in_transit: boolean;
    stopped: boolean;
    loading_unloading: boolean;
  }>({ in_transit: true, stopped: false, loading_unloading: false });
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');
  const [optShowRoutes, setOptShowRoutes] = useState<boolean>(false);
  const [optShowStops, setOptShowStops] = useState<boolean>(false);
  const [optShowAlerts, setOptShowAlerts] = useState<boolean>(false);
  const [mapShipments, setMapShipments] = useState<
    Array<{
      id: string;
      status?: string;
      created_at?: number;
      lat?: number;
      lng?: number;
      location?: { lat?: number; lng?: number };
      geo?: { lat?: number; lng?: number };
      vehicleId?: string;
      vehicle_id?: string;
    }>
  >([]);

  function buildRiskInputForShipment(s: any): MLPredictInput {
    const status = String(s.status || 'in_transit');
    return {
      distance_km: status === 'delayed' ? 25 : status === 'in_transit' ? 15 : 5,
      stops: status === 'delayed' ? 3 : status === 'in_transit' ? 1 : 0,
      weight_kg: 50,
      lead_time_hours: status === 'delayed' ? 5 : status === 'in_transit' ? 2 : 1,
      weather_score: 0.8,
      driver_incidents_90d: status === 'delayed' ? 1 : 0,
    };
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const toast = useToast();
  const DELETE_GRACE_MS = Number(process.env.NEXT_PUBLIC_DELETE_GRACE_MS ?? '5000') || 5000;
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('crmActivityLog') : null;
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setActivityLog(arr);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('crmActivityLog', JSON.stringify(activityLog.slice(0, 500)));
      }
    } catch {}
  }, [activityLog]);

  useEffect(() => {
    let active = true;
    (async () => {
      setReady(false);
      setError(null);
      setMetrics([]);

      try {
        const data: Metric[] = [];
        try {
          const shipments: any[] = await apiFetch('/shipments');
          data.push({ label: 'Shipments', value: shipments.length, ok: true });
          const inTransit = shipments.filter((s: any) => s.status === 'in_transit').length;
          const delayed = shipments.filter((s: any) => s.status === 'delayed').length;
          const delivered = shipments.filter((s: any) => s.status === 'delivered').length;
          data.push({ label: 'Em trânsito', value: inTransit, ok: true });
          data.push({ label: 'Atrasados', value: delayed, ok: true });
          data.push({ label: 'Entregues', value: delivered, ok: true });

          const vehicles: any[] = await apiFetch('/vehicles');
          data.push({ label: 'Veículos', value: vehicles.length, ok: true });

          const tires: any[] = await apiFetch('/tires');
          data.push({ label: 'Pneus', value: tires.length, ok: true });

          let totalCost = 0, countCost = 0;
          const orderedByCost = [...shipments].sort((a: any, b: any) => (b.cost || 0) - (a.cost || 0));
          for (const s of shipments) {
            if (typeof s.cost === 'number') { totalCost += s.cost; countCost++; }
          }
          if (countCost > 0) {
            const avg = totalCost / countCost;
            data.push({ label: 'Custo total (shipments)', value: totalCost.toFixed(2), ok: true });
            data.push({ label: 'Custo médio', value: avg.toFixed(2), ok: true });
          }
          setCostTop(orderedByCost.slice(0, 5));
        } catch {}

        // Pedidos
        if (mod?.key === 'pedidos') {
          try {
            const orders: any[] = await apiFetch('/orders', {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const list = orders.slice(0, 50).map((o: any) => ({
              id: String(o.id),
              status: o.status || 'open',
              created_at: typeof o.created_at === 'number' ? o.created_at : 0,
              sla: typeof o.sla === 'number' ? o.sla : undefined,
            }));
            setOrdersData(list);
            data.push({ label: 'Pedidos (via backend)', value: orders.length, ok: true });
          } catch {}
        }

        // Financeiro
        if (mod?.key === 'financeiro') {
          const invoices: any[] = await apiFetch('/invoices');
          const receivables: any[] = await apiFetch('/receivables');
          const payables: any[] = await apiFetch('/payables');
          data.push({ label: 'Invoices', value: invoices.length, ok: true });
          data.push({ label: 'Recebíveis', value: receivables.length, ok: true });
          data.push({ label: 'Pagáveis', value: payables.length, ok: true });

          let totalOpen = 0,
            totalPaid = 0,
            totalOverdue = 0;
          for (const v of invoices) {
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

          const latestInv = invoices
            .slice()
            .sort((a, b) => ((b.issued_at || 0) as number) - ((a.issued_at || 0) as number))
            .slice(0, 5);
          setLatestInvoices(latestInv);
          setInvoicesData(invoices.slice(0, 200));

          try {
            let b0_30 = 0,
              b31_60 = 0,
              b61_90 = 0,
              b90p = 0;
            const now = Date.now();
            for (const r of receivables) {
              const amt = typeof r.amount === 'number' ? r.amount : 0;
              const due = typeof r.due_at === 'number' ? r.due_at : 0;
              const status = r.status || 'open';
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

        // Estoque
        if (mod?.key === 'estoque') {
          const inventory: any[] = await apiFetch('/inventory');
          data.push({ label: 'Itens de estoque', value: inventory.length, ok: true });
          const list = inventory.map((v: any) => ({
            id: String(v.id),
            item: v.item,
            nivel: typeof v.nivel === 'number' ? v.nivel : 0,
            pontoReposicao: typeof v.pontoReposicao === 'number' ? v.pontoReposicao : 0,
          }));
          setInventoryData(list);
        }

        // Logística
        if (mod?.key === 'logistica') {
          try {
            const shipments: any[] = await apiFetch('/shipments');
            const latest = shipments
              .slice(0, 5)
              .map((s: any) => ({ id: String(s.id), ...(s as any) }));
            setLatestShipments(latest);
            setMapShipments(
              shipments.slice(0, 50).map((s: any) => ({ id: String(s.id), ...(s as any) }))
            );
            data.push({ label: 'Shipments (backend)', value: shipments.length, ok: true });
          } catch {}
          try {
            const alertsData: any[] = await apiFetch('/alerts');
            setAlerts(alertsData.slice(0, 5));
          } catch {}
          try {
            const checklistData: any[] = await apiFetch('/checklist');
            setChecklist(checklistData.slice(0, 5));
          } catch {}
        }

        // Frota
        if (mod?.key === 'frota') {
          try {
            const vs: any[] = await apiFetch('/vehicles');
            data.push({ label: 'Veículos', value: vs.length, ok: true });
            const maints: any[] = await apiFetch('/maintenances');
            data.push({ label: 'Manutenções', value: maints.length, ok: true });
            const pneus: any[] = await apiFetch('/tires');
            data.push({ label: 'Pneus', value: pneus.length, ok: true });

            setVehiclesData(vs.map((v: any) => ({ id: String(v.id), ...(v as any) })));
            let kmSum = 0,
              kmCount = 0,
              consSum = 0,
              consCount = 0;
            for (const v of vs) {
              const km =
                typeof v.km === 'number'
                  ? v.km
                  : typeof v.odometer === 'number'
                    ? v.odometer
                    : null;
              if (typeof km === 'number') {
                kmSum += km;
                kmCount++;
              }
              const cons =
                typeof v.avg_consumption === 'number'
                  ? v.avg_consumption
                  : typeof v.consumption === 'number'
                    ? v.consumption
                    : null;
              if (typeof cons === 'number') {
                consSum += cons;
                consCount++;
              }
            }
            const avgKm = kmCount ? kmSum / kmCount : 0;
            const avgConsumption = consCount ? consSum / consCount : 0;
            const preventiveUpcoming = maints.filter((m: any) => {
              const status = m.status || 'scheduled';
              return status === 'scheduled';
            }).length;
            setFleetHealth({ avgKm, avgConsumption, preventiveUpcoming });
            const low = pneus
              .filter((p: any) => typeof p.life === 'number' && p.life <= 20)
              .sort((a: any, b: any) => (a.life || 0) - (b.life || 0))
              .slice(0, 5);
            setLowLifeTires(low);
          } catch {}
        }

        // Pneus
        if (mod?.key === 'pneus') {
          try {
            const pneus: any[] = await apiFetch('/tires');
            data.push({ label: 'Pneus', value: pneus.length, ok: true });
            const low = pneus
              .filter((p: any) => typeof p.life === 'number' && p.life <= 20)
              .sort((a: any, b: any) => (a.life || 0) - (b.life || 0))
              .slice(0, 20);
            setLowLifeTires(low);
          } catch {}
        }

        // Logística
        if (mod?.key === 'logistica') {
          try {
            const shipments: any[] = await apiFetch('/shipments');
            setShipmentsData(shipments);
            data.push({ label: 'Entregas (backend)', value: shipments.length, ok: true });
          } catch {}
        }

        // CRM
        if (mod?.key === 'crm') {
          try {
            const customers: any[] = await apiFetch('/customers', {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const products: any[] = await apiFetch('/products', {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setCustomersData(
              customers.map((c: any) => ({
                id: String(c.id || c._id || ''),
                name: c.name || c.nome || '-',
                email: c.email || '-',
                phone: c.phone || c.telefone || '-',
              }))
            );
            setProductsData(
              products.map((p: any) => ({
                id: String(p.id || p._id || ''),
                name: p.name || p.nome || '-',
                sku: p.sku || '-',
                price:
                  typeof p.price === 'number' ? p.price : typeof p.valor === 'number' ? p.valor : 0,
              }))
            );
            // Pedidos por cliente para correlação
            try {
              const orders: any[] = await apiFetch('/orders', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
              const byCustomer = new Map<string, { count: number; last: number }>();
              for (const o of orders) {
                const cid = String((o.customer_id ?? o.customerId ?? '') || '');
                if (!cid) continue;
                const created = o.created_at ? Date.parse(o.created_at) : 0;
                const prev = byCustomer.get(cid) || { count: 0, last: 0 };
                byCustomer.set(cid, { count: prev.count + 1, last: Math.max(prev.last, created) });
              }
              setOrdersByCustomer(Object.fromEntries(byCustomer));
              data.push({ label: 'Pedidos (backend)', value: orders.length, ok: true });
            } catch {}
            data.push({ label: 'Clientes (backend)', value: customers.length, ok: true });
            data.push({ label: 'Produtos (backend)', value: products.length, ok: true });
          } catch {}
        }

        setMetrics(data);
        setReady(true);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados do backend.');
        setReady(true);
      }
    })();
  }, [params.module]);

  useEffect(() => {
    if (mod?.key !== 'logistica') return;
    if (!latestShipments || latestShipments.length === 0) return;
    let cancelled = false;
    (async () => {
      const map: Record<string, { risk_probability: number; risk_label: 0 | 1 }> = {};
      for (const s of latestShipments) {
        try {
          const out = await mlPredictRisk(buildRiskInputForShipment(s));
          if (out) {
            map[s.id] = { risk_probability: out.risk_probability, risk_label: out.risk_label };
          }
        } catch {}
      }
      if (!cancelled) setRiskByShipment(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [mod?.key, latestShipments]);

  useEffect(() => {
    setCustPage(0);
  }, [customerQuery, customersData.length]);
  useEffect(() => {
    setProdPage(0);
  }, [productQuery, productsData.length]);

  // Handlers CRUD do CRM
  const addCustomer = async () => {
    if (!newCustomer.name?.trim()) return;
    setSavingCust(true);
    try {
      const created = await apiFetch('/customers', {
        method: 'POST',
        headers: token
          ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
        }),
      });
      setCustomersData((prev) => [
        { id: String(created.id), name: created.name, email: created.email, phone: created.phone },
        ...prev,
      ]);
      setNewCustomer({ name: '', email: '', phone: '' });
      setActivityLog((log) => [
        {
          ts: Date.now(),
          entidade: 'Cliente',
          acao: 'create',
          id: String(created.id),
          nome: created.name,
        },
        ...log,
      ]);
      toast.show('Cliente criado com sucesso!', 'success');
    } catch (e: any) {
      const msg = e?.message || 'Erro ao criar cliente';
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setSavingCust(false);
    }
  };

  const saveCustomer = async (id: string) => {
    if (!id) return;
    setSavingCust(true);
    try {
      await apiFetch(`/customers/${id}`, {
        method: 'PUT',
        headers: token
          ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
        }),
      });
      setCustomersData((prev) => prev.map((c) => (c.id === id ? { ...c, ...editingCustomer } : c)));
      setEditingCustomerId(null);
      setEditingCustomer({ name: '', email: '', phone: '' });
      setActivityLog((log) => [
        { ts: Date.now(), entidade: 'Cliente', acao: 'update', id, nome: editingCustomer.name },
        ...log,
      ]);
      toast.show('Cliente atualizado com sucesso!', 'success');
    } catch (e: any) {
      const msg = e?.message || 'Erro ao atualizar cliente';
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setSavingCust(false);
    }
  };

  const removeCustomer = (id: string) => {
    if (!id) return;
    const c = customersData.find((x) => x.id === id);
    const displayName = c?.name ? ` "${c.name}"` : '';
    setDeletingCustomerId(id);
    setActivityLog((log) => [
      { ts: Date.now(), entidade: 'Cliente', acao: 'delete_scheduled', id, nome: c?.name },
      ...log,
    ]);

    const commit = async () => {
      try {
        await apiFetch(`/customers/${id}`, {
          method: 'DELETE',
          headers: token
            ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            : { 'Content-Type': 'application/json' },
        });
        setCustomersData((prev) => prev.filter((c) => c.id !== id));
        toast.show(`Cliente${displayName} excluído com sucesso!`, 'success');
        setActivityLog((log) => [
          { ts: Date.now(), entidade: 'Cliente', acao: 'delete_committed', id, nome: c?.name },
          ...log,
        ]);
      } catch (e: any) {
        const msg = e?.message || 'Erro ao excluir cliente';
        setError(msg);
        toast.show(msg, 'error');
        setActivityLog((log) => [
          { ts: Date.now(), entidade: 'Cliente', acao: 'delete_failed', id, nome: c?.name },
          ...log,
        ]);
      } finally {
        setDeletingCustomerId(null);
        const t = deleteTimersRef.current[id];
        if (t) delete deleteTimersRef.current[id];
      }
    };

    const tId = window.setTimeout(commit, DELETE_GRACE_MS);
    deleteTimersRef.current[id] = tId;

    toast.showWithAction({
      message: `Cliente${displayName} será excluído em ${Math.round(DELETE_GRACE_MS / 1000)}s`,
      severity: 'warning',
      actionLabel: 'Desfazer',
      duration: DELETE_GRACE_MS,
      onAction: () => {
        const t = deleteTimersRef.current[id];
        if (t) {
          clearTimeout(t);
          delete deleteTimersRef.current[id];
          setDeletingCustomerId(null);
          toast.show(`Exclusão de Cliente${displayName} desfeita.`, 'info');
          setActivityLog((log) => [
            { ts: Date.now(), entidade: 'Cliente', acao: 'undo_delete', id, nome: c?.name },
            ...log,
          ]);
        }
      },
    });
  };

  const addProduct = async () => {
    if (!newProduct.name?.trim()) return;
    setSavingProd(true);
    try {
      const priceNum =
        typeof newProduct.price === 'string'
          ? parseFloat(newProduct.price)
          : (newProduct.price as number);
      const created = await apiFetch('/products', {
        method: 'POST',
        headers: token
          ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          sku: newProduct.sku,
          price: isNaN(priceNum) ? 0 : priceNum,
        }),
      });
      setProductsData((prev) => [
        { id: String(created.id), name: created.name, sku: created.sku, price: created.price },
        ...prev,
      ]);
      setNewProduct({ name: '', sku: '', price: '' });
      setActivityLog((log) => [
        {
          ts: Date.now(),
          entidade: 'Produto',
          acao: 'create',
          id: String(created.id),
          nome: created.name,
        },
        ...log,
      ]);
      toast.show('Produto criado com sucesso!', 'success');
    } catch (e: any) {
      const msg = e?.message || 'Erro ao criar produto';
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setSavingProd(false);
    }
  };

  const saveProduct = async (id: string) => {
    if (!id) return;
    setSavingProd(true);
    try {
      const priceNum =
        typeof editingProduct.price === 'string'
          ? parseFloat(editingProduct.price)
          : (editingProduct.price as number);
      await apiFetch(`/products/${id}`, {
        method: 'PUT',
        headers: token
          ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          sku: editingProduct.sku,
          price: isNaN(priceNum) ? 0 : priceNum,
        }),
      });
      setProductsData((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...editingProduct, price: isNaN(priceNum) ? 0 : priceNum } : p
        )
      );
      setEditingProductId(null);
      setEditingProduct({ name: '', sku: '', price: '' });
      setActivityLog((log) => [
        { ts: Date.now(), entidade: 'Produto', acao: 'update', id, nome: editingProduct.name },
        ...log,
      ]);
      toast.show('Produto atualizado com sucesso!', 'success');
    } catch (e: any) {
      const msg = e?.message || 'Erro ao atualizar produto';
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setSavingProd(false);
    }
  };

  const removeProduct = (id: string) => {
    if (!id) return;
    const p = productsData.find((x) => x.id === id);
    const displayName = p?.name ? ` "${p.name}"` : '';
    setDeletingProductId(id);
    setActivityLog((log) => [
      { ts: Date.now(), entidade: 'Produto', acao: 'delete_scheduled', id, nome: p?.name },
      ...log,
    ]);

    const commit = async () => {
      try {
        await apiFetch(`/products/${id}`, {
          method: 'DELETE',
          headers: token
            ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            : { 'Content-Type': 'application/json' },
        });
        setProductsData((prev) => prev.filter((p) => p.id !== id));
        toast.show(`Produto${displayName} excluído com sucesso!`, 'success');
        setActivityLog((log) => [
          { ts: Date.now(), entidade: 'Produto', acao: 'delete_committed', id, nome: p?.name },
          ...log,
        ]);
      } catch (e: any) {
        const msg = e?.message || 'Erro ao excluir produto';
        setError(msg);
        toast.show(msg, 'error');
        setActivityLog((log) => [
          { ts: Date.now(), entidade: 'Produto', acao: 'delete_failed', id, nome: p?.name },
          ...log,
        ]);
      } finally {
        setDeletingProductId(null);
        const t = deleteTimersRef.current[id];
        if (t) delete deleteTimersRef.current[id];
      }
    };

    const tId = window.setTimeout(commit, DELETE_GRACE_MS);
    deleteTimersRef.current[id] = tId;

    toast.showWithAction({
      message: `Produto${displayName} será excluído em ${Math.round(DELETE_GRACE_MS / 1000)}s`,
      severity: 'warning',
      actionLabel: 'Desfazer',
      duration: DELETE_GRACE_MS,
      onAction: () => {
        const t = deleteTimersRef.current[id];
        if (t) {
          clearTimeout(t);
          delete deleteTimersRef.current[id];
          setDeletingProductId(null);
          toast.show(`Exclusão de Produto${displayName} desfeita.`, 'info');
          setActivityLog((log) => [
            { ts: Date.now(), entidade: 'Produto', acao: 'undo_delete', id, nome: p?.name },
            ...log,
          ]);
        }
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'customer') removeCustomer(confirmDelete.id);
    else removeProduct(confirmDelete.id);
    setConfirmDelete(null);
  };
  const handleCancelDelete = () => setConfirmDelete(null);

  if (!mod) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
        <h1>Dashboard</h1>
        <p>Módulo não encontrado.</p>
        <Link
          href="/dashboard"
          style={{ border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}
        >
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ marginTop: 0 }}>{t(`modules.${moduleKey}.title`)}</h1>
      <p style={{ color: '#888' }}>{t(`modules.${moduleKey}.desc`)}</p>
      {error && (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <p style={{ color: '#d32f2f' }}>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        <div>
          <h3>{t('common.kpis')}</h3>
          {ready && metrics.length === 0 ? (
            <p style={{ color: '#aaa' }}>{t('common.no_data')}</p>
          ) : (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {metrics.map((m, i) => (
                <div
                  key={i}
                  style={{ border: '1px solid #333', borderRadius: 8, padding: 16, minWidth: 180 }}
                >
                  <p style={{ margin: 0, color: '#aaa' }}>{m.label}</p>
                  <p style={{ margin: 0, fontSize: 20 }}>{String(m.value)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {mod.key === 'logistica' && (
          <div>
            <h3>{t('logistics.latest_shipments')}</h3>
            {latestShipments.length === 0 ? (
              <p style={{ color: '#aaa' }}>{t('logistics.none_shipments')}</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {latestShipments.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      border: '1px solid #333',
                      borderRadius: 8,
                      padding: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <strong>{s.id}</strong>
                      <div style={{ color: '#888' }}>{t('common.status')}: {s.status || 'N/A'}</div>
                      <div style={{ marginTop: 4, color: riskByShipment[s.id] ? (riskByShipment[s.id].risk_probability >= 0.66 ? '#e53935' : riskByShipment[s.id].risk_probability >= 0.33 ? '#ffb300' : '#43a047') : '#888' }}>
                        Risco: {riskByShipment[s.id] ? `${Math.round(riskByShipment[s.id].risk_probability * 100)}%` : 'Indisponível'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: '#888' }}>
                        Criado: {s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mod.key === 'pedidos' && (
          <div style={{ width: '100%' }}>
            <h3>{t('orders.section')}</h3>
            {ordersData.length === 0 ? (
              <p style={{ color: '#aaa' }}>{t('orders.none')}</p>
            ) : (
              <GridLite
                rows={ordersData.map((r) => ({
                  id: r.id,
                  status: r.status || 'open',
                  created_at: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
                  sla: typeof r.sla === 'number' ? r.sla : '',
                }))}
                columns={[
                  { field: 'id', headerName: t('common.id'), flex: 1 },
                  { field: 'status', headerName: t('common.status'), flex: 1 },
                  { field: 'created_at', headerName: t('orders.date'), flex: 1 },
                  { field: 'sla', headerName: t('orders.sla'), flex: 1 },
                ]}
                pageSizeOptions={[10, 20, 50]}
              />
            )}
          </div>
        )}

        {mod.key === 'financeiro' && (
          <div>
            <h3>{t('finance.charts')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <SimpleBarChart
                  labels={[t('finance.paid'), t('finance.open'), t('finance.overdue')]}
                  values={[financeSummary.paid, financeSummary.open, financeSummary.overdue]}
                  colors={['#43a047', '#1976d2', '#e53935']}
                />
              </div>
              <div>
                <SimpleDonutChart
                  labels={['0-30', '31-60', '61-90', '90+']}
                  values={[
                    agingBuckets.b0_30,
                    agingBuckets.b31_60,
                    agingBuckets.b61_90,
                    agingBuckets.b90p,
                  ]}
                  colors={['#43a047', '#ffb300', '#1976d2', '#e53935']}
                />
              </div>
            </div>
            {invoicesData.length > 0 && (
              <div style={{ width: '100%', marginTop: 16 }}>
                <GridLite
                  rows={invoicesData.map((r) => ({
                    id: r.id,
                    status: r.status || 'open',
                    amount: typeof r.amount === 'number' ? r.amount : 0,
                    issued_at: r.issued_at ? new Date(r.issued_at).toLocaleDateString() : '',
                  }))}
                  columns={[
                    { field: 'id', headerName: t('common.id'), flex: 1 },
                    { field: 'status', headerName: t('common.status'), flex: 1 },
                    { field: 'amount', headerName: t('common.amount'), flex: 1 },
                    { field: 'issued_at', headerName: t('common.created_at'), flex: 1 },
                  ]}
                  pageSizeOptions={[10, 20, 50]}
                />
              </div>
            )}
          </div>
        )}

        {mod.key === 'estoque' && (
          <div style={{ width: '100%' }}>
            <h3>{t('inventory.table')}</h3>
            {inventoryData.length === 0 ? (
              <p style={{ color: '#aaa' }}>{t('inventory.none')}</p>
            ) : (
              <GridLite
                rows={inventoryData.map((r) => ({
                  id: r.id,
                  item: r.item,
                  nivel: typeof r.nivel === 'number' ? r.nivel : 0,
                  pontoReposicao: typeof r.pontoReposicao === 'number' ? r.pontoReposicao : 0,
                  alerta:
                    (typeof r.nivel === 'number' ? r.nivel : 0) <=
                    (typeof r.pontoReposicao === 'number' ? r.pontoReposicao : 0),
                }))}
                columns={[
                  { field: 'item', headerName: t('inventory.item'), flex: 1 },
                  { field: 'nivel', headerName: t('inventory.level'), flex: 1 },
                  { field: 'pontoReposicao', headerName: t('inventory.reorder_point'), flex: 1 },
                  { field: 'alerta', headerName: t('inventory.alert'), flex: 1 },
                ]}
                pageSizeOptions={[10, 20, 50]}
              />
            )}
          </div>
        )}

        {mod.key === 'crm' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {confirmDelete && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0 as any,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: 8,
                    padding: 16,
                    width: 360,
                  }}
                >
                  <h4 style={{ marginTop: 0 }}>{t('common.confirm_delete')}</h4>
                  <p style={{ color: '#ddd' }}>
                    {t('common.delete')} {confirmDelete.type === 'customer' ? t('crm.customers') : t('crm.products')}{' '}
                    {confirmDelete.name ? `"${confirmDelete.name}"` : ''}?
                  </p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleCancelDelete}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#555',
                        color: '#fff',
                      }}
                    >
                      {t('common.cancel')}
                    </button
                    >
                    <button
                      onClick={handleConfirmDelete}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#e53935',
                        color: '#fff',
                      }}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h3>Clientes</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  type="text"
                  placeholder="Nome"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#111',
                    color: '#fff',
                  }}
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#111',
                    color: '#fff',
                  }}
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#111',
                    color: '#fff',
                  }}
                />
                <button
                  onClick={addCustomer}
                  disabled={savingCust || !newCustomer.name.trim()}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#1976d2',
                    color: '#fff',
                  }}
                >
                  Adicionar
                </button>
              </div>
              {customersData.length === 0 ? (
                <p style={{ color: '#aaa' }}>Nenhum cliente.</p>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Buscar clientes (nome, email, telefone)"
                    value={customerQuery}
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    style={{
                      width: '100%',
                      marginBottom: 8,
                      padding: 8,
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#111',
                      color: '#fff',
                    }}
                  />
                  <div style={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <button
                              onClick={() =>
                                setCustSort((s) => ({
                                  field: 'id',
                                  dir: s.field === 'id' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              ID
                              {custSort.field === 'id'
                                ? custSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setCustSort((s) => ({
                                  field: 'name',
                                  dir: s.field === 'name' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Nome
                              {custSort.field === 'name'
                                ? custSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setCustSort((s) => ({
                                  field: 'email',
                                  dir: s.field === 'email' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Email
                              {custSort.field === 'email'
                                ? custSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setCustSort((s) => ({
                                  field: 'phone',
                                  dir: s.field === 'phone' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Telefone
                              {custSort.field === 'phone'
                                ? custSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setCustSort((s) => ({
                                  field: 'orders',
                                  dir: s.field === 'orders' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Pedidos
                              {custSort.field === 'orders'
                                ? custSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setCustSort((s) => ({
                                  field: 'last',
                                  dir: s.field === 'last' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Último Pedido
                              {custSort.field === 'last'
                                ? custSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {custFiltered
                          .slice(custPage * custPageSize, (custPage + 1) * custPageSize)
                          .map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>{c.id}</TableCell>
                              <TableCell>
                                {editingCustomerId === c.id ? (
                                  <input
                                    type="text"
                                    value={editingCustomer.name}
                                    onChange={(e) =>
                                      setEditingCustomer({
                                        ...editingCustomer,
                                        name: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 6,
                                      borderRadius: 6,
                                      border: '1px solid #444',
                                      background: '#111',
                                      color: '#fff',
                                    }}
                                  />
                                ) : (
                                  c.name || '-'
                                )}
                              </TableCell>
                              <TableCell>
                                {editingCustomerId === c.id ? (
                                  <input
                                    type="text"
                                    value={editingCustomer.email}
                                    onChange={(e) =>
                                      setEditingCustomer({
                                        ...editingCustomer,
                                        email: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 6,
                                      borderRadius: 6,
                                      border: '1px solid #444',
                                      background: '#111',
                                      color: '#fff',
                                    }}
                                  />
                                ) : (
                                  c.email || '-'
                                )}
                              </TableCell>
                              <TableCell>
                                {editingCustomerId === c.id ? (
                                  <input
                                    type="text"
                                    value={editingCustomer.phone}
                                    onChange={(e) =>
                                      setEditingCustomer({
                                        ...editingCustomer,
                                        phone: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 6,
                                      borderRadius: 6,
                                      border: '1px solid #444',
                                      background: '#111',
                                      color: '#fff',
                                    }}
                                  />
                                ) : (
                                  c.phone || '-'
                                )}
                              </TableCell>
                              <TableCell>{ordersByCustomer[c.id]?.count ?? 0}</TableCell>
                              <TableCell>
                                {ordersByCustomer[c.id]?.last
                                  ? new Date(ordersByCustomer[c.id].last).toLocaleDateString()
                                  : ''}
                              </TableCell>
                              <TableCell>
                                {editingCustomerId === c.id ? (
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                      onClick={() => saveCustomer(c.id)}
                                      disabled={savingCust}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#43a047',
                                        color: '#fff',
                                      }}
                                    >
                                      {savingCust ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingCustomerId(null);
                                        setEditingCustomer({ name: '', email: '', phone: '' });
                                      }}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#555',
                                        color: '#fff',
                                      }}
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                      onClick={() => {
                                        setEditingCustomerId(c.id);
                                        setEditingCustomer({
                                          name: c.name || '',
                                          email: c.email || '',
                                          phone: c.phone || '',
                                        });
                                      }}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#1976d2',
                                        color: '#fff',
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() =>
                                        setConfirmDelete({
                                          type: 'customer',
                                          id: c.id,
                                          name: c.name,
                                        })
                                      }
                                      disabled={deletingCustomerId === c.id}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#e53935',
                                        color: '#fff',
                                      }}
                                    >
                                      {deletingCustomerId === c.id ? 'Excluindo...' : 'Excluir'}
                                    </button>
                                    <a
                                      href={`/dashboard/pedidos?customerId=${c.id}`}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#333',
                                        color: '#fff',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      Ver pedidos
                                    </a>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <small style={{ color: '#aaa' }}>
                        Página {custPage + 1} de{' '}
                        {Math.max(1, Math.ceil(custFiltered.length / custPageSize))}
                      </small>
                      <label style={{ color: '#aaa' }}>
                        Tamanho:
                        <select
                          value={custPageSize}
                          onChange={(e) => setCustPageSize(Number(e.target.value))}
                          style={{
                            marginLeft: 6,
                            padding: '4px 6px',
                            borderRadius: 6,
                            border: '1px solid #444',
                            background: '#111',
                            color: '#fff',
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setCustPage((p) => Math.max(0, p - 1))}
                        disabled={custPage === 0}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid #444',
                          background: '#111',
                          color: '#fff',
                        }}
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          setCustPage((p) =>
                            p + 1 < Math.ceil(custFiltered.length / custPageSize) ? p + 1 : p
                          )
                        }
                        disabled={custPage + 1 >= Math.ceil(custFiltered.length / custPageSize)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid #444',
                          background: '#111',
                          color: '#fff',
                        }}
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <h3>Atividades</h3>
              {activityLog.length === 0 ? (
                <p style={{ color: '#aaa' }}>Sem atividades recentes.</p>
              ) : (
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    border: '1px solid #333',
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  {activityLog.slice(0, 50).map((ev, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}
                    >
                      <span style={{ color: '#aaa' }}>{new Date(ev.ts).toLocaleString()}</span>
                      <span>
                        {ev.acao === 'create'
                          ? '➕'
                          : ev.acao === 'update'
                            ? '✏️'
                            : ev.acao === 'delete_scheduled'
                              ? '⏳'
                              : ev.acao === 'delete_committed'
                                ? '🗑️'
                                : ev.acao === 'delete_failed'
                                  ? '⚠️'
                                  : ev.acao === 'undo_delete'
                                    ? '↩️'
                                    : '•'}{' '}
                        {ev.entidade} • {ev.acao} • ID {ev.id}
                        {ev.nome ? ` • ${ev.nome}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3>Produtos</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  type="text"
                  placeholder="Nome"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#111',
                    color: '#fff',
                  }}
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#111',
                    color: '#fff',
                  }}
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={newProduct.price as any}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#111',
                    color: '#fff',
                  }}
                />
                <button
                  onClick={addProduct}
                  disabled={savingProd || !newProduct.name.trim()}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: '#1976d2',
                    color: '#fff',
                  }}
                >
                  Adicionar
                </button>
              </div>
              {productsData.length === 0 ? (
                <p style={{ color: '#aaa' }}>Nenhum produto.</p>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Buscar produtos (nome, SKU)"
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    style={{
                      width: '100%',
                      marginBottom: 8,
                      padding: 8,
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#111',
                      color: '#fff',
                    }}
                  />
                  <div style={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <button
                              onClick={() =>
                                setProdSort((s) => ({
                                  field: 'id',
                                  dir: s.field === 'id' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              ID
                              {prodSort.field === 'id'
                                ? prodSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setProdSort((s) => ({
                                  field: 'name',
                                  dir: s.field === 'name' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Nome
                              {prodSort.field === 'name'
                                ? prodSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setProdSort((s) => ({
                                  field: 'sku',
                                  dir: s.field === 'sku' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              SKU
                              {prodSort.field === 'sku'
                                ? prodSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                setProdSort((s) => ({
                                  field: 'price',
                                  dir: s.field === 'price' && s.dir === 'asc' ? 'desc' : 'asc',
                                }))
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              Preço
                              {prodSort.field === 'price'
                                ? prodSort.dir === 'asc'
                                  ? ' ↑'
                                  : ' ↓'
                                : ''}
                            </button>
                          </TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prodFiltered
                          .slice(prodPage * prodPageSize, (prodPage + 1) * prodPageSize)
                          .map((p) => (
                            <TableRow key={p.id}>
                              <TableCell>{p.id}</TableCell>
                              <TableCell>
                                {editingProductId === p.id ? (
                                  <input
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={(e) =>
                                      setEditingProduct({ ...editingProduct, name: e.target.value })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 6,
                                      borderRadius: 6,
                                      border: '1px solid #444',
                                      background: '#111',
                                      color: '#fff',
                                    }}
                                  />
                                ) : (
                                  p.name || '-'
                                )}
                              </TableCell>
                              <TableCell>
                                {editingProductId === p.id ? (
                                  <input
                                    type="text"
                                    value={editingProduct.sku}
                                    onChange={(e) =>
                                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 6,
                                      borderRadius: 6,
                                      border: '1px solid #444',
                                      background: '#111',
                                      color: '#fff',
                                    }}
                                  />
                                ) : (
                                  p.sku || '-'
                                )}
                              </TableCell>
                              <TableCell>
                                {editingProductId === p.id ? (
                                  <input
                                    type="number"
                                    value={editingProduct.price as any}
                                    onChange={(e) =>
                                      setEditingProduct({
                                        ...editingProduct,
                                        price: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: '100%',
                                      padding: 6,
                                      borderRadius: 6,
                                      border: '1px solid #444',
                                      background: '#111',
                                      color: '#fff',
                                    }}
                                  />
                                ) : typeof p.price === 'number' ? (
                                  p.price.toFixed(2)
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell>
                                {editingProductId === p.id ? (
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                      onClick={() => saveProduct(p.id)}
                                      disabled={savingProd}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#43a047',
                                        color: '#fff',
                                      }}
                                    >
                                      {savingProd ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingProductId(null);
                                        setEditingProduct({ name: '', sku: '', price: '' });
                                      }}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#555',
                                        color: '#fff',
                                      }}
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                      onClick={() => {
                                        setEditingProductId(p.id);
                                        setEditingProduct({
                                          name: p.name || '',
                                          sku: p.sku || '',
                                          price: typeof p.price === 'number' ? p.price : '',
                                        });
                                      }}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#1976d2',
                                        color: '#fff',
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() =>
                                        setConfirmDelete({
                                          type: 'product',
                                          id: p.id,
                                          name: p.name,
                                        })
                                      }
                                      disabled={deletingProductId === p.id}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        border: '1px solid #444',
                                        background: '#e53935',
                                        color: '#fff',
                                      }}
                                    >
                                      {deletingProductId === p.id ? 'Excluindo...' : 'Excluir'}
                                    </button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <small style={{ color: '#aaa' }}>
                        Página {prodPage + 1} de{' '}
                        {Math.max(1, Math.ceil(prodFiltered.length / prodPageSize))}
                      </small>
                      <label style={{ color: '#aaa' }}>
                        Tamanho:
                        <select
                          value={prodPageSize}
                          onChange={(e) => setProdPageSize(Number(e.target.value))}
                          style={{
                            marginLeft: 6,
                            padding: '4px 6px',
                            borderRadius: 6,
                            border: '1px solid #444',
                            background: '#111',
                            color: '#fff',
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setProdPage((p) => Math.max(0, p - 1))}
                        disabled={prodPage === 0}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid #444',
                          background: '#111',
                          color: '#fff',
                        }}
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          setProdPage((p) =>
                            p + 1 < Math.ceil(prodFiltered.length / prodPageSize) ? p + 1 : p
                          )
                        }
                        disabled={prodPage + 1 >= Math.ceil(prodFiltered.length / prodPageSize)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid #444',
                          background: '#111',
                          color: '#fff',
                        }}
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {mod.key === 'pneus' && (
          <div>
            <h3>{t('tires.low_life')}</h3>
            {lowLifeTires.length === 0 ? (
              <p style={{ color: '#aaa' }}>{t('tires.none')}</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.id')}</TableCell>
                      <TableCell>{t('tires.position')}</TableCell>
                      <TableCell>{t('tires.vehicle')}</TableCell>
                      <TableCell>{t('tires.life')}</TableCell>
                      <TableCell>{t('tires.pressure')}</TableCell>
                      <TableCell>{t('tires.temperature')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowLifeTires.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.position || '-'}</TableCell>
                        <TableCell>{p.vehicleId || '-'}</TableCell>
                        <TableCell>{typeof p.life === 'number' ? `${p.life}%` : 'N/A'}</TableCell>
                        <TableCell>{(p as any).pressure ?? 'N/A'}</TableCell>
                        <TableCell>{(p as any).temperature ?? 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div style={{ marginTop: 12, color: '#888' }}>
              <strong>{t('tires.maintenance')}:</strong> {t('tires.corrective')} · {t('tires.preventive')} · {t('tires.predictive')} — {t('tires.iot')}
            </div>
          </div>
        )}

        {mod.key === 'frota' && (
          <div>
            <h3>{t('fleet.vehicles')}</h3>
            {vehiclesData.length === 0 ? (
              <p style={{ color: '#aaa' }}>{t('fleet.none_vehicles')}</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.id')}</TableCell>
                      <TableCell>{t('fleet.plate')}</TableCell>
                      <TableCell>{t('fleet.model')}</TableCell>
                      <TableCell>{t('fleet.km')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehiclesData.slice(0, 20).map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.id}</TableCell>
                        <TableCell>{(v as any).placa || v.plate || '-'}</TableCell>
                        <TableCell>{(v as any).modelo || (v as any).name || '-'}</TableCell>
                        <TableCell>
                          {typeof v.km === 'number'
                            ? v.km
                            : typeof v.odometer === 'number'
                              ? v.odometer
                              : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {mod.key === 'logistica' && (
          <div>
            <h3>Rotas e Rastreamento</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" checked={showRoutes} onChange={(e) => setShowRoutes(e.target.checked)} /> Rotas
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" checked={showStops} onChange={(e) => setShowStops(e.target.checked)} /> Paradas
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" checked={showAlerts} onChange={(e) => setShowAlerts(e.target.checked)} /> Alertas
              </label>
            </div>
            <div style={{ height: 420, border: '1px solid #333', borderRadius: 8, overflow: 'hidden' }}>
              <LiveMap shipments={shipmentsData} showRoutes={showRoutes} showStops={showStops} showAlerts={showAlerts} />
            </div>
            <div style={{ marginTop: 12, color: '#888' }}>
              <strong>Dica:</strong> integre Openrouteservice ou Vroom para rotas otimizadas.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
