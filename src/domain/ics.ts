import type { Deadline } from './types';
const slash = String.fromCharCode(92),
  newline = String.fromCharCode(10),
  crlf = String.fromCharCode(13, 10);
const escape = (s: string) =>
  s
    .replaceAll(slash, slash + slash)
    .replaceAll(newline, slash + 'n')
    .replaceAll(',', slash + ',')
    .replaceAll(';', slash + ';');
const stamp = (s: string) =>
  new Date(s).toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0] + 'Z';
export function exportIcs(items: Deadline[]) {
  const rows = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StillDue//Deadlines//EN',
    'CALSCALE:GREGORIAN',
  ];
  for (const d of items) {
    if (!d.dueAt || d.status === 'trash') continue;
    rows.push(
      'BEGIN:VEVENT',
      `UID:${d.id}@stilldue`,
      `DTSTAMP:${stamp(d.updatedAt)}`,
      `DTSTART:${stamp(d.dueAt)}`,
      `SUMMARY:${escape(d.title)}`,
      `DESCRIPTION:${escape([d.nextAction, d.notes, 'Source timezone: ' + d.timezone, d.certainty === 'estimated' ? 'ESTIMATED DATE' : ''].filter(Boolean).join(newline))}`,
      'END:VEVENT',
    );
  }
  rows.push('END:VCALENDAR');
  return rows.join(crlf) + crlf;
}
