# Architecture

StillDue is a React/TypeScript client built with Vite. React Router owns navigation; TanStack Query owns remote snapshots and invalidation. CSS is separated by product area and shared design variables. The domain modules contain date conversion, lifecycle rules, recurrence, filtering, validation, and portable file formats without depending on React.

The browser talks directly to Supabase using a public client key and an authenticated session. Every private table has row-level security. Ownership is enforced in the database, including composite foreign keys that prevent referencing another account’s board or project. A project must belong to the same board as its deadline.

Record versions increment in PostgreSQL. Updates include the version the editor read. A zero-row update is a conflict, not success. Realtime events invalidate account-specific queries. The editor preserves a conflicting draft and asks the person to load the latest record before trying again.

Tables: profiles, boards, projects, deadlines, templates, conferences, catalog_runs, and reminders. Nested checklists and research metadata use JSON; core fields used for filtering, integrity, and scheduling use columns. User preferences are a profile JSON object so UI options can evolve without unnecessary schema churn.

Netlify Functions hold privileged keys. Authenticated account deletion verifies the bearer token and a recent sign-in. Scheduled functions refresh public conference data, claim reminder jobs, advance recurring records, and prepare weekly digests. User-facing expiry is derived from time and never depends on those jobs.

The demo uses a separate browser-local store. It never silently replaces a failed cloud connection. Offline caches are keyed by account and removed on logout. Only application assets enter the service-worker cache; authenticated API responses do not.
