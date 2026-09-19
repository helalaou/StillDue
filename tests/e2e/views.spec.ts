import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';
test('filters the workspace and creates a board', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('textbox', { name: 'Search deadlines' }).fill('Fellowship');
  await expect(
    page.getByRole('button', { name: 'Fellowship application', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Full paper submission', exact: true }),
  ).toHaveCount(0);
  await navigate(page, 'My boards');
  await page.getByRole('button', { name: 'New board' }).click();
  await page.getByLabel('Name', { exact: true }).fill('A browser test board');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A browser test board' })).toBeVisible();
});
test('opens calendar, focus, templates and conference fields', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Calendar');
  await expect(page.getByRole('heading', { name: 'A little perspective.' })).toBeVisible();
  await navigate(page, 'Focus');
  await expect(page.getByRole('heading', { name: 'One thing at a time.' })).toBeVisible();
  await navigate(page, 'Templates');
  await expect(page.getByRole('heading', { name: 'Conference paper', exact: true })).toBeVisible();
  await navigate(page, 'Discover conferences');
  await page.getByLabel('1. Field').selectOption('life-sciences');
  await expect(page.getByRole('heading', { name: 'There’s room for every field.' })).toBeVisible();
});
