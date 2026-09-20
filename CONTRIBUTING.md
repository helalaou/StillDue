# Contributing

StillDue begins as a personal project with an open-source-ready structure. Keep changes focused on making deadlines easier to see, manage, and act on.

Pull requests are welcome. Before writing a large feature, open an issue that explains the problem, who it helps, and the smallest useful version. Small fixes and documentation improvements can go directly to a focused branch. When the repository becomes public, fork it and open a pull request against `main`; invited collaborators can use a branch in the repository.

Use Node 24, install with `npm ci`, and work on a small branch. Use fictional examples. Never commit unpublished research, account data, local environment files, or credentials.

Before proposing a change, run type checks, lint, relevant domain tests, and the production build. Run browser tests for changed user journeys. Explain the user-visible problem, the resulting behavior, and the verification in your pull request.

Keep each pull request reviewable. Include screenshots for visible interface changes, note keyboard and responsive behavior, add a migration for database changes, and link the issue when one exists. A maintainer may ask to narrow a change when it mixes unrelated ideas.

Database changes belong in new migrations; do not edit migrations already applied to a shared environment. Every private table needs ownership rules. New source adapters must include attribution, date-uncertainty handling, and tests for malformed data.

Keep copy plain and specific. Preserve keyboard access, readable type, mobile layouts, and monochrome meaning. Prefer a small coherent addition over introducing a new framework or dependency without a clear need.
