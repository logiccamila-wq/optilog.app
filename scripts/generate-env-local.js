/**
 * Gera/atualiza .env.local com valores padrão de desenvolvimento.
 * Uso: node scripts/generate-env-local.js [--force]
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envLocalPath = path.join(root, '.env.local');

const defaults = {
  // Frontend/service endpoints
  NEXT_PUBLIC_POSTS_API_URL: 'http://localhost:3000/api',
  NEXT_PUBLIC_DASHBOARD_URL: '',
  NEXT_PUBLIC_SUPERGESTOR_URL: '',
  NEXT_PUBLIC_MAPBOX_TOKEN: '',
  NEXT_PUBLIC_IOT_WS_URL: 'ws://localhost:4010',
  NEXT_PUBLIC_ORS_PROXY_URL: 'http://localhost:4001/route',
  NEXT_PUBLIC_DEFAULT_LOCALE: 'pt',
  NEXT_PUBLIC_BACKEND_URL: 'http://localhost:4000',

  // Company info for UI/invoices/footer
  NEXT_PUBLIC_COMPANY_CNPJ: '49.174.848/0001-09',
  NEXT_PUBLIC_COMPANY_NAME: 'XYZ LOGIC FLOW INOVA SIMPLES (I.S.)',
  NEXT_PUBLIC_COMPANY_ADDRESS: 'Rua Padre Hamilton Tadeu Maito, 125, Cidade Vitoria, Assis/SP, 19807-075',
  NEXT_PUBLIC_COMPANY_EMAIL: 'xyzlogicflow@gmail.com',
  NEXT_PUBLIC_COMPANY_PHONE: '+55 18 99636-1278',
  NEXT_PUBLIC_FOOTER_LABEL_STARTUP: 'xyzlogicflow startup',
  NEXT_PUBLIC_FOOTER_LABEL_PILOT_CLIENT: 'ejg cliente piloto',

  // Stack Auth for GitHub OAuth
  NEXT_PUBLIC_STACK_AUTH_PROJECT_ID: '',
  STACK_AUTH_JWKS_URL: 'https://api.stack-auth.com/v1/jwks',
  NEXT_PUBLIC_STACK_AUTH_AUTHORIZE_URL: '',
  NEXT_PUBLIC_STACK_AUTH_REDIRECT_URL: 'http://localhost:3000/api/auth/callback',
};

// Opcional: se já existir no ambiente, inclui DATABASE_URL
if (process.env.DATABASE_URL) {
  defaults.DATABASE_URL = process.env.DATABASE_URL;
}

function parseEnv(content) {
  const lines = content.split(/\r?\n/);
  const out = {};
  for (const l of lines) {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function serializeEnv(obj) {
  const keys = Object.keys(obj);
  return keys.map((k) => `${k}=${obj[k] ?? ''}`).join('\n') + '\n';
}

function run() {
  const force = process.argv.includes('--force');
  let current = {};
  if (fs.existsSync(envLocalPath)) {
    const raw = fs.readFileSync(envLocalPath, 'utf-8');
    current = parseEnv(raw);
  }
  const merged = { ...defaults, ...current };
  if (!fs.existsSync(envLocalPath) || force) {
    fs.writeFileSync(envLocalPath, serializeEnv(merged), 'utf-8');
    console.log(`${force ? 'Sobrescrito' : 'Criado'}: .env.local`);
  } else {
    // Atualiza apenas as chaves ausentes
    const addOnly = Object.assign({}, current);
    for (const k of Object.keys(defaults)) {
      if (!(k in addOnly)) addOnly[k] = defaults[k];
    }
    fs.writeFileSync(envLocalPath, serializeEnv(addOnly), 'utf-8');
    console.log('Atualizado: .env.local (apenas chaves ausentes)');
  }
}

run();