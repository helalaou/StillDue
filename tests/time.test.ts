import { describe, it, expect } from 'vitest';
import {
  localToInstant,
  instantToLocal,
  validZone,
  dayKey,
  calendarDays,
} from '../src/domain/time';
describe('deadline time semantics', () => {
  it('converts AoE to an absolute instant', () =>
    expect(localToInstant('2026-10-05T23:59:59', 'AoE')).toBe('2026-10-06T11:59:59Z'));
  it('uses different New York offsets across daylight saving', () => {
    expect(localToInstant('2026-07-01T09:00', 'America/New_York')).toBe('2026-07-01T13:00:00Z');
    expect(localToInstant('2026-12-01T09:00', 'America/New_York')).toBe('2026-12-01T14:00:00Z');
  });
  it('rejects ambiguous and missing clock times', () => {
    expect(() => localToInstant('2026-11-01T01:30', 'America/New_York')).toThrow();
    expect(() => localToInstant('2026-03-08T02:30', 'America/New_York')).toThrow();
  });
  it('defines date-only deadlines at source-day end', () =>
    expect(localToInstant('2026-12-01', 'America/New_York', true)).toBe('2026-12-02T04:59:59Z'));
  it('round trips without changing the instant', () =>
    expect(instantToLocal('2026-10-06T11:59:59Z', 'America/New_York')).toBe('2026-10-06T07:59'));
  it('validates zones and groups UTC dates in local days', () => {
    expect(validZone('Mars/Base')).toBe(false);
    expect(dayKey('2026-01-01T01:00:00Z', 'America/New_York')).toBe('2025-12-31');
  });
  it('creates a complete six-week calendar grid', () => {
    const days = calendarDays(2026, 2);
    expect(days).toHaveLength(42);
    expect(days[0]).toBe('2026-02-01');
    expect(days[41]).toBe('2026-03-14');
  });
});
