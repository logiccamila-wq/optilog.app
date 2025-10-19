'use client';
import React from 'react';
import Link from 'next/link';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/login', label: 'Login' },
  { href: '/', label: 'Home' },
];

export default function Sidebar() {
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
    </aside>
  );
}
