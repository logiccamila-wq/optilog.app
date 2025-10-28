'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/providers/I18nProvider';

// ACESSO RESTRITO: Apenas Camila (Owner/Director)
const ALLOWED_EMAILS = ['camila.etseral@gmail.com', 'logiccamila@gmail.com'];

export default function SuperGestorPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const externalUrl = process.env.NEXT_PUBLIC_SUPERGESTOR_URL;

  // Verificar autenticação (sempre executado)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          const email = data.email || data.user?.email;
          
          // Verificar se o email está na lista de autorizados
          if (email && ALLOWED_EMAILS.includes(email.toLowerCase())) {
            setIsAuthorized(true);
          } else {
            // Redirecionar para página de acesso negado
            router.push('/access-denied');
          }
        } else {
          // Não autenticado - redirecionar para login
          router.push('/login?redirect=/supergestor');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/login?redirect=/supergestor');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Redirecionar para URL externa se configurada (sempre executado)
  useEffect(() => {
    if (externalUrl && isAuthorized && !isLoading) {
      window.location.href = externalUrl;
    }
  }, [externalUrl, isAuthorized, isLoading]);

  // Mostrar loading enquanto verifica
  if (isLoading || !isAuthorized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0e27'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p style={{ color: '#999' }}>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (externalUrl && isAuthorized) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ color: '#a6d3ff', fontSize: 28 }}>{t('nav.supergestor')}</h1>
        <p style={{ color: '#bbb' }}>{t('dashboard.external.redirecting')}</p>
        <p>
          <a href={externalUrl} style={{ color: '#9ecfff', textDecoration: 'underline' }}>
            {t('dashboard.external.click')} {externalUrl}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 24 }}>
      <h1 style={{ color: '#a6d3ff', fontSize: 28 }}>🔐 SuperGestor - Acesso Restrito</h1>
      <p style={{ color: '#4ade80', marginTop: 8, fontSize: 14 }}>
        ✅ Acesso autorizado para: Camila (Owner/Director)
      </p>
      <p style={{ color: '#bbb', marginTop: 8 }}>
        Este módulo contém informações estratégicas e confidenciais da empresa.
      </p>
      <div style={{ marginTop: 24, padding: 16, background: '#1a1f3a', borderRadius: 8, border: '1px solid #334155' }}>
        <h3 style={{ color: '#a6d3ff', marginBottom: 12 }}>Configuração Externa</h3>
        <p style={{ color: '#999', fontSize: 14 }}>
          Para conectar ao SuperGestor hospedado externamente, defina a variável:
        </p>
        <code style={{ display: 'block', marginTop: 8, padding: 8, background: '#0a0e27', color: '#4ade80', borderRadius: 4 }}>
          NEXT_PUBLIC_SUPERGESTOR_URL=https://supergestor.seu-dominio.com
        </code>
      </div>
    </div>
  );
}
