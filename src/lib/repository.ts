import { supabase } from './supabase';
import { fromRow, toRow } from './rows';
import { ConflictError } from './errors';
import { defaultPreferences } from '../domain/defaults';
import type { Workspace, Entity, Preferences } from '../domain/types';
export async function fetchWorkspace(): Promise<Workspace> {
  if (!supabase) throw new Error('Cloud connection is not configured.');
  const [boards, projects, deadlines, templates, profile] = await Promise.all(
    ['boards', 'projects', 'deadlines', 'templates', 'profiles'].map((t) =>
      supabase!.from(t).select('*').limit(10000),
    ),
  );
  for (const result of [boards, projects, deadlines, templates, profile])
    if (result.error) throw result.error;
  const p = profile.data?.[0];
  return {
    boards: (boards.data || []).map(fromRow<Workspace['boards'][number]>),
    projects: (projects.data || []).map(fromRow<Workspace['projects'][number]>),
    deadlines: (deadlines.data || []).map(fromRow<Workspace['deadlines'][number]>),
    templates: (templates.data || []).map(fromRow<Workspace['templates'][number]>),
    preferences: {
      ...defaultPreferences(),
      ...p?.preferences,
      name: p?.name || p?.preferences?.name || '',
    },
    profileVersion: p?.version || 1,
  };
}
export async function saveEntity(table: string, value: Entity, isNew = false) {
  if (!supabase) throw new Error('Cloud connection is not configured.');
  const row = toRow(value);
  const query = isNew
    ? supabase.from(table).insert(row)
    : supabase.from(table).update(row).eq('id', value.id).eq('version', value.version);
  const { data, error } = await query.select().maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new ConflictError();
  return fromRow<Entity>(data);
}
export async function deleteEntity(table: string, id: string, version: number) {
  if (!supabase) throw new Error('Cloud connection is not configured.');
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('version', version)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data?.length) throw new ConflictError();
}
export async function savePreferences(userId: string, prefs: Preferences, version: number) {
  if (!supabase) throw new Error('Cloud connection is not configured.');
  const { data, error } = await supabase
    .from('profiles')
    .update({ name: prefs.name, preferences: prefs })
    .eq('id', userId)
    .eq('version', version)
    .select('version')
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new ConflictError();
  return data.version as number;
}
