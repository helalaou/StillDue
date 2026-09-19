import type { Deadline, Preferences, Status } from './types';
export function isExpired(d: Deadline, now = Date.now()) {
  return d.certainty === 'confirmed' && d.dueAt !== null && Date.parse(d.dueAt) <= now;
}
export function effectiveStatus(
  d: Deadline,
  pick: Pick<Preferences, 'hideExpired'>,
  now = Date.now(),
): Status {
  if (d.status !== 'active') return d.status;
  return pick.hideExpired && isExpired(d, now) ? 'inactive' : 'active';
}
export function complete(d: Deadline): Deadline {
  return { ...d, status: 'completed', completedAt: new Date().toISOString() };
}
export function trash(d: Deadline): Deadline {
  return { ...d, previousStatus: d.status, status: 'trash', deletedAt: new Date().toISOString() };
}
export function restore(d: Deadline): Deadline {
  return {
    ...d,
    status: d.previousStatus && d.previousStatus !== 'trash' ? d.previousStatus : 'active',
    deletedAt: null,
    previousStatus: null,
  };
}
export function reactivate(d: Deadline): Deadline {
  return { ...d, status: 'active', completedAt: null, deletedAt: null, previousStatus: null };
}
