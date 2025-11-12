
import { test, expect } from '@playwright/test';
import jwt from 'jsonwebtoken';

// Teste E2E para Gestão de Usuários
// Valida se a lista de usuários exibe corretamente nome, email, função e status

test.describe('Gestão de Usuários', () => {

    test('deve exibir lista de usuários com nome, email, função e status', async ({ page, context }) => {
      // Mocka autenticação: seta cookie 'token' fake
      // Gera um JWT válido para simular autenticação real
      const token = jwt.sign(
        {
          email: 'logiccamila@gmail.com',
          roles: ['super_gestor', 'administrador'],
          name: 'Camila Lareste',
        },
        'ba32d52e1bf0e80476cbdce482500830fe0cf23d39e732b926d4e964e1fdae73',
        { expiresIn: '2h' }
      );
      await context.addCookies([
        {
          name: 'token',
          value: token,
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          sameSite: 'Lax',
        },
      ]);
      await page.goto('/usuarios');

    // Espera o título da página
    await expect(page.getByRole('heading', { name: /Gestão de Usuários/i })).toBeVisible();

    // Valida presença dos usuários mockados
    await expect(page.getByText('Camila Lareste')).toBeVisible();
    await expect(page.getByText('camila@optilog.com')).toBeVisible();
    await expect(page.getByText(/Administrador/i)).toBeVisible();
    await expect(page.getByText(/Ativo/i)).toBeVisible();

    await expect(page.getByText('João Silva')).toBeVisible();
    await expect(page.getByText('joao.silva@optilog.com')).toBeVisible();
    await expect(page.getByText(/Motorista/i)).toBeVisible();

    await expect(page.getByText('Maria Santos')).toBeVisible();
    await expect(page.getByText('maria.santos@optilog.com')).toBeVisible();
    await expect(page.getByText(/Gestor/i)).toBeVisible();

    await expect(page.getByText('Carlos Oliveira')).toBeVisible();
    await expect(page.getByText('carlos@optilog.com')).toBeVisible();
    await expect(page.getByText(/Mecânico/i)).toBeVisible();
  });
});
