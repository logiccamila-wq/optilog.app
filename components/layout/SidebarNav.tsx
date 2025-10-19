'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';

const items = [
  { href: '/dashboard/visao-geral', label: 'Visão Geral' },
  { href: '/dashboard/pedidos', label: 'Pedidos' },
  { href: '/dashboard/crm', label: 'CRM' },
  { href: '/dashboard/logistica', label: 'Logística' },
  { href: '/dashboard/estoque', label: 'Estoque' },
  { href: '/dashboard/frota', label: 'Gestão de Frota' },
  { href: '/dashboard/pneus', label: 'Gestão de Pneus' },
  { href: '/dashboard/financeiro', label: 'Financeiro' },
  { href: '/dashboard/analise', label: 'Análise' },
];

export default function SidebarNav() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
  return (
    <aside className="sticky top-4 h-fit w-64 rounded-lg border border-border bg-[#0c1422] p-4 text-white">
      <h3 className="mb-3 text-lg font-semibold">Módulos</h3>
      <nav className="grid gap-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-md border border-border bg-[#101827] px-3 py-2 text-slate-200 hover:bg-[#0f1a2e]"
          >
            {i.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4">
        <Button onClick={handleLogout} variant="outline" size="sm">
          Sair
        </Button>
      </div>
    </aside>
  );
}
