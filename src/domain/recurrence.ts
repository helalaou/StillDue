import { Temporal } from '@js-temporal/polyfill';
import type { Deadline } from './types';
import { normalizeZone } from './time';
import { entity } from './defaults';
export function nextOccurrence(d: Deadline, now = Date.now()): Deadline | null {
  if (
    d.recurrence === 'none' ||
    !d.dueAt ||
    d.certainty !== 'confirmed' ||
    d.status === 'trash' ||
    d.status === 'inactive'
  )
    return null;
  const original = Temporal.Instant.from(d.dueAt).toZonedDateTimeISO(normalizeZone(d.timezone));
  const duration =
    d.recurrence === 'weekly'
      ? { weeks: 1 }
      : d.recurrence === 'monthly'
        ? { months: 1 }
        : { years: 1 };
  let next = original.add(duration);
  let count = 0;
  while (next.epochMilliseconds <= now && count++ < 10000) next = next.add(duration);
  if (count >= 10000) throw new Error('Recurrence is too far in the past.');
  return {
    ...d,
    ...entity(),
    dueAt: next.toInstant().toString(),
    targetAt: null,
    status: 'active',
    completedAt: null,
    previousStatus: null,
    deletedAt: null,
    recurrenceRoot: d.recurrenceRoot || d.id,
    checklist: d.checklist.map((c) => ({ ...c, done: false })),
    startAt: new Date().toISOString(),
  };
}
