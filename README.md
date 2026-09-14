<p align="center"><img src="public/brand/wordmark.svg" width="310" alt="StillDue" /></p>
<p align="center">Keep it in view.</p>

StillDue is a calm, customizable home for research deadlines and everyday commitments. It grew out of a simple page left open on a desk: a few large countdowns, a clear sense of priority, and less to hold in your head.

The app keeps that glanceable view while making it possible to edit from a phone, organize a project on a laptop, and leave a readable board on a tablet or browser-capable e-ink display. It is designed to reduce the effort of remembering, finding, and starting. Predictable layouts, visible next steps, reversible actions, and optional reminders are deliberate choices. StillDue makes no medical claims.

## What you can do

- Create private accounts with email and password; verification and password recovery are prepared for a production email provider.
- Organize deadlines into boards and projects. Add a next action, checklist, priority, tags, notes, and research details.
- Track confirmed dates, estimates, unannounced dates, or ongoing work. Keep personal targets separate from official deadlines.
- Search, filter, pin, save views, perform bulk actions, and switch between cards, lists, a calendar, and a smaller focus view.
- Use research and everyday templates, or create a reusable template of your own.
- Discover computer science conferences by field and subfield. Other fields support manual entry today.
- Choose light, dark, device-following, or monochrome themes; adjust text size, density, columns, visible details, and urgency thresholds.
- Open a large display view with fullscreen controls, an optional clock, keep-awake support, and a device-specific e-ink preset.
- Move deleted deadlines to Trash, undo the deletion, or restore them later.
- Export a JSON snapshot, CSV, or calendar file; preview CSV/JSON imports before adding anything.

The interface works on desktop, tablet, and mobile. An installable app shell provides offline access to previously loaded data. Cloud writes require a connection; unfinished forms are saved locally as drafts.

## The rules that matter

**Active is a view of what still needs attention.** A confirmed deadline becomes effectively inactive when its absolute due time passes. Its stored record remains available. The default view hides expired items; users can choose to keep overdue items visible. No open browser or precisely timed background job is needed to calculate expiry.

**Passing a deadline does not complete the work.** Completed is an explicit action. Manually inactive items stay inactive until reactivated. Restoring an item from Trash restores its previous state, then applies the current expiry rules. A restored past deadline may therefore appear in Inactive.

**Uncertainty stays visible.** Estimated and unannounced dates never silently expire as confirmed deadlines. Ongoing projects have no countdown. The conference catalog’s “confirmed” label means an exact date exists in the source record; it does not mean StillDue independently verified the official call for papers.

**Deletion is reversible until you make it permanent.** Trash retains records indefinitely by default. Emptying Trash, deleting a trashed item permanently, or deleting an account requires a clear confirmation. Emptying Trash includes all trashed records, regardless of current search filters.

**Time remaining is not work completed.** Countdown bars show elapsed time. Checklist percentages show completed steps. They are separate measures.

**Timezones are part of the deadline.** StillDue preserves an absolute instant and its source timezone. The interface can follow the device or display a fixed timezone without changing that instant. Anywhere on Earth is UTC−12. Date-only entries expire at 23:59:59 in their chosen timezone. Ambiguous or missing daylight-saving clock times require a different explicit entry; they are not silently guessed.

**Recurring items create new occurrences.** Weekly, monthly, and yearly schedules use their source timezone. The server creates the next future occurrence, resets its checklist, and keeps earlier occurrences in history. Missed intervals are skipped rather than flooding the board. Month-end dates clamp to the last valid day of the next month. Deactivated and trashed items do not generate new occurrences.

**Imports are additive.** Imported deadlines receive new IDs and go into the selected board. They do not overwrite existing deadlines or automatically reconstruct the exported board/project hierarchy. JSON exports preserve the full workspace for reference; CSV and calendar exports are snapshots, not live subscriptions.

## Research discovery

The first provider is [CCF Deadlines](https://github.com/ccfddl/ccf-deadlines), an MIT-licensed community dataset. A daily server job validates and caches its records in Supabase. Each entry includes its source, official website, original timezone, submission round, and last check time. Unknown or invalid source times remain unannounced rather than becoming fabricated dates.

The taxonomy supports computer science, engineering, life sciences, physical sciences, social sciences, humanities, and additional fields. Only computer science has an automated provider in this release. Other fields use manual entry with the same research metadata and timezone tools.

Importing a conference copies the selected round into your private workspace. It does not subscribe your personal date to automatic replacement. Changes to the source appear for review in Discover; you can accept the new date or keep your own. Always check the official call for papers before submitting.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for cloud accounts. The public key belongs in the browser; row-level database policies enforce access. Without cloud configuration, the explicitly labeled demo still works locally.

For a fresh backend, create a Supabase project and apply the migrations:

```sh
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Configure authentication redirect URLs for your deployment and local development URL. Use a production SMTP provider before enabling signup verification and password recovery. See [deployment setup](docs/deployment.md).

## Configuration

`src/config/app.config.ts` holds product defaults, feature flags, limits, display timings, and source configuration. Account preferences are stored in Supabase; the e-ink display override stays on the device. `.env.example` documents environment values, and `netlify.toml` defines hosting and schedules.

Secrets must never use the `VITE_` prefix, enter the repository, or appear in the client bundle. Keep the Supabase privileged key and any email-provider key server-side.

## Verify the app

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

With a disposable or newly created backend and the server environment loaded, the integration check creates two temporary users, verifies access isolation and database constraints, then removes only those test users:

```sh
node --env-file=.env.local --import tsx scripts/verify-security.ts
```

See [testing](docs/testing.md) for the cases and [architecture](docs/architecture.md) for the boundaries between the interface, database, and scheduled jobs.

## Deployment and current status

The frontend and scheduled functions run on Netlify. Supabase hosts authentication, PostgreSQL, and account-scoped live updates. The production deployment is [stilldue.netlify.app](https://stilldue.netlify.app).

**Email delivery is intentionally pending for the initial release.** Password login works for confirmed accounts; public signup verification, password resets, deadline emails, and weekly overviews require the owner to connect a sending provider. The UI reports this state rather than promising delivery. Scheduled email jobs remain inactive while provider credentials are absent.

Browser wake lock, fullscreen, installation, and e-ink behavior depend on the device. Vendor-specific e-ink appliances need a separate adapter. Large catalogs and large user bases may require pagination and worker-capacity changes; this is a personal-workspace release, not an enterprise service-level commitment.

## Contributing and license

The repository is private initially, with an open-source-ready structure. The code and original StillDue brand assets are licensed under [MIT](LICENSE). Third-party notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

Google login, shared lab permissions, native mobile apps, two-way calendar synchronization, and device-specific e-ink feeds are tracked in the [roadmap](docs/roadmap.md).

The initial commit timeline is reconstructed across one month at the project owner’s request. Commits represent actual source changes; their displayed dates are not a record of elapsed development time.
