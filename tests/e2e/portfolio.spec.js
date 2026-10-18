import { expect, test } from '@playwright/test';

test('renders the Turkish portfolio without language controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kenan Kuşçu');
  await expect(page.locator('.project-item')).toHaveCount(2);
  await expect(page.locator('.skill-row')).toHaveCount(7);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.getByRole('heading', { name: 'Seçili çalışmalar' })).toBeVisible();
  await expect(page.locator('.language-switch')).toHaveCount(0);
});

test('allows the administrator to sign in', async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_PASSWORD, 'Set E2E_ADMIN_PASSWORD to run the authenticated flow.');
  await page.goto('/admin');
  await page.getByLabel('Kullanıcı adı').fill('admin');
  await page.getByLabel('Parola').fill(process.env.E2E_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Giriş yap' }).click();
  await expect(page.getByRole('heading', { name: 'Site ayarları' })).toBeVisible();
});
