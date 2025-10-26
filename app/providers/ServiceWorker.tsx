"use client";
import { useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

export default function ServiceWorkerRegister() {
  const { show } = useToast();
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const onLoad = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker registrado');

          const notifyUpdate = (worker: ServiceWorker) => {
            try {
              window.dispatchEvent(new CustomEvent('sw-update-available', { detail: { worker } }));
            } catch {}
            show('Atualização disponível. Clique em Atualizar.', 'info');
          };

          if (reg.waiting) {
            notifyUpdate(reg.waiting);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                notifyUpdate(newWorker as unknown as ServiceWorker);
              }
            });
          });

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        } catch (err) {
          console.warn('ServiceWorker falhou:', err);
        }
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);
  return null;
}