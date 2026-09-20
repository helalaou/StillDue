import { expect, it } from 'vitest';
import { matchesAccountEmail, usesGoogleSignIn } from '../src/lib/account-auth';

it('recognizes Google identities without requiring a password provider', () => {
  expect(
    usesGoogleSignIn({
      email: 'person@example.com',
      app_metadata: { provider: 'google', providers: ['google'] },
      identities: [{ provider: 'google' }],
    }),
  ).toBe(true);
  expect(
    usesGoogleSignIn({
      email: 'person@example.com',
      app_metadata: { provider: 'email', providers: ['email'] },
      identities: [{ provider: 'email' }],
    }),
  ).toBe(false);
});

it('matches the account email without case or surrounding-space surprises', () => {
  const user = { email: 'Person@Example.com' };
  expect(matchesAccountEmail(user, ' person@example.COM ')).toBe(true);
  expect(matchesAccountEmail(user, 'other@example.com')).toBe(false);
  expect(matchesAccountEmail(user, undefined)).toBe(false);
});
