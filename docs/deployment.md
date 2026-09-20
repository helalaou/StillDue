# Deploying StillDue

1. Create a Supabase project. Apply every migration in `supabase/migrations` in order with `supabase db push`.
2. Set the authentication site URL to the Netlify URL. Add `/auth` redirect URLs for production and local development. Require email confirmation and a minimum 12-character password.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Netlify’s build environment. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` for functions. The latter key must never be public.
4. Build using Node 24, `npm ci`, and `npm run build`. Publish `dist`. Deploy functions from `netlify/functions`; keep the headers, SPA fallback, and schedules in `netlify.toml`.
5. Run the conference sync once, then confirm the scheduled refresh is registered. Schedules execute on production deployments, not ordinary branch previews.
6. Inspect the public site, sign-in flow, account isolation, and function results. Keep production and preview data separate if previews will be shared with contributors.

## Google login

Create a Google OAuth client with the Web application type. Use `https://stilldue.netlify.app` as an authorized JavaScript origin and use the Supabase callback URL shown on the project’s Google provider page as the authorized redirect URI. For this deployment it is `https://nsxdptmlqhzdzlrowfzy.supabase.co/auth/v1/callback`. Do not use the Netlify `/auth` page as Google’s redirect URI; Supabase receives Google’s response first, then returns the user to the app.

Add the client ID and secret to Authentication → Providers → Google in Supabase. The app’s `/auth` URL is already in the Supabase redirect allow list. Test a new Google account and a returning account in production. Only after both succeed, set `GOOGLE_LOGIN_READY=true` in Netlify and redeploy so the button becomes available.

For local Supabase development, fill `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`, then enable `[auth.external.google]` in `supabase/config.toml`. Keep the secret in an ignored local environment file.

## Email, intentionally pending initially

Use a sending domain you control. Configure its DNS and verify the domain with your provider. Supabase requires SMTP credentials for authentication emails. Deadline reminders use Resend’s API separately; SMTP configuration alone does not enable those reminders.

Set `RESEND_API_KEY`, `EMAIL_FROM`, and `APP_URL` for the reminder functions. Only after real delivery has been verified, set `AUTH_EMAIL_READY=true` for the UI to enable signup and password-reset submission. Never set it merely to hide the pending message. Test signup confirmation and password recovery as an end user before inviting people.

The service-status function reports readiness booleans only. It never sends credentials to the browser. Without provider credentials, email jobs exit without sending. User opt-in preferences can be saved beforehand.

## Updating

GitHub CI checks types, lint, domain tests, a production build, and desktop/mobile browser flows. A Netlify deploy can use the Netlify Git integration or an authorized local CLI deployment. No account-wide deploy token is checked into this repository.

Rebuild after changing public environment variables. Function environment changes also need a fresh deployment. Review database migrations before applying them to an established project. Take a provider-supported backup before destructive schema work.
