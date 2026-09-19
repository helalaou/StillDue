import type { Deadline } from './types';
export function countdown(d: Deadline, now = Date.now()) {
  if (d.certainty === 'tba') return { value: 'TBA', label: 'date to be announced', days: Infinity };
  if (!d.dueAt) return { value: '∞', label: 'room to keep going', days: Infinity };
  const ms = Date.parse(d.dueAt) - now;
  const days = Math.ceil(ms / 86400000);
  if (d.certainty === 'estimated')
    return { value: '~' + Math.max(0, days), label: 'days · estimated', days };
  if (ms <= 0) return { value: '0', label: 'deadline passed', days: 0 };
  if (ms < 86400000) return { value: String(Math.ceil(ms / 3600000)), label: 'hours to go', days };
  return { value: String(days).padStart(2, '0'), label: 'days to go', days };
}
export function detailedRemaining(d: Deadline, now = Date.now()) {
  if (!d.dueAt || d.certainty !== 'confirmed') return '';
  let m = Math.max(0, Math.floor((Date.parse(d.dueAt) - now) / 60000));
  const days = Math.floor(m / 1440);
  m %= 1440;
  return `${days}d ${Math.floor(m / 60)}h ${m % 60}m`;
}
export function elapsed(d: Deadline, now = Date.now()) {
  if (!d.dueAt) return 0;
  const start = Date.parse(d.startAt),
    end = Date.parse(d.dueAt);
  if (end <= start) return now >= end ? 100 : 0;
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}
export function checklistProgress(d: Deadline) {
  return d.checklist.length
    ? Math.round((d.checklist.filter((x) => x.done).length / d.checklist.length) * 100)
    : 0;
}
