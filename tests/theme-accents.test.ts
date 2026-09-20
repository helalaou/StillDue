import { describe, expect, it } from 'vitest';
import { accentForTheme, accentSoftForTheme, resolveTheme } from '../src/config/themeAccents';

describe('theme accents', () => {
  it('resolves the system theme from the device preference', () => {
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('system', true)).toBe('dark');
  });

  it('uses a visible variant of every accent in dark mode', () => {
    expect(accentForTheme('#3d5480', 'light')).toBe('#3d5480');
    expect(accentForTheme('#3d5480', 'dark')).toBe('#b7c9f2');
  });

  it('keeps e-ink monochrome and derives matching soft colors elsewhere', () => {
    expect(accentForTheme('#6a4b78', 'eink')).toBe('#000000');
    expect(accentSoftForTheme('#6a4b78', 'eink')).toBe('#eeeeee');
    expect(accentSoftForTheme('#6a4b78', 'light')).toContain('#6a4b78');
  });

  it('falls back safely when an older preference contains an unknown accent', () => {
    expect(accentForTheme('invalid', 'light')).toBe('#245447');
  });
});
