import { test, expect } from '@playwright/test';

const api = (p: string) => `${process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'}${p}`;

// 1) API: Next server status (always available, no envs required)
test('API /nextServer/status responde ok', async ({ request }) => {
  const res = await request.get(api('/nextServer/status'));
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('ok', true);
});

// 2) API: Functions status (should not timeout even without Firebase envs)
test('API /api/functions-status retorna 200 com JSON', async ({ request }) => {
  const res = await request.get(api('/api/functions-status'));
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('ok');
  expect(json).toHaveProperty('status');
});

// 3) UI: Home page renders hero content
test('Home renderiza o herói principal', async ({ page }) => {
  await page.goto(api('/'));
  await expect(page.getByRole('heading', { name: /A melhor startup/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Começar agora/i })).toBeVisible();
});