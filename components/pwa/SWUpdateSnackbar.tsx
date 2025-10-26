"use client";
import { useEffect, useRef, useState } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';

export default function SWUpdateSnackbar() {
  const [open, setOpen] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const ce = e as CustomEvent;
      waitingRef.current = ce.detail?.worker || null;
      setOpen(true);
    };
    window.addEventListener('sw-update-available', onUpdate as EventListener);
    return () => window.removeEventListener('sw-update-available', onUpdate as EventListener);
  }, []);

  const applyUpdate = () => {
    const w = waitingRef.current;
    if (w) {
      w.postMessage({ type: 'SKIP_WAITING' });
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="info" action={<Button color="inherit" size="small" onClick={applyUpdate}>Atualizar</Button>}>
        Nova versão disponível do aplicativo.
      </Alert>
    </Snackbar>
  );
}