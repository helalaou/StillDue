type AccountIdentity = {
  provider?: string;
};

type AccountUser = {
  email?: string | null;
  app_metadata?: {
    provider?: unknown;
    providers?: unknown;
  };
  identities?: AccountIdentity[] | null;
};

export function usesGoogleSignIn(user: AccountUser): boolean {
  const metadataProviders = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers.filter(
        (provider): provider is string => typeof provider === 'string',
      )
    : [];
  const providers = [
    typeof user.app_metadata?.provider === 'string' ? user.app_metadata.provider : '',
    ...metadataProviders,
    ...(user.identities ?? []).map((identity) => identity.provider ?? ''),
  ];
  return providers.includes('google');
}

export function matchesAccountEmail(user: AccountUser, value: unknown): boolean {
  return (
    typeof value === 'string' &&
    typeof user.email === 'string' &&
    value.trim().toLocaleLowerCase() === user.email.trim().toLocaleLowerCase()
  );
}
