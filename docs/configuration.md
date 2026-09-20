# Configuration reference

`src/config/app.config.ts` contains branding, the product version, feature flags, urgency defaults, display intervals, reminder defaults, import limits, and conference source metadata. Change product defaults there, then keep preference defaults aligned in `src/domain/defaults.ts`.

`.env.example` separates public build variables from server secrets. `VITE_` means a value is embedded into browser assets. Never put a database password, privileged Supabase key, SMTP password, or email API key under that prefix.

Account preferences include theme, timezone, device-following display, clock format, expiry visibility, text size, card density, maximum columns, countdown granularity, urgency thresholds, display refresh, visible fields, accent, quiet hours, reminder/digest opt-in, focus limit, and saved views. Countdown granularity ranges from the adaptive day/hour view to a live `54d 06h 46m 47s` view; the latter refreshes visible countdowns once per second. Settings are saved explicitly; the preview does not commit them.

The e-ink display override is device-local. Normal account settings sync. The demo has separate preferences and does not modify a real account.

`netlify.toml` holds deployment output, Node version, function schedules, the SPA fallback, and security headers. Supabase migrations are authoritative for schema and access rules. `supabase/config.toml` is the reproducible auth/local-service configuration.
