# Localization

StillDue follows the device language by default. A user can choose a language under Settings → Language & region, preview the change immediately, and save it with the account or local demo. The selection sets the HTML `lang` attribute, switches the document direction for Arabic, and controls locale-aware dates, clock labels, and calendar headings.

The first language set covers English, Spanish, French, German, Portuguese, Italian, Dutch, Arabic, Simplified Chinese, Japanese, Korean, Hindi, Russian, and Turkish. English remains the explicit fallback so a missing translation never produces an empty control. Navigation, authentication, settings entry points, common deadline actions, and the primary deadline view have initial translations. Specialized research and data-management vocabulary should be reviewed by native speakers as coverage grows.

Locale metadata lives in `src/i18n/locales.ts`; message resources and fallback behavior live in `src/i18n/index.ts`. Use complete phrases as keys. Avoid building sentences from translated fragments because word order and plural rules vary. User-created board names, project names, tags, notes, conference titles, and deadline content are data and must never be translated automatically.

When adding or reviewing a language:

1. Use the language’s native name in the selector and a valid BCP 47 base code.
2. Translate meaning and tone rather than English word order. Keep calm language and short controls.
3. Check authentication, navigation, Settings, the main deadline board, calendar formatting, mobile width, and display mode.
4. For a right-to-left language, set its direction in the locale metadata and test the desktop sidebar, mobile drawer, forms, numbers, URLs, and mixed-direction user content.
5. Leave uncertain technical terminology in the English fallback and request native-speaker review instead of publishing a misleading translation.

The browser tests verify that a language persists and that Arabic changes the document to right-to-left without horizontal overflow. Translation review is still a human editorial task; passing a layout test does not certify linguistic quality.
