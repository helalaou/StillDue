import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';
test('shows large deadlines and device-specific e-ink mode', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Display mode');
  await expect(page.getByRole('heading', { name: 'Full paper submission' })).toBeVisible();
  await page.getByRole('button', { name: 'Display settings' }).click();
  await page.getByLabel('E-ink preset on this device').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'eink');
  await page.getByRole('button', { name: 'Lock display controls' }).click();
  await expect(page.getByRole('button', { name: 'Display settings' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Unlock display controls' })).toBeVisible();
});
test('resizes display cards within safe limits and remembers the device setting', async ({
  page,
}) => {
  await enterDemo(page);
  await navigate(page, 'Display mode');
  await page.getByRole('button', { name: 'Display settings' }).click();

  const size = page.getByRole('slider', { name: 'Card size' });
  await expect(size).toHaveValue('1');
  await page.getByRole('button', { name: 'Make cards larger' }).click();
  await expect(size).toHaveValue('1.1');
  await expect(page.locator('.display-grid')).toHaveCSS('--display-card-scale', '1.1');

  await page.reload();
  await page.getByRole('button', { name: 'Display settings' }).click();
  await expect(page.getByRole('slider', { name: 'Card size' })).toHaveValue('1.1');

  await page.getByRole('slider', { name: 'Card size' }).fill('1.3');
  await expect(page.getByRole('button', { name: 'Make cards larger' })).toBeDisabled();

  const sizeSettings = page.locator('.display-size-setting');
  await expect(sizeSettings.last()).toContainText('Card size');
});
test('resizes the display clock and date together and remembers the device setting', async ({
  page,
}) => {
  await enterDemo(page);
  await navigate(page, 'Display mode');
  await page.getByRole('button', { name: 'Display settings' }).click();

  const size = page.getByRole('slider', { name: 'Clock size' });
  await expect(size).toHaveValue('1');
  await page.getByRole('button', { name: 'Make clock larger' }).click();
  await expect(size).toHaveValue('1.1');
  await expect(page.locator('.display-clock')).toHaveCSS('--display-clock-scale', '1.1');

  await page.reload();
  await page.getByRole('button', { name: 'Display settings' }).click();
  await expect(page.getByRole('slider', { name: 'Clock size' })).toHaveValue('1.1');

  await page.getByRole('slider', { name: 'Clock size' }).fill('1.5');
  await expect(page.getByRole('button', { name: 'Make clock larger' })).toBeDisabled();
});
test('keeps the workspace within the viewport', async ({ page }) => {
  await enterDemo(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
  await navigate(page, 'Settings');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
});
