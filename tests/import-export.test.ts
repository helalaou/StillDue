import { it, expect } from 'vitest';
import { newDeadline, emptyWorkspace } from '../src/domain/defaults';
import { parseImport, exportCsv, exportJson } from '../src/domain/import-export';
import { exportIcs } from '../src/domain/ics';
it('imports CSV with explicit timezone and quoted notes', () => {
  const rows = parseImport(
    'title,due_at,timezone,notes\nPaper,2026-12-01T23:00:00Z,UTC,"A, B"',
    'test.csv',
    null,
  );
  expect(rows[0].notes).toBe('A, B');
  expect(rows[0].certainty).toBe('confirmed');
});
it('gives imports new identities and strips ownership metadata', () => {
  const d = { ...newDeadline(), title: 'Paper', userId: crypto.randomUUID() };
  const copy = parseImport(JSON.stringify([d]), 'test.json', null)[0];
  expect(copy.id).not.toBe(d.id);
  expect('userId' in copy).toBe(false);
});
it('rejects malformed nested records and unsafe links', () => {
  const d = { ...newDeadline(), title: 'Paper' };
  expect(() =>
    parseImport(JSON.stringify([{ ...d, checklist: 'wrong' }]), 'x.json', null),
  ).toThrow();
  expect(() =>
    parseImport(
      JSON.stringify([{ ...d, research: { ...d.research, sourceUrl: 'javascript:alert(1)' } }]),
      'x.json',
      null,
    ),
  ).toThrow();
});
it('round trips an account export into new deadline records', () => {
  const w = emptyWorkspace();
  w.deadlines = [{ ...newDeadline(), title: 'Draft' }];
  expect(parseImport(exportJson(w), 'backup.json', null)[0].title).toBe('Draft');
});
it('protects spreadsheet consumers from formula injection', () =>
  expect(exportCsv([{ ...newDeadline(), title: '=SUM(1,1)' }])).toContain("'=SUM"));
it('escapes calendar text and excludes trash', () => {
  const d = {
    ...newDeadline(),
    title: 'Paper, draft; final',
    certainty: 'confirmed' as const,
    dueAt: '2026-10-01T12:00:00Z',
  };
  const ics = exportIcs([d, { ...d, id: crypto.randomUUID(), status: 'trash' }]);
  expect(ics.split('BEGIN:VEVENT')).toHaveLength(2);
  expect(ics).toContain('DTSTART:20261001T120000Z');
  expect(ics).toContain('Paper' + String.fromCharCode(92) + ', draft');
});
