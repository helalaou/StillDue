# Contributing

StillDue begins as a personal project with an open-source-ready structure. Keep changes focused on making deadlines easier to see, manage, and act on.

Use Node 24, install with `npm ci`, and work on a small branch. Use fictional examples. Never commit unpublished research, account data, local environment files, or credentials.

Before proposing a change, run type checks, lint, relevant domain tests, and the production build. Run browser tests for changed user journeys. Explain the user-visible problem, the resulting behavior, and the verification in your pull request.

Database changes belong in new migrations; do not edit migrations already applied to a shared environment. Every private table needs ownership rules. New source adapters must include attribution, date-uncertainty handling, and tests for malformed data.

Keep copy plain and specific. Preserve keyboard access, readable type, mobile layouts, and monochrome meaning. Prefer a small coherent addition over introducing a new framework or dependency without a clear need.
