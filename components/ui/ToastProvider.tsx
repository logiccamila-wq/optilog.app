'use client';
import { createContext, useContext, useMemo, useState } from 'react';
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import { useTheme as useAppTheme } from '@/app/providers/ThemeProvider';

type ToastState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  actionLabel?: string;
  onAction?: (() => void) | null;
  duration?: number;
};
type ToastContextType = {
  show: (message: string, severity?: ToastState['severity']) => void;
  showWithAction: (opts: {
    message: string;
    severity?: ToastState['severity'];
    actionLabel?: string;
    onAction?: () => void;
    duration?: number;
  }) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
    actionLabel: undefined,
    onAction: null,
    duration: 3000,
  });

  const { accent, text, bg, secondary, font, effectiveMode } = useAppTheme();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: effectiveMode,
          primary: { main: accent },
          background: { default: bg, paper: secondary },
          text: { primary: text },
        },
        typography: {
          fontFamily: font,
        },
      }),
    [accent, text, bg, secondary, font, effectiveMode]
  );

  const value = useMemo(
    () => ({
      show: (message: string, severity: ToastState['severity'] = 'info') =>
        setToast({
          open: true,
          message,
          severity,
          actionLabel: undefined,
          onAction: null,
          duration: 3000,
        }),
      showWithAction: (opts: {
        message: string;
        severity?: ToastState['severity'];
        actionLabel?: string;
        onAction?: () => void;
        duration?: number;
      }) =>
        setToast({
          open: true,
          message: opts.message,
          severity: opts.severity ?? 'info',
          actionLabel: opts.actionLabel,
          onAction: opts.onAction ?? null,
          duration: opts.duration ?? 5000,
        }),
    }),
    []
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContext.Provider value={value}>
        {children}
        <Snackbar
          open={toast.open}
          autoHideDuration={toast.duration ?? 3000}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
            sx={{ width: '100%' }}
            action={
              toast.onAction ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    toast.onAction?.();
                    setToast((t) => ({ ...t, open: false }));
                  }}
                >
                  {toast.actionLabel || 'Desfazer'}
                </Button>
              ) : undefined
            }
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </ToastContext.Provider>
    </MUIThemeProvider>
  );
}
