# Verification

Domain tests cover AoE conversion, daylight-saving gaps and folds, date-only boundaries, local calendar grouping, expiry, manual inactivity, completion, trash/restore, recurrence, CSV/JSON validation, calendar escaping, spreadsheet formula safety, source provenance, filtering, and reminder quiet hours.

The browser suite runs on desktop and mobile Chromium. It exercises adding an item, preserving a draft, moving to Trash, restoring, completing, filtering, board creation, navigation, display locking, e-ink mode, and horizontal overflow checks. Use CUA or a real browser for visual review of typography, spacing, dark mode, and tablet behavior.

The live integration script creates two random disposable users with `example.invalid` addresses and confirmed test credentials. It asserts private reads and updates stay isolated, ownership cannot be spoofed, cross-account foreign keys fail, stale updates affect no rows, missing confirmed dates fail, anonymous private reads are empty, the public catalog is readable, and reminder claiming is unavailable to normal users. Cleanup removes only those test users.

Never point destructive test code at user-owned records. Run the integration check on a dedicated test project when the app has real users. Provider credentials are loaded from an ignored environment file and are not printed.

Email delivery tests require a configured provider and a controlled recipient. They are intentionally pending in the initial deployment. Device-specific e-ink checks require the actual hardware.
