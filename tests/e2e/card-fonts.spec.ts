import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';

test('previews and persists the deadline card typeface', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');

  await page.getByTestId('card-font-select').selectOption('atkinson');
  await expect(page.locator('.settings-preview .deadline-card')).toHaveCSS(
    'font-family',
    /Atkinson Hyperlegible/,
  );
  await page.getByRole('button', { name: 'Save settings', exact: true }).first().click();

  await page.reload();
  await expect(page.getByTestId('card-font-select')).toHaveValue('atkinson');
  await navigate(page, 'Overview');
  await expect(page.locator('.deadline-card').first()).toHaveCSS(
    'font-family',
    /Atkinson Hyperlegible/,
  );
});
