import type { Metadata } from 'next';

const modules = [
  { key: 'visao-geral', title: 'Visão Geral', desc: 'KPIs e status operacional em tempo real.' },
  { key: 'pedidos', title: 'Pedidos', desc: 'Gestão de pedidos, tracking e SLA.' },
  { key: 'logistica', title: 'Logística', desc: 'Rotas, last-mile e custos.' },
  { key: 'estoque', title: 'Estoque', desc: 'Níveis, reposição e rupturas.' },
  { key: 'financeiro', title: 'Financeiro', desc: 'Faturamento, custos e conciliações.' },
  { key: 'analise', title: 'Análise', desc: 'Relatórios e insights preditivos.' },
];

export async function generateStaticParams() {
  return modules.map((m) => ({ module: m.key }));
}

export async function generateMetadata({ params }: { params: { module: string } }): Promise<Metadata> {
  const mod = modules.find((m) => m.key === params.module);
  const title = mod ? `Dashboard · ${mod.title}` : 'Dashboard';
  return { title };
}

export default function ModulePage({ params }: { params: { module: string } }) {
  const mod = modules.find((m) => m.key === params.module);
  if (!mod) {
    return (
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
        <h1>Dashboard</h1>
        <p>Módulo não encontrado.</p>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ marginTop: 0 }}>{mod.title}</h1>
      <p style={{ color: '#888' }}>{mod.desc}</p>
      <div style={{ marginTop: '1rem' }}>
        <p>Conteúdos do módulo em desenvolvimento. Para EJG, podemos conectar dados de exemplo e fluxos principais.</p>
        <ul>
          <li>Descrição de telas e ações típicas</li>
          <li>Integração com APIs (Firestore/Supabase/ERP)</li>
          <li>KPIs e relatórios</li>
        </ul>
      </div>
    </div>
  );
}