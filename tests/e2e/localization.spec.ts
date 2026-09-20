import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';

test('changes and persists the workspace language', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');
  await page.getByTestId('language-select').selectOption('es', { force: true });
  const menu = page.locator('.mobile-menu');
  if (await menu.isVisible()) await menu.click();
  await expect(page.getByRole('link', { name: 'Resumen', exact: true })).toBeVisible();
  if (await menu.isVisible()) {
    await page.getByRole('link', { name: 'Ajustes', exact: true }).click();
  }
  await expect(page.getByRole('status')).toContainText('Saved automatically');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  if ((page.viewportSize()?.width ?? 1024) < 760) {
    await page.getByRole('button', { name: 'Abrir navegación', exact: true }).click();
  }
  await expect(page.getByRole('link', { name: 'Resumen', exact: true })).toBeVisible();
});

test('uses right-to-left document direction for Arabic', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');
  await page.getByTestId('language-select').selectOption('ar', { force: true });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const menu = page.locator('.mobile-menu');
  if (await menu.isVisible()) await menu.click();
  await expect(page.getByRole('link', { name: 'نظرة عامة', exact: true })).toBeVisible();
  const overflow = await page
    .locator('body')
    .evaluate((body) => body.scrollWidth > body.clientWidth);
  expect(overflow).toBe(false);
});
