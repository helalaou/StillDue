import { authenticatedUser, json } from '../lib/auth';
export default async function (request: Request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const { user, client } = await authenticatedUser(request);
    const body = await request.json();
    if (body.confirmation !== 'DELETE MY ACCOUNT')
      return json({ error: 'Explicit deletion confirmation is required.' }, 400);
    const signedAt = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : 0;
    if (Date.now() - signedAt > 5 * 60000)
      return json({ error: 'Please sign in again before deleting your account.' }, 403);
    const { error } = await client.auth.admin.deleteUser(user.id);
    if (error) throw error;
    return json({ deleted: true });
  } catch (e) {
    return json(
      {
        error:
          (e as Error).message === 'Unauthorized'
            ? 'Sign in to delete your account.'
            : 'Account deletion could not be completed.',
      },
      (e as Error).message === 'Unauthorized' ? 401 : 500,
    );
  }
}
