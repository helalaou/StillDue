import type { Deadline, Preferences } from './types';
import { effectiveStatus } from './lifecycle';
export interface Filters {
  status: string;
  search: string;
  boardId: string;
  priority: string;
  focus?: boolean;
  sort?: string;
}
export function filterDeadlines(
  items: Deadline[],
  prefs: Preferences,
  f: Filters,
  now = Date.now(),
) {
  const q = f.search.trim().toLowerCase();
  return items
    .filter(
      (d) =>
        effectiveStatus(d, prefs, now) === f.status &&
        (!f.boardId || d.boardId === f.boardId) &&
        (!f.priority || d.priority === f.priority) &&
        (!f.focus || d.focus) &&
        (!q ||
          [d.title, d.notes, d.nextAction, d.research.venue, ...d.tags]
            .join(' ')
            .toLowerCase()
            .includes(q)),
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (f.sort === 'title') return a.title.localeCompare(b.title);
      if (f.sort === 'priority') {
        const r = { high: 0, normal: 1, low: 2 };
        if (r[a.priority] !== r[b.priority]) return r[a.priority] - r[b.priority];
      }
      return (
        (a.dueAt ? Date.parse(a.dueAt) : Infinity) - (b.dueAt ? Date.parse(b.dueAt) : Infinity)
      );
    });
}
