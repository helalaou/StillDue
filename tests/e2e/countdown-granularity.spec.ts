import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';

test('previews, saves, and live-updates second-level countdowns', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');

  await page.getByTestId('countdown-granularity-select').selectOption('seconds');
  const preview = page.locator('.settings-preview .detailed-time');
  await expect(preview).toHaveText(/^\d+d \d{2}h \d{2}m \d{2}s$/);
  const before = await preview.textContent();
  await expect.poll(() => preview.textContent(), { timeout: 2500 }).not.toBe(before);

  await page.getByRole('button', { name: 'Save settings', exact: true }).first().click();
  await page.reload();
  await expect(page.getByTestId('countdown-granularity-select')).toHaveValue('seconds');
  await navigate(page, 'Overview');
  await expect(page.locator('.deadline-card .detailed-time').first()).toHaveText(
    /^\d+d \d{2}h \d{2}m \d{2}s$/,
  );
});
