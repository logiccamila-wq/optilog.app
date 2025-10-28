'use client';

import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: 500, 
        padding: 40,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <ShieldX size={64} color="#ef4444" style={{ margin: '0 auto 24px' }} />
        
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          color: '#ef4444',
          marginBottom: 16 
        }}>
          HTTP ERROR 403
        </h1>
        
        <h2 style={{ 
          fontSize: 24, 
          color: '#e5e7eb',
          marginBottom: 16 
        }}>
          Acesso Negado
        </h2>
        
        <p style={{ 
          color: '#9ca3af', 
          marginBottom: 32,
          lineHeight: 1.6 
        }}>
          Você não tem autorização para acessar esta página.
          <br />
          Este módulo é restrito apenas para administradores autorizados.
        </p>
        
        <Link 
          href="/dashboard" 
          style={{ 
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#ffffff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
