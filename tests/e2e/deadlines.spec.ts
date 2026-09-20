import { test, expect } from '@playwright/test';
import { enterDemo, navigate } from './helpers';
test('create, edit, complete and restore a deadline', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('button', { name: 'New deadline', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('Browser test deadline');
  await page.getByLabel('Due date').fill('2030-10-10');
  await page.getByLabel('Exact time').fill('14:35');
  await page.getByRole('tab', { name: 'Next steps' }).click();
  await page.getByLabel('Your next small step').fill('Write one paragraph');
  await page.getByRole('button', { name: 'Add deadline', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Browser test deadline', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open Browser test deadline', exact: true }).click();
  await expect(page.getByText('Write one paragraph', { exact: true }).last()).toBeVisible();
  await page.getByRole('button', { name: 'Move to Trash', exact: true }).click();
  await navigate(page, 'Trash');
  await page.getByRole('button', { name: 'Open Browser test deadline' }).click();
  await page.getByRole('button', { name: 'Restore', exact: true }).click();
  await navigate(page, 'Overview');
  await page.getByRole('button', { name: 'Open Browser test deadline' }).click();
  await page.getByRole('button', { name: 'Mark done', exact: true }).last().click();
  await expect(
    page.locator('.toast').filter({ hasText: 'Marked complete' }).getByRole('button', {
      name: 'Undo',
      exact: true,
    }),
  ).toBeVisible();
  await navigate(page, 'Completed');
  await expect(
    page.getByRole('button', { name: 'Browser test deadline', exact: true }),
  ).toBeVisible();
});
test('undoes a completion from the six-second action notice', async ({ page }) => {
  await enterDemo(page);
  const card = page.getByRole('article').filter({ hasText: 'Fellowship application' });
  await card.getByRole('button', { name: 'Mark done', exact: true }).click();

  await expect(card).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(
    page.getByRole('article').filter({ hasText: 'Fellowship application' }),
  ).toBeVisible();
});
test('unfinished new drafts survive closing the editor', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('button', { name: 'New deadline', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('A draft to recover');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'New deadline', exact: true }).click();
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue('A draft to recover');
});
test('adds an exact date and time to a manually created research deadline', async ({ page }) => {
  await enterDemo(page);
  await navigate(page, 'Discover conferences');
  await page.getByRole('button', { name: 'Add manually' }).click();
  const dialog = page.getByRole('dialog', { name: 'A new thing to keep in view' });

  await expect(dialog.getByRole('group', { name: 'Deadline timing' })).toBeVisible();
  await dialog.getByLabel('Title', { exact: true }).fill('Exact research deadline');
  await dialog.getByLabel('Due date').fill('2031-04-18');
  await dialog.getByLabel('Exact time').fill('16:45');
  await dialog.getByRole('tab', { name: 'Research details' }).click();
  await expect(dialog.getByLabel('Exact time')).toHaveValue('16:45');
  await dialog.getByLabel('Conference or venue').fill('Test Conference');
  await dialog.getByRole('button', { name: 'Add deadline', exact: true }).click();

  await navigate(page, 'Overview');
  await page.getByRole('button', { name: 'Open Exact research deadline' }).click();
  await expect(page.getByText(/Apr 18, 2031 · 4:45 PM/).first()).toBeVisible();
});
