'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AccessControl from '@/components/AccessControl';
import type { Role } from '@/lib/rbac';
import { useI18n } from '@/app/providers/I18nProvider';

const ALLOWED_ROLES: Role[] = ['director', 'admin'];

export default function SuperGestorPage() {
  const { t } = useI18n();
  const router = useRouter();
  const externalUrl = process.env.NEXT_PUBLIC_SUPERGESTOR_URL;

  useEffect(() => {
    if (externalUrl) {
      // Optionally redirect automatically
      try {
        window.location.href = externalUrl;
      } catch {}
    }
  }, [externalUrl]);

  if (externalUrl) {
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
    <AccessControl roles={ALLOWED_ROLES}>
      <div style={{ maxWidth: 900, margin: '32px auto', padding: 24 }}>
        <h1 style={{ color: '#a6d3ff', fontSize: 28 }}>{t('nav.supergestor')}</h1>
        <p style={{ color: '#bbb', marginTop: 8 }}>
          Para abrir o módulo SuperGestor hospedado externamente, defina `NEXT_PUBLIC_SUPERGESTOR_URL`.
        </p>
        <p style={{ color: '#999', marginTop: 8 }}>
          Exemplo: `https://supergestor.seu-dominio.com` ou instância em Render/Vercel.
        </p>
        <div style={{ marginTop: 16, color: '#667' }}>
          <p>
            Enquanto não estiver configurado, você pode acessar os módulos locais no Dashboard.
          </p>
        </div>
      </div>
    </AccessControl>
  );
}