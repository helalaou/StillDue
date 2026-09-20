import { test, expect } from '@playwright/test';

test('presents Google login without obscuring the existing account paths', async ({ page }) => {
  await page.goto('/');
  const google = page.getByRole('button', { name: /Continue with Google/ });
  const email = page.getByRole('button', { name: 'Sign in', exact: true });
  await expect(google).toBeVisible();
  await expect(email).toBeVisible();
  const googleBox = await google.boundingBox();
  const emailBox = await email.boundingBox();
  expect(googleBox?.height).toBeGreaterThan(emailBox?.height || 0);
  await expect(email).toHaveClass(/secondary/);
  await expect(page.getByRole('button', { name: 'Explore the demo' })).toBeVisible();
});
