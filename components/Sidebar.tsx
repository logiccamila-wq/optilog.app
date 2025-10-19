'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const items = [
  { href: '/jwt', label: 'Home (JWT)' },
  { href: '/jwt/dashboard', label: 'Dashboard (JWT)' },
  { href: '/jwt/login', label: 'Login (JWT)' },
];

export default function Sidebar() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/jwt/login');
  };
  return (
    <aside
      style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', background: '#fff' }}
    >
      <h3 style={{ marginTop: 0 }}>Navegação</h3>
      <nav style={{ display: 'grid', gap: 8 }}>
        {items.map((i) => (
          <Link key={i.href} href={i.href} style={{ color: '#1f2937' }}>
            {i.label}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleLogout}>Sair (JWT)</button>
      </div>
    </aside>
  );
}
