import { useEffect } from 'react';
import { applyLanguage } from '../i18n';
import type { LanguagePreference } from '../i18n/locales';

export function useLocale(language: LanguagePreference) {
  useEffect(() => {
    void applyLanguage(language);
  }, [language]);
}
