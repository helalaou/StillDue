import { z } from 'zod';
import { validZone } from './time';
import { appConfig } from '../config/app.config';
import type { Deadline } from './types';
const safeUrl = z
  .string()
  .max(2048)
  .refine(
    (v) => !v || v.startsWith('https://') || v.startsWith('http://'),
    'Use an http or https link.',
  );
const timestamp = z.string().datetime({ offset: true });
const status = z.enum(['active', 'inactive', 'completed', 'trash']);
export const deadlineSchema = z
  .object({
    id: z.string().uuid(),
    version: z.number().int().positive(),
    createdAt: timestamp,
    updatedAt: timestamp,
    title: z.string().trim().min(1, 'Give this deadline a title.').max(appConfig.limits.title),
    boardId: z.string().uuid().nullable(),
    projectId: z.string().uuid().nullable(),
    timezone: z.string().refine(validZone, 'Choose a valid timezone.'),
    dateOnly: z.boolean(),
    notes: z.string().max(appConfig.limits.notes),
    nextAction: z.string().max(500),
    dueAt: timestamp.nullable(),
    targetAt: timestamp.nullable(),
    certainty: z.enum(['confirmed', 'estimated', 'tba', 'ongoing']),
    status,
    previousStatus: status.nullable(),
    deletedAt: timestamp.nullable(),
    completedAt: timestamp.nullable(),
    priority: z.enum(['low', 'normal', 'high']),
    pinned: z.boolean(),
    focus: z.boolean(),
    tags: z.array(z.string().max(80)).max(30),
    checklist: z
      .array(
        z.object({ id: z.string().uuid(), text: z.string().min(1).max(500), done: z.boolean() }),
      )
      .max(200),
    recurrence: z.enum(['none', 'weekly', 'monthly', 'yearly']),
    recurrenceRoot: z.string().uuid().nullable(),
    startAt: timestamp,
    kind: z.string().max(80),
    research: z.object({
      field: z.string().max(200),
      subfield: z.string().max(200),
      venue: z.string().max(300),
      year: z.string().max(20),
      track: z.string().max(300),
      role: z.string().max(200),
      pageLimit: z.string().max(100),
      submissionUrl: safeUrl,
      sourceUrl: safeUrl,
      sourceId: z.string().max(300),
      sourceDueAt: timestamp.nullable(),
    }),
    reminderMinutes: z.array(z.number().int().min(1).max(525600)).max(5),
  })
  .superRefine((d, ctx) => {
    if (['confirmed', 'estimated'].includes(d.certainty) && !d.dueAt)
      ctx.addIssue({
        code: 'custom',
        message: 'Add a date or choose an ongoing item.',
        path: ['dueAt'],
      });
    if (d.recurrence !== 'none' && d.certainty !== 'confirmed')
      ctx.addIssue({
        code: 'custom',
        message: 'Recurring items need a confirmed date.',
        path: ['recurrence'],
      });
    if (d.targetAt && d.dueAt && Date.parse(d.targetAt) > Date.parse(d.dueAt))
      ctx.addIssue({
        code: 'custom',
        message: 'A personal target must be before the official deadline.',
        path: ['targetAt'],
      });
    if ((d.status === 'trash') !== !!d.deletedAt)
      ctx.addIssue({
        code: 'custom',
        message: 'Trash state needs a deletion timestamp.',
        path: ['deletedAt'],
      });
  });
export function validateDeadline(value: unknown): Deadline {
  const result = deadlineSchema.safeParse(value);
  if (!result.success) throw new Error(result.error.issues[0].message);
  return result.data;
}
