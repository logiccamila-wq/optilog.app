'use client';

import React, { createContext, useCallback, useState } from 'react';
import { Alert, Snackbar, AlertTitle } from '@mui/material';

export type ToastSeverity = 'error' | 'warning' | 'info' | 'success';

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, severity?: ToastSeverity, duration?: number) => void;
  removeToast: (id: string) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, severity: ToastSeverity = 'info', duration = 4000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, severity, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showError = useCallback(
    (message: string, title?: string) => {
      addToast(message, 'error', 5000);
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      addToast(message, 'success', 3000);
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      addToast(message, 'warning', 4000);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      addToast(message, 'info', 3000);
    },
    [addToast]
  );

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ mb: 2 }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              borderRadius: 1,
              fontSize: 14,
              '& .MuiAlert-icon': {
                mr: 1.5,
              },
            }}
          >
            {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}