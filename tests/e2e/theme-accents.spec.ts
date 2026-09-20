import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';

test('previews and applies accent colors in light and dark themes', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');

  await page.getByTestId('theme-select').selectOption('dark');
  await page.getByTestId('accent-select').selectOption('#3d5480');
  await expect(page.getByTestId('accent-swatch')).toHaveCSS(
    'background-color',
    'rgb(183, 201, 242)',
  );

  await expect(page.getByRole('status')).toContainText('Saved automatically');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect
    .poll(() =>
      page
        .locator('html')
        .evaluate((element) => getComputedStyle(element).getPropertyValue('--accent').trim()),
    )
    .toBe('#b7c9f2');

  await page.reload();
  await expect(page.getByTestId('accent-select')).toHaveValue('#3d5480');
  await expect
    .poll(() =>
      page
        .locator('html')
        .evaluate((element) => getComputedStyle(element).getPropertyValue('--accent').trim()),
    )
    .toBe('#b7c9f2');
});
