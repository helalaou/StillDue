import { it, expect } from 'vitest';
import { newDeadline, defaultPreferences } from '../src/domain/defaults';
import { effectiveStatus, trash, restore, complete, reactivate } from '../src/domain/lifecycle';
const prefs = defaultPreferences(),
  now = Date.parse('2026-10-01T00:00:00Z');
const deadline = () => ({
  ...newDeadline(),
  title: 'Paper',
  certainty: 'confirmed' as const,
  dueAt: '2026-09-30T23:59:59Z',
});
it('hides expired confirmed deadlines without marking them completed', () => {
  const d = deadline();
  expect(effectiveStatus(d, prefs, now)).toBe('inactive');
  expect(d.status).toBe('active');
  expect(d.completedAt).toBeNull();
});
it('supports the explicit overdue-visibility preference', () =>
  expect(effectiveStatus(deadline(), { hideExpired: false }, now)).toBe('active'));
it('does not auto-hide estimates or ongoing work', () => {
  expect(effectiveStatus({ ...deadline(), certainty: 'estimated' }, prefs, now)).toBe('active');
  expect(effectiveStatus(newDeadline(), prefs, now)).toBe('active');
});
it('restores completed items to their prior state', () => {
  const d = complete(deadline());
  expect(restore(trash(d)).status).toBe('completed');
  expect(restore(trash(d)).deletedAt).toBeNull();
});
it('does not reactivate manually inactive items just because their date moves', () =>
  expect(
    effectiveStatus(
      { ...deadline(), status: 'inactive', dueAt: '2050-01-01T00:00:00Z' },
      prefs,
      now,
    ),
  ).toBe('inactive'));
it('keeps trash hidden and re-evaluates restored past deadlines', () => {
  const d = trash(deadline());
  expect(effectiveStatus(d, prefs, now)).toBe('trash');
  expect(effectiveStatus(restore(d), prefs, now)).toBe('inactive');
  expect(reactivate(complete(d)).completedAt).toBeNull();
});
