import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar qualquer estado de autenticação anterior
    // Garantir que a página tenha uma origem (evita SecurityError em about:blank)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'usuario.invalido@teste.com');
    await page.fill('input[type="password"]', 'senha_incorreta');
    
    const submitButton = page.getByRole('button', { name: /entrar|login/i });
    await submitButton.click();
    
  // Verificar se a mensagem de erro aparece (ajustar para mensagem padrão do componente)
  const errorMessage = await page.getByText(/email ou senha incorretos/i);
  await expect(errorMessage).toBeVisible();
  });

  test('deve redirecionar para dashboard após login bem-sucedido', async ({ page }) => {
    await page.goto('/login');
    
  // Usar credenciais de teste válidas
  await page.fill('input[type="email"]', 'motorista@teste.com');
  await page.fill('input[type="password"]', 'motorista123');
    
    const submitButton = page.getByRole('button', { name: /entrar|login/i });
    await submitButton.click();
    
  // Verificar redirecionamento para dashboard
  await page.waitForURL(/.*dashboard/);
  await expect(page).toHaveURL(/.*dashboard/);
    // Verificar se o título do dashboard está visível
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('deve manter usuário logado após refresh', async ({ page }) => {
    // Primeiro fazer login
  await page.goto('/login');
  await page.fill('input[type="email"]', 'motorista@teste.com');
  await page.fill('input[type="password"]', 'motorista123');
  await page.getByRole('button', { name: /entrar|login/i }).click();
    
  // Esperar pelo redirecionamento e UI autenticada
  await page.waitForURL(/.*dashboard/);
    
    // Recarregar a página
    await page.reload();
    
    // Verificar se ainda estamos na dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verificar se o título do dashboard está visível
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});