'use client'
import React, { ReactNode } from 'react'
import Link from 'next/link'
import { Boxes, Package, Truck, ShoppingCart, Users, Grid3X3 } from 'lucide-react'

export default function ModulesLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 60px)' }}>
      <aside
        style={{
          borderRight: '1px solid #222',
          padding: 16,
          background: 'rgba(0,0,0,0.35)',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#9ecfff', letterSpacing: '0.06em' }}>Módulos</h2>
        <nav style={{ display: 'grid', gap: 8 }}>
          <Link href="/modules" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Grid3X3 size={18} /> Visão Geral
            </span>
          </Link>
          <Link href="/modules/roadmap" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Grid3X3 size={18} /> Roadmap
            </span>
          </Link>
          <Link href="/modules/wms" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Boxes size={18} /> WMS (Warehouse)
            </span>
          </Link>
          <Link href="/modules/tms" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} /> TMS (Transportes)
            </span>
          </Link>
          <Link href="/modules/oms" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={18} /> OMS (Pedidos)
            </span>
          </Link>
          <Link href="/modules/scm" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Package size={18} /> SCM (Cadeia de Suprimentos)
            </span>
          </Link>
          <Link href="/modules/crm" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} /> CRM (Relacionamento)
            </span>
          </Link>
          <Link href="/modules/erp" style={{ color: '#ddd' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Package size={18} /> ERP (Empresa)
            </span>
          </Link>
        </nav>
        <div style={{ marginTop: 16, fontSize: 13, color: '#9aa3b0' }}>
          Estrutura baseada em kits (GitHub/Neon) com coluna à esquerda.
        </div>
      </aside>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  )
}