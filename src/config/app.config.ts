export const appConfig = {
  name: 'StillDue',
  tagline: 'Keep it in view.',
  version: '0.1.0',
  defaultTimezone: 'UTC',
  urgency: { urgentDays: 7, warningDays: 21 },
  display: { refreshSeconds: 60, einkRefreshSeconds: 300, maxColumns: 4 },
  reminders: { defaultMinutes: [1440, 10080], maxPerDeadline: 5 },
  trash: { retentionDays: null as number | null },
  limits: { title: 160, notes: 10000, importRows: 1000, maxFileBytes: 2_000_000 },
  features: { googleLogin: true, teams: false, conferenceDiscovery: true },
  sources: {
    ccf: {
      name: 'CCF Deadlines',
      repository: 'ccfddl/ccf-deadlines',
      branch: 'main',
      field: 'computer-science',
    },
  },
} as const;
