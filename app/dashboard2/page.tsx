'use client';
import AppShell from '@/components/ui/AppShell';
import Card from '@/components/ui/card';
import Link from 'next/link';

const modules = [
  { key: 'visao-geral', title: 'Visão Geral', desc: 'KPIs e status operacional em tempo real.' },
  { key: 'pedidos', title: 'Pedidos', desc: 'Gestão de pedidos, tracking e SLA.' },
  { key: 'crm', title: 'CRM', desc: 'Clientes e Produtos.' },
  { key: 'logistica', title: 'Logística', desc: 'Rotas, last-mile e custos.' },
  { key: 'estoque', title: 'Estoque', desc: 'Níveis, reposição e rupturas.' },
  { key: 'frota', title: 'Gestão de Frota', desc: 'Veículos, manutenções e pneus.' },
  { key: 'financeiro', title: 'Financeiro', desc: 'Faturamento, custos e conciliações.' },
  { key: 'analise', title: 'Análise', desc: 'Relatórios e insights preditivos.' },
];

export default function DashboardLightPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard EJG</h1>
      </div>
      <Card description="Explore os módulos locais abaixo. Faça login para dados reais.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {modules.map((m) => (
            <Link
              key={m.key}
              href={`/dashboard/${m.key}`}
              className="rounded-lg border border-border bg-[#0c1422] p-4 text-white no-underline hover:bg-[#0f1a2e]"
            >
              <h2 className="text-xl font-semibold">{m.title}</h2>
              <p className="text-slate-400">{m.desc}</p>
            </Link>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
