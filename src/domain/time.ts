import { Temporal } from '@js-temporal/polyfill';
export function normalizeZone(zone: string) {
  return zone === 'AoE' ? '-12:00' : zone;
}
export function validZone(zone: string) {
  try {
    Temporal.Now.zonedDateTimeISO(normalizeZone(zone));
    return true;
  } catch {
    return false;
  }
}
export function localToInstant(value: string, zone: string, dateOnly = false) {
  if (!value) return null;
  const z = normalizeZone(zone);
  const dt = Temporal.PlainDateTime.from(dateOnly ? value.slice(0, 10) + 'T23:59:59' : value);
  return dt.toZonedDateTime(z, { disambiguation: 'reject' }).toInstant().toString();
}
export function instantToLocal(value: string | null, zone: string, dateOnly = false) {
  if (!value) return '';
  const z = Temporal.Instant.from(value).toZonedDateTimeISO(normalizeZone(zone));
  return dateOnly ? z.toPlainDate().toString() : z.toPlainDateTime().toString().slice(0, 16);
}
export function formatDate(value: string | null, zone: string, hour24 = false, dateOnly = false) {
  if (!value) return 'No date set';
  const z = Temporal.Instant.from(value).toZonedDateTimeISO(normalizeZone(zone));
  const date = z
    .toPlainDate()
    .toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric' });
  if (dateOnly) return date;
  const h = hour24 ? String(z.hour).padStart(2, '0') : String(z.hour % 12 || 12);
  return `${date} · ${h}:${String(z.minute).padStart(2, '0')}${hour24 ? '' : z.hour < 12 ? ' AM' : ' PM'}`;
}
export function dayKey(value: string, zone: string) {
  return Temporal.Instant.from(value)
    .toZonedDateTimeISO(normalizeZone(zone))
    .toPlainDate()
    .toString();
}
export function calendarDays(year: number, month: number) {
  const first = Temporal.PlainDate.from({ year, month, day: 1 });
  const start = first.subtract({ days: first.dayOfWeek % 7 });
  return Array.from({ length: 42 }, (_, i) => start.add({ days: i }).toString());
}
export function offsetDate(value: string, days: number, zone: string) {
  return Temporal.Instant.from(value)
    .toZonedDateTimeISO(normalizeZone(zone))
    .add({ days })
    .toInstant()
    .toString();
}
