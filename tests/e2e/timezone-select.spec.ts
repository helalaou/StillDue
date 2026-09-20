import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';

test('selects and automatically saves a timezone with a native dropdown', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Settings');

  const timezone = page.getByTestId('timezone-select');
  await expect(timezone).toHaveValue('America/New_York');
  await timezone.selectOption('America/Los_Angeles');
  await expect(page.getByRole('status')).toContainText('Saved automatically');

  await page.reload();
  await expect(page.getByTestId('timezone-select')).toHaveValue('America/Los_Angeles');
});
