import type { Deadline, Preferences } from './types';
import { effectiveStatus } from './lifecycle';
export interface Filters {
  status: string;
  search: string;
  boardId: string;
  priority: string;
  focus?: boolean;
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
      const due =
        (a.dueAt ? Date.parse(a.dueAt) : Infinity) - (b.dueAt ? Date.parse(b.dueAt) : Infinity);
      if (due) return due;
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
}
