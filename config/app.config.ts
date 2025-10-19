export const appConfig = {
  ui: {
    header: {
      // Define se controles de UI (tema, preset, etc.) aparecem no Header
      // Para habilitar, defina NEXT_PUBLIC_HEADER_CONTROLS=1 no .env.local
      showControls: process.env.NEXT_PUBLIC_HEADER_CONTROLS === '1',
    },
  },
};