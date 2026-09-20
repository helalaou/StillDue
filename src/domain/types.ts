export type Theme = 'system' | 'light' | 'dark' | 'eink';
export type Certainty = 'confirmed' | 'estimated' | 'tba' | 'ongoing';
export type Priority = 'low' | 'normal' | 'high';
export type Status = 'active' | 'inactive' | 'completed' | 'trash';
export type Recurrence = 'none' | 'weekly' | 'monthly' | 'yearly';
export interface Entity {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface Board extends Entity {
  name: string;
  color: string;
  description: string;
}
export interface Project extends Entity {
  name: string;
  boardId: string;
  description: string;
}
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}
export interface ResearchDetails {
  field: string;
  subfield: string;
  venue: string;
  year: string;
  track: string;
  role: string;
  pageLimit: string;
  submissionUrl: string;
  sourceUrl: string;
  sourceId: string;
  sourceDueAt: string | null;
}
export interface Deadline extends Entity {
  title: string;
  boardId: string | null;
  projectId: string | null;
  dueAt: string | null;
  targetAt: string | null;
  timezone: string;
  dateOnly: boolean;
  certainty: Certainty;
  status: Status;
  previousStatus: Status | null;
  deletedAt: string | null;
  completedAt: string | null;
  priority: Priority;
  pinned: boolean;
  focus: boolean;
  notes: string;
  nextAction: string;
  tags: string[];
  checklist: ChecklistItem[];
  research: ResearchDetails;
  recurrence: Recurrence;
  recurrenceRoot: string | null;
  reminderMinutes: number[];
  startAt: string;
  kind: string;
}
export interface Preferences {
  name: string;
  language: import('../i18n/locales').LanguagePreference;
  theme: Theme;
  timezone: string;
  followDevice: boolean;
  hour24: boolean;
  hideExpired: boolean;
  fontScale: number;
  density: 'comfortable' | 'compact';
  columns: number;
  countdown: 'days' | 'detailed';
  urgentDays: number;
  warningDays: number;
  displayRefresh: number;
  showClock: boolean;
  showNotes: boolean;
  showProgress: boolean;
  accent: string;
  quietStart: string;
  quietEnd: string;
  emailReminders: boolean;
  weeklyDigest: boolean;
  focusLimit: number;
  savedViews: SavedView[];
}
export interface SavedView {
  name: string;
  boardId: string;
  search: string;
  priority: string;
}
export interface TemplateStep {
  title: string;
  daysBefore: number;
  nextAction: string;
}
export interface Template extends Entity {
  name: string;
  description: string;
  kind: string;
  steps: TemplateStep[];
  isSystem?: boolean;
}
export interface Conference {
  id: string;
  title: string;
  name: string;
  field: string;
  subfield: string;
  year: number;
  round: string;
  dueAt: string | null;
  abstractAt: string | null;
  timezone: string;
  place: string;
  eventDate: string;
  url: string;
  sourceUrl: string;
  sourceName: string;
  checkedAt: string;
  certainty: Certainty;
}
export interface Workspace {
  boards: Board[];
  projects: Project[];
  deadlines: Deadline[];
  templates: Template[];
  preferences: Preferences;
  profileVersion: number;
}
