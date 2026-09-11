import {it,expect} from 'vitest';import {quietUntil} from '../netlify/lib/quiet-hours';
it('defers overnight reminders to the next local morning',()=>expect(quietUntil('2026-10-01T03:00:00Z','America/New_York','22:00','08:00')).toBe('2026-10-01T12:00:00Z'));
it('allows daytime delivery',()=>expect(quietUntil('2026-10-01T16:00:00Z','America/New_York','22:00','08:00')).toBeNull());
it('supports daytime quiet windows and disabled quiet hours',()=>{expect(quietUntil('2026-10-01T13:00:00Z','UTC','12:00','14:00')).toBe('2026-10-01T14:00:00Z');expect(quietUntil('2026-10-01T13:00:00Z','UTC','08:00','08:00')).toBeNull()});
