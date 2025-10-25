'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useI18n } from '@/app/providers/I18nProvider';
import { useTheme } from '@/app/providers/ThemeProvider';
import { appConfig } from '@/config/app.config';
import { useAuth } from '@/app/providers/AuthProvider';

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const kioskParam = searchParams.get('kiosk') === '1' || searchParams.get('display') === 'kiosk';
  // Hooks must be called unconditionally at top-level
  const {
    mode,
    setMode,
    accent,
    setAccent,
    font,
    setFont,
    align,
    setAlign,
    effectiveMode,
    reset,
    text,
    setText,
    applyPreset,
  } = useTheme();
  const showControls = appConfig.ui.header.showControls;
  const { user, setRoles } = useAuth();
  // Atualização dinâmica do horário exibido (hooks devem estar antes de qualquer return)
  const [updatedAt, setUpdatedAt] = React.useState<Date>(new Date());
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setUpdatedAt(new Date()), 10000);
    return () => clearInterval(id);
  }, []);
  if (pathname.startsWith('/display') || kioskParam) return null;
  const currentRole = user?.roles?.[0] || 'admin';
  const updatedLabel = mounted ? updatedAt.toLocaleTimeString() : '—';
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(6px)',
        background: 'rgba(0,0,0,0.6)',
        borderBottom: '1px solid #222',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
        >
          <Image src="/logo.svg" alt="Devoptilog" width={24} height={24} />
          <strong style={{ color: '#9ecfff', letterSpacing: '0.08em' }}>DEVOPTILOG</strong>
        </Link>

        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#ddd' }}>
            {t('nav.dashboard')}
          </Link>
          <Link href="/quem-somos" style={{ color: '#ddd' }}>
            Quem Somos
          </Link>
          {(currentRole === 'admin' || currentRole === 'director') && (
            <Link href="/supergestor" style={{ color: '#ddd' }}>
              {t('nav.supergestor')}
            </Link>
          )}
          {showControls && (
            <>
              <span style={{ color: '#666' }}>|</span>
              <label style={{ color: '#aaa', fontSize: 13 }}>
                Tema:
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  style={{
                    marginLeft: 6,
                    background: 'transparent',
                    color: '#ddd',
                    border: '1px solid #333',
                    borderRadius: 6,
                    padding: '2px 6px',
                  }}
                >
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </label>
              <label style={{ color: '#aaa', fontSize: 13 }}>
                Preset:
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v) applyPreset(v as any);
                  }}
                  style={{
                    marginLeft: 6,
                    background: 'transparent',
                    color: '#ddd',
                    border: '1px solid #333',
                    borderRadius: 6,
                    padding: '2px 6px',
                  }}
                >
                  <option value="">—</option>
                  <option value="neon">Neon</option>
                  <option value="tech">Tech</option>
                  <option value="classic">Classic</option>
                </select>
              </label>
              <label style={{ color: '#aaa', fontSize: 13 }}>
                Destaque:
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  style={{ marginLeft: 6, verticalAlign: 'middle' }}
                />
              </label>
              <label style={{ color: '#aaa', fontSize: 13 }}>
                Texto:
                <input
                  type="color"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ marginLeft: 6, verticalAlign: 'middle' }}
                />
              </label>
              <label style={{ color: '#aaa', fontSize: 13 }}>
                Alinhamento:
                <select
                  value={align}
                  onChange={(e) => setAlign(e.target.value as any)}
                  style={{
                    marginLeft: 6,
                    background: 'transparent',
                    color: '#ddd',
                    border: '1px solid #333',
                    borderRadius: 6,
                    padding: '2px 6px',
                  }}
                >
                  <option value="left">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="right">Direita</option>
                </select>
              </label>
              <label style={{ color: '#aaa', fontSize: 13 }}>
                Fonte:
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  style={{
                    marginLeft: 6,
                    background: 'transparent',
                    color: '#ddd',
                    border: '1px solid #333',
                    borderRadius: 6,
                    padding: '2px 6px',
                  }}
                >
                  <option value='"Segoe UI Variable", "Segoe UI", system-ui, sans-serif'>
                    Segoe UI Variable
                  </option>
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="Roboto, system-ui, sans-serif">Roboto</option>
                  <option value="Nunito, system-ui, sans-serif">Nunito</option>
                  <option value='"Open Sans", system-ui, sans-serif'>Open Sans</option>
                </select>
              </label>
              <button
                onClick={reset}
                style={{
                  marginLeft: 6,
                  background: 'transparent',
                  color: '#9ecfff',
                  border: '1px solid #1e3a8a',
                  borderRadius: 6,
                  padding: '4px 8px',
                }}
              >
                Reset
              </button>
            </>
          )}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Seletor de Papéis */}
          <label style={{ color: '#aaa', fontSize: 13 }}>
            Papel:
            <select
              value={currentRole}
              onChange={(e) => setRoles([e.target.value as any])}
              style={{
                marginLeft: 6,
                background: 'transparent',
                color: '#9ecfff',
                border: '1px solid #1e3a8a',
                borderRadius: 6,
                padding: '4px 8px',
              }}
            >
              <option value="admin">Admin</option>
              <option value="director">Diretoria</option>
              <option value="driver">Motorista</option>
              <option value="mechanic">Mecânico</option>
            </select>
          </label>

          {/* Seletor de idioma existente */}
          <label style={{ color: '#aaa', fontSize: 13 }}>
            {t('nav.language')}:
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{
                marginLeft: 6,
                background: 'transparent',
                color: '#9ecfff',
                border: '1px solid #1e3a8a',
                borderRadius: 6,
                padding: '4px 8px',
              }}
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </label>
          {/* Indicador de tempo de atualização */}
          <span
            title="Horário da última atualização"
            style={{
              marginLeft: 8,
              color: '#9ecfff',
              fontSize: 12,
              border: '1px solid #1e3a8a',
              borderRadius: 6,
              padding: '4px 8px',
              background: 'rgba(30,58,138,0.15)',
            }}
          >
            Atualizado: {updatedLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
