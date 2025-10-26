"use client";
import { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Snackbar, Alert } from '@mui/material';

type ToastState = { open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' };
type ToastContextType = { show: (message: string, severity?: ToastState['severity']) => void };

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'info' });

  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#0E539A' },
      background: { default: '#0D111B', paper: '#272F44' },
      text: { primary: '#FFFFFF', secondary: '#909095' }
    },
    typography: {
      fontFamily: '"Segoe UI Variable", "Segoe UI", sans-serif'
    }
  }), []);

  const value = useMemo(() => ({
    show: (message: string, severity: ToastState['severity'] = 'info') => setToast({ open: true, message, severity })
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContext.Provider value={value}>
        {children}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </ToastContext.Provider>
    </ThemeProvider>
  );
}