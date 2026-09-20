import type { AppLanguage } from './locales';

let currentLanguage: AppLanguage = 'en';

export const getCurrentLanguage = () => currentLanguage;
export const setCurrentLanguage = (language: AppLanguage) => {
  currentLanguage = language;
};
