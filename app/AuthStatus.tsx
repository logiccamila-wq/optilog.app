"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthInstance } from '@/lib/firebaseClient';
import { Button, Typography, Box } from '@mui/material';

type UserInfo = { email?: string | null, displayName?: string | null } | null;

export default function AuthStatus() {
  const [user, setUser] = useState<UserInfo>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: any = null;
    (async () => {
      const auth = await getAuthInstance();
      if (!auth) { setReady(false); return; }
      setReady(true);
      unsub = auth.onAuthStateChanged((u) => {
        if (u) {
          setUser({ email: u.email, displayName: u.displayName });
        } else {
          setUser(null);
        }
      });
    })();
    return () => { try { unsub && unsub(); } catch {} };
  }, []);

  if (!ready) {
    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button component={Link} href="/login" color="inherit">Login</Button>
        <Button component={Link} href="/signup" color="inherit">Cadastro</Button>
      </Box>
    );
  }

  if (user) {
    const name = user.displayName || user.email || 'Usuário';
    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>Olá, {name}</Typography>
        <Button component={Link} href="/logout" color="inherit">Sair</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button component={Link} href="/login" color="inherit">Login</Button>
      <Button component={Link} href="/signup" color="inherit">Cadastro</Button>
    </Box>
  );
}