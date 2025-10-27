import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar qualquer estado de autenticação anterior
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
    
    // Verificar se a mensagem de erro aparece
    const errorMessage = await page.getByText(/credenciais inválidas|usuário não encontrado/i);
    await expect(errorMessage).toBeVisible();
  });

  test('deve redirecionar para dashboard após login bem-sucedido', async ({ page }) => {
    await page.goto('/login');
    
    // Usar credenciais de teste (ajuste conforme necessário)
    await page.fill('input[type="email"]', 'teste@optilog.app');
    await page.fill('input[type="password"]', 'senha123');
    
    const submitButton = page.getByRole('button', { name: /entrar|login/i });
    await submitButton.click();
    
    // Verificar se o token foi armazenado no localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Verificar redirecionamento para dashboard
    await page.waitForURL(/.*dashboard/);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('deve manter usuário logado após refresh', async ({ page }) => {
    // Primeiro fazer login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'teste@optilog.app');
    await page.fill('input[type="password"]', 'senha123');
    await page.getByRole('button', { name: /entrar|login/i }).click();
    
    // Esperar pelo token ser salvo
    await page.waitForFunction(() => localStorage.getItem('token'));
    
    // Recarregar a página
    await page.reload();
    
    // Verificar se ainda estamos na dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verificar se elementos da UI autenticada estão presentes
    await expect(page.getByText(/sair|logout/i)).toBeVisible();
  });
});