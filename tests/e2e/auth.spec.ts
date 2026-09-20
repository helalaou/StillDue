import { test, expect } from '@playwright/test';

test('presents Google login without obscuring the existing account paths', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore the demo' })).toBeVisible();
});
