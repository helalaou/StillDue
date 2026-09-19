import { adminClient } from '../lib/admin';
import { json } from '../lib/auth';
import { nextOccurrence } from '../../src/domain/recurrence';
import { fromRow, toRow } from '../../src/lib/rows';
import type { Deadline } from '../../src/domain/types';
export default async function () {
  const db = adminClient();
  const { data, error } = await db
    .from('deadlines')
    .select('*')
    .neq('recurrence', 'none')
    .in('status', ['active', 'completed'])
    .is('recurrence_advanced_at', null)
    .lt('due_at', new Date().toISOString())
    .limit(200);
  if (error) throw error;
  let advanced = 0;
  for (const row of data || []) {
    const next = nextOccurrence(fromRow<Deadline>(row));
    if (!next) continue;
    const { error } = await db.from('deadlines').insert({ ...toRow(next), user_id: row.user_id });
    if (error && error.code !== '23505') continue;
    await db
      .from('deadlines')
      .update({ recurrence_advanced_at: new Date().toISOString() })
      .eq('id', row.id)
      .eq('version', row.version);
    advanced++;
  }
  return json({ advanced });
}
