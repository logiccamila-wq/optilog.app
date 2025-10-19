'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { apiFetch } from '@/utils/api';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const c = await apiFetch('/customers', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const p = await apiFetch('/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setCustomers(c || []);
        setProducts(p || []);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Dashboard (JWT)</h1>
        {loading && <p>Carregando dados...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Card title="Clientes" value={customers.length} />
              <Card title="Produtos" value={products.length} />
            </div>
            <h2>Lista de Clientes</h2>
            <Table columns={['id', 'name', 'email']} data={customers} />
            <h2>Lista de Produtos</h2>
            <Table columns={['id', 'name', 'price']} data={products} />
          </>
        )}
      </main>
    </div>
  );
}
