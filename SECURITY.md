# Security

Please report a suspected vulnerability privately to the repository owner through GitHub’s private vulnerability reporting feature when available. Do not publish live account data or credentials in an issue.

Include the affected route or function, reproduction steps with test data, and the expected access boundary. An issue that lets one account read or modify another account’s records is especially important.

Private tables use Supabase row-level security. Privileged credentials are limited to Netlify Functions and local administrative scripts. Browser-visible keys require those database policies and are not substitutes for authentication.

Account deletion verifies the user’s token and recent sign-in. User notes render as text, URLs are limited to HTTP(S), and email content is escaped. Dependency checks run in CI.

A display lock hides controls; it is not a security lock. Offline data remains in browser storage until logout. See `docs/privacy.md` for the storage and deletion boundaries.
