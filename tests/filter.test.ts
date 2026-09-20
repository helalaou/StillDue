import { it, expect } from 'vitest';
import { defaultPreferences, newDeadline } from '../src/domain/defaults';
import { filterDeadlines } from '../src/domain/filter';
const prefs = defaultPreferences(),
  f = { status: 'active', search: '', boardId: '', priority: '' };
it('searches next actions tags and venue names', () => {
  const d = {
    ...newDeadline(),
    title: 'Draft',
    nextAction: 'Review discussion',
    tags: ['accessibility'],
  };
  expect(filterDeadlines([d], prefs, { ...f, search: 'discussion' })).toHaveLength(1);
  expect(filterDeadlines([d], prefs, { ...f, search: 'accessibility' })).toHaveLength(1);
});
it('always keeps the closest dated item first and ongoing work last', () => {
  const a = { ...newDeadline(), title: 'Ongoing' },
    b = { ...newDeadline(), title: 'Later pinned', pinned: true, dueAt: '2050-02-01T00:00:00Z' },
    c = { ...newDeadline(), title: 'Closest', dueAt: '2050-01-01T00:00:00Z' };
  expect(filterDeadlines([a, b, c], prefs, f).map((d) => d.title)).toEqual([
    'Closest',
    'Later pinned',
    'Ongoing',
  ]);
});
it('combines focus and priority instead of ignoring one filter', () => {
  const d = { ...newDeadline(), focus: true, priority: 'high' as const };
  expect(filterDeadlines([d], prefs, { ...f, focus: true, priority: 'low' })).toEqual([]);
});
