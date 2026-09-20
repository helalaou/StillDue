# Data and privacy

Private account data stays in the owner’s Supabase project and is accessible through account-level policies. Public conference records are separate from private deadlines. StillDue does not include advertising, tracking pixels, or an analytics SDK.

An account stores profile preferences, boards, projects, deadlines, checklist content, templates, and reminder job metadata. Password handling belongs to Supabase Auth; the app does not store plaintext passwords. Google login receives the account identifier, email address, name, and avatar metadata needed for authentication; StillDue does not request access to Google Drive, Calendar, contacts, or mail. User notes are rendered as text, never injected as HTML.

For offline viewing, a signed-in device caches its last workspace snapshot in local storage. Drafts are also stored there. This is device-local storage, not encrypted personal vault storage. Logout clears that account’s workspace cache and drafts. Use an appropriate device account on shared hardware.

Demo data uses a distinct local key and is fictional. Reset demo removes its edits. The demo does not sync into a real account.

Deleting an account removes its active application records through cascading database references. Infrastructure backups and logs follow the hosting providers’ retention rules. The app cannot promise instant removal from provider backups. Exporting creates a local file under the user’s control.

The initial deployment has email delivery disabled. Enabling reminders sends opted-in deadline titles and times to the configured email provider and the user’s account address.
