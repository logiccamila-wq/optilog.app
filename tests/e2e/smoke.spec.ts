import { test, expect } from '@playwright/test';

const api = (p: string) => `${process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'}${p}`;

// 1) API: Health (stubbed) responde 200
test('API /api/health retorna 200', async ({ request }) => {
  const res = await request.get(api('/api/health'));
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('health', 'ok');
});

// 2) API: Functions status (stubbed) responde 200
test('API /api/functions-status retorna 200 (stubbed)', async ({ request }) => {
  const res = await request.get(api('/api/functions-status'));
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('status', 'stubbed');
});

// 3) UI: Home page renders hero content
test('Home renderiza o herói principal', async ({ page }) => {
  await page.goto(api('/'));
  await expect(page.getByRole('heading', { name: /A melhor startup/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Começar agora/i })).toBeVisible();
});