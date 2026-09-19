import { it, expect } from 'vitest';
import { parseConferenceYaml, sourceTimezone } from '../netlify/lib/conference-parser';
const yaml = `- title: TEST
  description: Fictional conference
  sub: HI
  confs:
    - year: 2027
      id: test27
      link: https://example.org/cfp
      timezone: AoE
      timeline:
        - deadline: '2026-10-05 23:59:59'
          comment: Full papers
        - deadline: TBD
          comment: Posters
`;
it('preserves source provenance and distinct rounds', () => {
  const rows = parseConferenceYaml(yaml, 'conference/HI/test.yml', '2026-09-20T00:00:00Z');
  expect(rows).toHaveLength(2);
  expect(rows[0].dueAt).toBe('2026-10-06T11:59:59Z');
  expect(rows[0].sourceUrl).toContain('conference/HI/test.yml');
  expect(rows[1].dueAt).toBeNull();
  expect(rows[1].certainty).toBe('tba');
});
it('normalizes fixed offsets without confusing them with DST zones', () => {
  expect(sourceTimezone('UTC-8')).toBe('-08:00');
  expect(sourceTimezone('UTC+5.5')).toBe('+05:30');
  expect(sourceTimezone('PT')).toBe('America/Los_Angeles');
});
it('keeps stable round identities when a date changes', () =>
  expect(parseConferenceYaml(yaml, 'x', '2026-09-20T00:00:00Z')[0].id).toBe(
    parseConferenceYaml(yaml.replace('2026-10-05', '2026-10-12'), 'x', '2026-09-20T00:00:00Z')[0]
      .id,
  ));
it('does not accept unsafe official links', () =>
  expect(
    parseConferenceYaml(
      yaml.replace('https://example.org/cfp', 'javascript:alert(1)'),
      'x',
      '2026-09-20T00:00:00Z',
    ),
  ).toEqual([]));
