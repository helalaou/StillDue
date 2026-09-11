import {it,expect} from 'vitest';import {newDeadline} from '../src/domain/defaults';import {countdown,elapsed,checklistProgress} from '../src/domain/countdown';
const now=Date.parse('2026-01-01T00:00:00Z');
it('uses hours near a deadline and never shows negative time',()=>{const d={...newDeadline(),certainty:'confirmed' as const,dueAt:'2026-01-01T02:30:00Z'};expect(countdown(d,now).value).toBe('3');expect(countdown(d,now+86400000).value).toBe('0')});
it('labels uncertain and ongoing items rather than inventing countdowns',()=>{expect(countdown({...newDeadline(),certainty:'tba'},now).value).toBe('TBA');expect(countdown(newDeadline(),now).value).toBe('∞')});
it('keeps time progress independent from completed work',()=>{const d={...newDeadline(),startAt:'2025-12-31T00:00:00Z',dueAt:'2026-01-02T00:00:00Z',checklist:[{id:crypto.randomUUID(),text:'Draft',done:false}]};expect(elapsed(d,now)).toBe(50);expect(checklistProgress(d)).toBe(0)});
