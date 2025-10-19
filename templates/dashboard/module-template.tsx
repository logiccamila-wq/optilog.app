'use client';
import { useEffect, useState, useMemo } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useI18n } from '@/app/providers/I18nProvider';
import { apiFetch } from '@/utils/api';

// Template para criar um novo módulo do dashboard
export default function ModuleTemplate({ params }: { params: { module: string } }) {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  const moduleKeyMap: Record<string, string> = {
    'novo-modulo': 'overview', // Ajuste a chave para o namespace i18n apropriado
  };
  const moduleKey = moduleKeyMap[params.module] || 'overview';

  useEffect(() => {
    // Substitua pelo endpoint real
    apiFetch('/example')
      .then((data) => setItems(Array.isArray(data) ? data.slice(0, 10) : []))
      .catch(() => setItems([]));
  }, [params.module]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>
        {t(`modules.${moduleKey}.title`)}
        <br />
        <small style={{ color: '#889' }}>{t(`modules.${moduleKey}.desc`)}</small>
      </h2>
      {items.length === 0 ? (
        <p style={{ color: '#aaa' }}>{t('common.no_data')}</p>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('common.id')}</TableCell>
              <TableCell>{t('common.created_at')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.id}</TableCell>
                <TableCell>{it.created_at || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}