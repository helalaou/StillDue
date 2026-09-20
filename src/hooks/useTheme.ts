import { useEffect } from 'react';
import type { Preferences } from '../domain/types';
import { cardFontStack } from '../config/cardFonts';
export function useTheme(p: Preferences) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function apply() {
      document.documentElement.dataset.theme =
        p.theme === 'system' ? (media.matches ? 'dark' : 'light') : p.theme;
      document.documentElement.style.setProperty('--font-scale', String(p.fontScale));
      document.documentElement.style.setProperty('--card-font-family', cardFontStack(p.cardFont));
      document.documentElement.dataset.density = p.density;
      document.documentElement.style.setProperty('--card-columns', String(p.columns));
      if (document.documentElement.dataset.theme === 'light')
        document.documentElement.style.setProperty('--accent', p.accent);
      else document.documentElement.style.removeProperty('--accent');
    }
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [p.theme, p.fontScale, p.cardFont, p.density, p.columns, p.accent]);
}
