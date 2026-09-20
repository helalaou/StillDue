import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';

test('orders nearest deadlines first and applies configurable urgency colors', async ({ page }) => {
  await enterDemo(page);

  const cards = page.locator('.deadline-card');
  await expect(cards.nth(0).getByRole('heading')).toHaveText('Full paper submission');
  await expect(cards.nth(1).getByRole('heading')).toHaveText('Fellowship application');
  await expect(cards.nth(2).getByRole('heading')).toHaveText('Portfolio refresh');

  await expect(cards.nth(0)).toHaveClass(/urgent.*urgency-colors/);
  await expect(cards.nth(0).locator('.countdown')).toHaveCSS('color', 'rgb(198, 59, 50)');
  await expect(cards.nth(0).locator('.time-progress > div')).toHaveCSS(
    'background-color',
    'rgb(198, 59, 50)',
  );
  await expect(cards.nth(1).locator('.countdown')).toHaveCSS('color', 'rgb(189, 107, 18)');
  await expect(cards.nth(2).locator('.countdown')).toHaveCSS('color', 'rgb(47, 125, 75)');

  await navigate(page, 'Settings');
  await page.getByTestId('urgency-colors-toggle').uncheck();
  await page.getByRole('button', { name: 'Save settings', exact: true }).first().click();
  await navigate(page, 'Overview');
  await expect(page.locator('.deadline-card').first()).not.toHaveClass(/urgency-colors/);
});
