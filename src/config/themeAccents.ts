import type { Theme } from '../domain/types';

export const themeAccents = [
  { name: 'Forest', value: '#245447', dark: '#b2d5b6' },
  { name: 'Blue', value: '#3d5480', dark: '#b7c9f2' },
  { name: 'Plum', value: '#6a4b78', dark: '#d8b9e4' },
  { name: 'Earth', value: '#785435', dark: '#e2bd97' },
] as const;

export type ResolvedTheme = Exclude<Theme, 'system'>;

export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  return theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
}

export function accentForTheme(accent: string, theme: ResolvedTheme) {
  if (theme === 'eink') return '#000000';
  const palette = themeAccents.find((option) => option.value === accent) ?? themeAccents[0];
  return theme === 'dark' ? palette.dark : palette.value;
}

export function accentSoftForTheme(accent: string, theme: ResolvedTheme) {
  if (theme === 'eink') return '#eeeeee';
  const surface = theme === 'dark' ? '#1c2823' : '#ffffff';
  return `color-mix(in srgb, ${accentForTheme(accent, theme)} 14%, ${surface})`;
}
