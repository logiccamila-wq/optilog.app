"use client";
import { useEffect, useState } from 'react';
import { stackAuth } from '@/lib/stackAuth';
import { neonClient } from '@/lib/neonClient';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, Stack } from '@mui/material';

type Check = { name: string; ok: boolean; detail?: string };

export default function StatusPage() {
  const [authChecks, setAuthChecks] = useState<Check[]>([]);
  const [dbChecks, setDbChecks] = useState<Check[]>([]);

  useEffect(() => {
    const run = async () => {
      const checksAuth: Check[] = [];
      const checksDb: Check[] = [];

      // Stack Auth
      try {
        const user = await stackAuth.getCurrentUser();
        checksAuth.push({ 
          name: 'Stack Auth', 
          ok: !!user, 
          detail: user ? `Usuário: ${user.email}` : 'Não autenticado' 
        });
        checksAuth.push({ 
          name: 'Projeto', 
          ok: !!process.env.NEXT_PUBLIC_STACK_AUTH_PROJECT_ID, 
          detail: process.env.NEXT_PUBLIC_STACK_AUTH_PROJECT_ID || 'Não configurado' 
        });
      } catch (e: any) {
        checksAuth.push({ name: 'Auth erro', ok: false, detail: e?.message || String(e) });
      }

      // Neon Database
      try {
        const hasUrl = !!process.env.NEXT_PUBLIC_NEON_REST_URL || !!process.env.NEON_REST_URL;
        checksDb.push({ 
          name: 'Neon REST API', 
          ok: hasUrl, 
          detail: hasUrl ? 'Configurado' : 'URL não configurada' 
        });
        
        // Testa conexão
        const response = await neonClient.list('orders');
        checksDb.push({ 
          name: 'Conexão DB', 
          ok: response.success, 
          detail: response.success ? 'OK' : (response.error || 'Erro ao conectar') 
        });
      } catch (e: any) {
        checksDb.push({ name: 'Database erro', ok: false, detail: e?.message || String(e) });
      }

      setAuthChecks(checksAuth);
      setDbChecks(checksDb);
    };
    run();
  }, []);

  const Section = ({ title, items }: { title: string, items: Check[] }) => (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Carregando...</Typography>
      ) : (
        <List dense>
          {items.map((c, i) => (
            <ListItem key={i} sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{c.name}</span>
                    <Chip size="small" color={c.ok ? 'success' : 'warning'} label={c.ok ? 'OK' : 'AVISO'} />
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
          <Typography variant="h5" sx={{ mb: 1 }}>Status do Sistema</Typography>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Stack Auth + Neon Database + Vercel Deploy
            </Typography>
          </Paper>
        </Box>
        <Section title="Autenticação" items={authChecks} />
        <Section title="Database" items={dbChecks} />
      </Stack>
    </main>
  );
}