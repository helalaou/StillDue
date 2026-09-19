import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { newDeadline } from '../src/domain/defaults';
import { toRow } from '../src/lib/rows';
const url = process.env.SUPABASE_URL!,
  secret = process.env.SUPABASE_SECRET_KEY!,
  key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
if (!url || !secret || !key)
  throw new Error('Load the local environment before running integration checks.');
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ids: string[] = [];
let checks = 0;
try {
  const users = [];
  for (let i = 0; i < 2; i++) {
    const email = 'stilldue-test-' + randomUUID() + '@example.invalid',
      password = randomUUID() + randomUUID();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'Disposable integration test' },
    });
    assert.ifError(error);
    ids.push(data.user!.id);
    const client = createClient(url, key, { auth: { persistSession: false } });
    const result = await client.auth.signInWithPassword({ email, password });
    assert.ifError(result.error);
    users.push({ client, id: data.user!.id });
  }
  const [a, b] = users;
  const { data: boards, error: boardError } = await a.client.from('boards').select('*');
  assert.ifError(boardError);
  assert.equal(boards!.length, 2);
  checks++;
  const deadline = { ...newDeadline(boards![0].id), title: 'Private integration test' };
  const inserted = await a.client.from('deadlines').insert(toRow(deadline)).select().single();
  assert.ifError(inserted.error);
  checks++;
  const otherRead = await b.client.from('deadlines').select('*').eq('id', deadline.id);
  assert.ifError(otherRead.error);
  assert.equal(otherRead.data!.length, 0);
  checks++;
  const otherWrite = await b.client
    .from('deadlines')
    .update({ title: 'Unauthorized' })
    .eq('id', deadline.id)
    .select();
  assert.ifError(otherWrite.error);
  assert.equal(otherWrite.data!.length, 0);
  checks++;
  const spoof = await b.client
    .from('deadlines')
    .insert({ ...toRow({ ...newDeadline(), title: 'Spoofed' }), user_id: a.id });
  assert.ok(spoof.error);
  checks++;
  const crossBoard = await b.client
    .from('deadlines')
    .insert(toRow({ ...newDeadline(boards![0].id), title: 'Cross-account reference' }));
  assert.ok(crossBoard.error);
  checks++;
  const updated = await a.client
    .from('deadlines')
    .update({ title: 'Updated safely' })
    .eq('id', deadline.id)
    .eq('version', 1)
    .select()
    .single();
  assert.ifError(updated.error);
  assert.equal(updated.data.version, 2);
  checks++;
  const stale = await a.client
    .from('deadlines')
    .update({ title: 'Stale overwrite' })
    .eq('id', deadline.id)
    .eq('version', 1)
    .select();
  assert.equal(stale.data!.length, 0);
  checks++;
  const badDate = await a.client
    .from('deadlines')
    .insert(toRow({ ...newDeadline(), title: 'Missing date', certainty: 'confirmed' }));
  assert.ok(badDate.error);
  checks++;
  const anon = createClient(url, key, { auth: { persistSession: false } });
  assert.equal((await anon.from('deadlines').select('*')).data?.length, 0);
  checks++;
  const catalog = await anon.from('conferences').select('id').limit(1);
  assert.ifError(catalog.error);
  assert.ok(catalog.data!.length);
  checks++;
  const forbiddenJob = await b.client.rpc('claim_reminders', { batch_size: 1 });
  assert.ok(forbiddenJob.error);
  checks++;
  console.log(`${checks} live account-isolation and integrity checks passed.`);
} finally {
  for (const id of ids) {
    const result = await admin.auth.admin.deleteUser(id);
    if (result.error) {
      console.error('Could not remove disposable test account ' + id);
      process.exitCode = 1;
    }
  }
}
