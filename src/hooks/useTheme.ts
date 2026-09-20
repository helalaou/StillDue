import { useEffect } from 'react';
import type { Preferences } from '../domain/types';
import { cardFontStack } from '../config/cardFonts';
import { accentForTheme, accentSoftForTheme, resolveTheme } from '../config/themeAccents';
export function useTheme(p: Preferences) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function apply() {
      const theme = resolveTheme(p.theme, media.matches);
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.setProperty('--font-scale', String(p.fontScale));
      document.documentElement.style.setProperty('--card-font-family', cardFontStack(p.cardFont));
      document.documentElement.dataset.density = p.density;
      document.documentElement.style.setProperty('--card-columns', String(p.columns));
      document.documentElement.style.setProperty('--accent', accentForTheme(p.accent, theme));
      document.documentElement.style.setProperty(
        '--accent-soft',
        accentSoftForTheme(p.accent, theme),
      );
    }
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [p.theme, p.fontScale, p.cardFont, p.density, p.columns, p.accent]);
}
