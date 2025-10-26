"use client";
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

// Botão simples para instalar o PWA quando o evento beforeinstallprompt é disparado
export default function InstallBadge() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as any);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as any);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  if (!visible) return null;

  const onClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } finally {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <Button onClick={onClick} size="small" variant="outlined" color="inherit">
      Instalar app
    </Button>
  );
}