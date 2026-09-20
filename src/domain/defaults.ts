import { appConfig } from '../config/app.config';
import type { Deadline, Preferences, ResearchDetails, Workspace } from './types';
export const detectTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
export const emptyResearch = (): ResearchDetails => ({
  field: '',
  subfield: '',
  venue: '',
  year: '',
  track: '',
  role: '',
  pageLimit: '',
  submissionUrl: '',
  sourceUrl: '',
  sourceId: '',
  sourceDueAt: null,
});
export const entity = () => ({
  id: crypto.randomUUID(),
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
export function defaultPreferences(): Preferences {
  return {
    name: '',
    language: 'auto',
    theme: 'system',
    cardFont: 'system',
    timezone: detectTimezone(),
    followDevice: true,
    hour24: false,
    hideExpired: true,
    urgencyColors: true,
    fontScale: 1,
    density: 'comfortable',
    columns: 3,
    countdown: 'days',
    urgentDays: appConfig.urgency.urgentDays,
    warningDays: appConfig.urgency.warningDays,
    displayRefresh: appConfig.display.refreshSeconds,
    showClock: true,
    showNotes: true,
    showProgress: true,
    accent: '#245447',
    quietStart: '22:00',
    quietEnd: '08:00',
    emailReminders: false,
    weeklyDigest: false,
    focusLimit: 3,
    savedViews: [],
  };
}
export function newDeadline(boardId: string | null = null): Deadline {
  return {
    ...entity(),
    title: '',
    boardId,
    projectId: null,
    dueAt: null,
    targetAt: null,
    timezone: detectTimezone(),
    dateOnly: false,
    certainty: 'ongoing',
    status: 'active',
    previousStatus: null,
    deletedAt: null,
    completedAt: null,
    priority: 'normal',
    pinned: false,
    focus: false,
    notes: '',
    nextAction: '',
    tags: [],
    checklist: [],
    research: emptyResearch(),
    recurrence: 'none',
    recurrenceRoot: null,
    reminderMinutes: [],
    startAt: new Date().toISOString(),
    kind: 'Deadline',
  };
}
export function newScheduledDeadline(boardId: string | null = null): Deadline {
  return { ...newDeadline(boardId), certainty: 'confirmed' };
}
export function emptyWorkspace(): Workspace {
  return {
    boards: [],
    projects: [],
    deadlines: [],
    templates: [],
    preferences: defaultPreferences(),
    profileVersion: 1,
  };
}
