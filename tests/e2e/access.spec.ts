import { test, expect } from '@playwright/test';

// Lista de usuários, senhas e módulos permitidos (extraído de lib/permissions.ts)
const users = [
  {
    email: 'motorista.jailson@ejgtransporte.com.br', password: 'motorista123', modules: ['dashboard', 'frota', 'tms']
  },
  {
    email: 'jailson.barros@ejgtransporte.com.br', password: 'financeiro123', modules: ['dashboard', 'financeiro', 'relatorios', 'aprovacoes']
  },
  {
    email: 'miguellareste37@gmail.com', password: 'auxiliar123', modules: ['dashboard', 'maintenance', 'service-orders', 'tpms']
  },
  {
    email: 'logiccamila@gmail.com', password: 'Multi12345678', modules: ['*']
  },
  {
    email: 'camila.eteste@gmail.com', password: 'Multi@#$%362748', modules: ['*']
  },
  {
    email: 'camila.etseral@gmail.com', password: 'Multi@#$%362748', modules: ['*']
  },
  {
    email: 'teste@teste.com', password: 'teste123', modules: ['dashboard', 'relatorios']
  },
  {
    email: 'motorista@teste.com', password: 'motorista123', modules: ['dashboard', 'frota', 'tms']
  },
  {
    email: 'mecanico@teste.com', password: 'mecanico123', modules: ['dashboard', 'service-orders', 'tire-service']
  },
  {
    email: 'comercial@ejgtransporte.com.br', password: 'comercial123', modules: ['dashboard', 'tms', 'crm']
  },
  {
    email: 'frota@ejgtransporte.com.br', password: 'frota123', modules: ['dashboard', 'frota', 'maintenance', 'service-orders', 'tpms', 'oficina', 'aprovacoes']
  },
  // Adicione outros usuários relevantes aqui
];

// Lista de módulos principais para testar acesso
const allModules = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/frota', label: 'Frota' },
  { path: '/frota/estoque', label: 'Estoque' },
  { path: '/tms', label: 'TMS' },
  { path: '/finance', label: 'Financeiro' },
  { path: '/relatorios', label: 'Relatórios' },
  { path: '/service-orders', label: 'Ordens de Serviço' },
  { path: '/maintenance', label: 'Manutenção' },
  { path: '/crm', label: 'CRM' },
  { path: '/aprovacoes', label: 'Aprovações' },
  { path: '/oficina', label: 'Oficina' },
  { path: '/tpms', label: 'TPMS' },
  { path: '/operacoes', label: 'Operações' },
  // Adicione outros módulos relevantes aqui
];

test.describe('Acesso por usuário e módulo', () => {
  for (const user of users) {
    test.describe(`${user.email}`, () => {
      for (const mod of allModules) {
        const shouldAccess = user.modules.includes('*') || user.modules.includes(mod.path.replace('/', '')) || user.modules.includes(mod.path.split('/')[1]);
        test(`deve ${shouldAccess ? 'ACESSAR' : 'BLOQUEAR'} ${mod.path}`, async ({ page, context }) => {
          // Login
          await page.goto('/login');
          await page.fill('input[type="email"]', user.email);
          await page.fill('input[type="password"]', user.password);
          await page.getByRole('button', { name: /entrar|login/i }).click();
          await page.waitForURL(/dashboard|login/);

          // Garante que o cookie httpOnly 'token' está presente no contexto do navegador
          // Após login, força reload do contexto para garantir persistência do cookie
          await page.waitForTimeout(500); // Pequeno delay para garantir setCookie
          const cookies = await context.cookies();
          const hasToken = cookies.some(c => c.name === 'token');
          if (!hasToken) {
            // Busca o token via document.cookie (não httpOnly, fallback para debug)
            const token = await page.evaluate(() => {
              const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
              return match ? decodeURIComponent(match[1]) : null;
            });
            if (token) {
              await context.addCookies([{
                name: 'token',
                value: token,
                url: 'http://localhost:3000',
                path: '/',
                httpOnly: false, // Permite leitura no client para debug
                sameSite: 'Lax',
              }]);
              await page.reload(); // Força reload para garantir sessão
            }
          }

          // Tenta acessar o módulo
          await page.goto(mod.path);
          if (shouldAccess) {
            // Espera algum conteúdo do módulo
            await expect(page).not.toHaveURL(/access-denied|login/);
          } else {
            // Deve ser redirecionado para access-denied ou login
            await expect(page).toHaveURL(/access-denied|login/);
          }
        });
      }
    });
  }
});
