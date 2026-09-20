export const supportedLanguages = [
  { code: 'auto', name: 'Use device language', nativeName: 'Automatic', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
] as const;

export type LanguagePreference = (typeof supportedLanguages)[number]['code'];
export type AppLanguage = Exclude<LanguagePreference, 'auto'>;

const codes = new Set(supportedLanguages.map((language) => language.code));

export function isLanguagePreference(value: unknown): value is LanguagePreference {
  return typeof value === 'string' && codes.has(value as LanguagePreference);
}

export function resolveLanguage(preference: LanguagePreference = 'auto'): AppLanguage {
  if (preference !== 'auto') return preference;
  if (typeof navigator === 'undefined') return 'en';
  for (const candidate of navigator.languages || [navigator.language]) {
    const base = candidate.toLowerCase().split('-')[0];
    if (codes.has(base as LanguagePreference) && base !== 'auto') return base as AppLanguage;
  }
  return 'en';
}

export function languageDirection(language: AppLanguage) {
  return supportedLanguages.find((item) => item.code === language)?.dir || 'ltr';
}
