export type ThemeMode = 'system' | 'light' | 'dark';
export type AccentPreset = 'blue' | 'purple' | 'green';

export const appConfig = {
  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'pt-BR',
    supportedLocales: ['pt-BR', 'en', 'es'],
  },
  ui: {
    header: {
      // Define se controles de UI (tema, idioma etc.) aparecem no Header
      showControls: process.env.NEXT_PUBLIC_HEADER_CONTROLS === '1',
    },
    theme: {
      mode: (process.env.NEXT_PUBLIC_DEFAULT_THEME as ThemeMode) || 'system',
      accent: (process.env.NEXT_PUBLIC_DEFAULT_ACCENT as AccentPreset) || 'blue',
    },
  },
  automation: {
    // Se existir URL de dashboard, habilita redirecionamento automático
    autoRedirectDashboard: !!process.env.NEXT_PUBLIC_DASHBOARD_URL,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    postsApiBaseUrl: process.env.NEXT_PUBLIC_POSTS_API_URL,
    dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL,
  },
  // Add about/company and AI providers
  about: {
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Optilog',
    organizations: (process.env.NEXT_PUBLIC_ORGANIZATIONS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    aiProviders: (process.env.NEXT_PUBLIC_AI_PROVIDERS || 'Gemini,ChatGPT')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
  integration: {
    firebase: {
      enabled: process.env.NEXT_PUBLIC_DISABLE_FIREBASE !== '1',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    },
    analytics: {
      gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
    },
    supabase: {
      enabled:
        !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    // Novas integrações: n8n, Zoho Mail e SEFAZ/CT-e
    n8n: {
      enabled: !!process.env.NEXT_PUBLIC_N8N_BASE_URL,
      baseUrl: process.env.NEXT_PUBLIC_N8N_BASE_URL,
      healthPath: process.env.NEXT_PUBLIC_N8N_HEALTH_PATH || '/healthz',
      webhookBase: process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE || '/webhook',
    },
    zohoMail: {
      enabled:
        !!process.env.NEXT_PUBLIC_ZOHO_MAIL_API_BASE_URL &&
        !!process.env.NEXT_PUBLIC_ZOHO_MAIL_TOKEN,
      apiBaseUrl: process.env.NEXT_PUBLIC_ZOHO_MAIL_API_BASE_URL,
      token: process.env.NEXT_PUBLIC_ZOHO_MAIL_TOKEN,
      accountId: process.env.NEXT_PUBLIC_ZOHO_MAIL_ACCOUNT_ID,
    },
    sefaz: {
      enabled: !!process.env.NEXT_PUBLIC_SEFAZ_CTE_BASE_URL,
      env: process.env.NEXT_PUBLIC_SEFAZ_ENV || 'homologacao',
      cteBaseUrl: process.env.NEXT_PUBLIC_SEFAZ_CTE_BASE_URL,
      // caminhos/ids opcionais para certificados e credenciais
      certificatePath: process.env.NEXT_PUBLIC_SEFAZ_CERT_PATH,
      certificateId: process.env.NEXT_PUBLIC_SEFAZ_CERT_ID,
      companyCNPJ: process.env.NEXT_PUBLIC_COMPANY_CNPJ,
    },
  },
} satisfies {
  i18n: { defaultLocale: string; supportedLocales: string[] };
  ui: {
    header: { showControls: boolean };
    theme: { mode: ThemeMode; accent: AccentPreset };
  };
  automation: { autoRedirectDashboard: boolean };
  api: {
    baseUrl?: string;
    postsApiBaseUrl?: string;
    dashboardUrl?: string;
  };
  about: {
    companyName: string;
    organizations: string[];
    aiProviders: string[];
  };
  integration: {
    firebase: { enabled: boolean; projectId?: string; apiKey?: string };
    analytics: { gaMeasurementId?: string };
    supabase?: { enabled: boolean; url?: string; anonKey?: string };
    n8n?: { enabled: boolean; baseUrl?: string; healthPath?: string; webhookBase?: string };
    zohoMail?: { enabled: boolean; apiBaseUrl?: string; token?: string; accountId?: string };
    sefaz?: {
      enabled: boolean;
      env?: string;
      cteBaseUrl?: string;
      certificatePath?: string;
      certificateId?: string;
      companyCNPJ?: string;
    };
  };
};
