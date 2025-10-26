"use client";
import { useEffect, useState } from 'react';
import { app, getDb, getAuthInstance } from '@/lib/firebaseClient';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, Stack } from '@mui/material';

type Check = { name: string; ok: boolean; detail?: string };

export default function StatusPage() {
  const [authChecks, setAuthChecks] = useState<Check[]>([]);
  const [fsChecks, setFsChecks] = useState<Check[]>([]);
  const [fnChecks, setFnChecks] = useState<Check[]>([]);

  useEffect(() => {
    const run = async () => {
      const checksAuth: Check[] = [];
      const checksFs: Check[] = [];
      const checksFn: Check[] = [];

      // Config
      const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '—';
      const domain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '—';

      // Auth via SDK modular (carregado dinamicamente no client)
      try {
        const hasApp = !!app;
        checksAuth.push({ name: 'Firebase App', ok: hasApp, detail: hasApp ? `projectId=${pid}` : 'App não inicializado' });
        if (hasApp) {
          const auth = await getAuthInstance();
          let currentUser = auth?.currentUser || null;
          if (!currentUser && auth) {
            await new Promise<void>(async (resolve) => {
              const { onAuthStateChanged } = await import('firebase/auth');
              const unsub = onAuthStateChanged(auth!, () => { unsub(); resolve(); });
            });
            currentUser = auth?.currentUser || null;
          }
          checksAuth.push({ name: 'Sessão', ok: !!currentUser, detail: currentUser ? (currentUser.email || 'logado') : 'não logado' });
          checksAuth.push({ name: 'Domínio Auth', ok: !!domain, detail: domain });
        }
      } catch (e: any) {
        checksAuth.push({ name: 'Auth erro', ok: false, detail: e?.message || String(e) });
      }

      // Firestore
      try {
        const db = await getDb();
        const hasDb = !!db;
        checksFs.push({ name: 'Firestore', ok: hasDb, detail: hasDb ? 'db inicializado' : 'db não inicializado' });
        if (hasDb) {
          const { collection, getDocs, limit, query, where } = await import('firebase/firestore');
          const q = query(collection(db!, 'posts'), where('is_published', '==', true), limit(1));
          const snap = await getDocs(q);
          checksFs.push({ name: 'Leitura posts publicados', ok: true, detail: `docs=${snap.size}` });
        }
      } catch (e: any) {
        checksFs.push({ name: 'Leitura posts erro', ok: false, detail: e?.message || String(e) });
      }

      // Functions: checagem via API server-side (evita dependências Node no client)
      try {
        const r = await fetch('/api/functions-status');
        const j = await r.json();
        checksFn.push({ name: 'Functions', ok: !!j.ok, detail: j.ok ? 'HTTP disponível' : (j.error || `status=${j.status}`) });
      } catch (e: any) {
        checksFn.push({ name: 'Functions', ok: false, detail: e?.message || String(e) });
      }

      setAuthChecks(checksAuth);
      setFsChecks(checksFs);
      setFnChecks(checksFn);
    };
    run();
  }, []);

  const Section = ({ title, items }: { title: string, items: Check[] }) => (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Sem dados no momento.</Typography>
      ) : (
        <List dense>
          {items.map((c, i) => (
            <ListItem key={i} sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{c.name}</span>
                    <Chip size="small" color={c.ok ? 'success' : 'error'} label={c.ok ? 'OK' : (c.name === 'Sessão' ? 'NÃO LOGADO' : (c.name === 'Functions' ? 'N/A' : 'ERRO'))} />
                  </Box>
                }
                secondary={<Typography variant="caption" color="text.secondary">{c.detail}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );

  return (
    <main className="container">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>Status do Backend</Typography>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Projeto: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '—'} | Domínio Auth: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '—'}
            </Typography>
            {!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && (
              <Typography variant="caption" color="text.secondary">
                Defina variáveis NEXT_PUBLIC_FIREBASE_* para dados completos.
              </Typography>
            )}
          </Paper>
        </Box>
        <Section title="Auth" items={authChecks} />
        <Section title="Firestore" items={fsChecks} />
        <Section title="Functions" items={fnChecks} />
      </Stack>
    </main>
  );
}