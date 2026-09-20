import { useServiceStatus } from '../hooks/useServiceStatus';
import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Monitor, Focus, Leaf, FlaskConical } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { TimezoneSelect } from '../components/TimezoneSelect';
import { DataSettings } from '../components/DataSettings';
import { AccountSettings } from '../components/AccountSettings';
import { DeadlineCard } from '../components/DeadlineCard';
import { newDeadline } from '../domain/defaults';
import { validZone } from '../domain/time';
import type { Preferences } from '../domain/types';
import { applyLanguage } from '../i18n';
import { supportedLanguages, type LanguagePreference } from '../i18n/locales';
import { cardFonts, cardFontStack } from '../config/cardFonts';
import {
  accentForTheme,
  accentSoftForTheme,
  resolveTheme,
  themeAccents,
} from '../config/themeAccents';
export function SettingsPage() {
  const { data, setPreferences, saving } = useWorkspace(),
    toast = useToast();
  const service = useServiceStatus();
  const { t } = useTranslation();
  const [p, setP] = useState<Preferences>(data.preferences);
  const previewTheme = resolveTheme(
    p.theme,
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const update = (v: Partial<Preferences>) => setP((x) => ({ ...x, ...v }));
  const sample = {
    ...newDeadline(),
    title: 'Your next good idea',
    kind: 'Research',
    certainty: 'confirmed' as const,
    dueAt: new Date(Date.now() + 12 * 86400000).toISOString(),
    nextAction: 'Start with one small, possible step.',
  };
  const presets = [
    {
      name: 'Research',
      icon: FlaskConical,
      values: { columns: 3, showNotes: true, showProgress: true, countdown: 'days' },
    },
    {
      name: 'Minimal',
      icon: Leaf,
      values: { columns: 3, showNotes: false, showProgress: false, countdown: 'days' },
    },
    {
      name: 'Focus',
      icon: Focus,
      values: { columns: 2, fontScale: 1.1, showNotes: true, focusLimit: 3 },
    },
    {
      name: 'Wall display',
      icon: Monitor,
      values: { columns: 3, fontScale: 1.15, showNotes: true, showClock: true, displayRefresh: 60 },
    },
    {
      name: 'E-ink',
      icon: Monitor,
      values: { theme: 'eink', countdown: 'days', displayRefresh: 300, showProgress: false },
    },
  ];
  async function save() {
    if (!validZone(p.timezone)) {
      toast('Choose a valid timezone.', true);
      return;
    }
    if (p.urgentDays > p.warningDays) {
      toast('The urgent threshold must be shorter than the upcoming threshold.', true);
      return;
    }
    if (await setPreferences(p)) toast(t('Settings saved across your devices.'));
  }
  return (
    <div className="page settings-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE YOURSELF AT HOME</div>
          <h1>{t('Your space. Your pace.')}</h1>
          <p>Keep what helps. Quiet everything else.</p>
        </div>
        <button className="button primary" disabled={saving} onClick={() => void save()}>
          <Check size={18} />
          {saving ? t('Saving…') : t('Save settings')}
        </button>
      </div>
      <section className="settings-section" id="language">
        <div>
          <h2>{t('Language & region')}</h2>
          <p>
            {t(
              'Use your device language automatically or choose the language saved with your account.',
            )}
          </p>
        </div>
        <div className="settings-content">
          <label className="field">
            {t('Language')}
            <select
              data-testid="language-select"
              value={p.language}
              onChange={(event) => {
                const language = event.target.value as LanguagePreference;
                update({ language });
                void applyLanguage(language);
              }}
            >
              {supportedLanguages.map((language) => (
                <option
                  value={language.code}
                  key={language.code}
                  lang={language.code === 'auto' ? undefined : language.code}
                  dir={language.dir}
                >
                  {language.code === 'auto'
                    ? t('Use device language')
                    : `${language.nativeName} · ${language.name}`}
                </option>
              ))}
            </select>
          </label>
          <p className="field-help">
            {t('Dates, times, navigation, and common actions use this language.')}
          </p>
        </div>
      </section>
      <section className="settings-section">
        <div>
          <h2>A good starting point</h2>
          <p>Try a preset, then make it yours. Changes apply when you save.</p>
        </div>
        <div className="settings-content">
          <div className="preset-buttons">
            {presets.map((s) => (
              <button key={s.name} onClick={() => update(s.values as Partial<Preferences>)}>
                <s.icon size={20} />
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="settings-section">
        <div>
          <h2>Look & feel</h2>
          <p>A comfortable view on the screen you use most.</p>
        </div>
        <div className="settings-content">
          <div className="form-grid">
            <label className="field">
              Theme
              <select
                data-testid="theme-select"
                value={p.theme}
                onChange={(e) => update({ theme: e.target.value as Preferences['theme'] })}
              >
                <option value="system">Follow device</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="eink">Monochrome / E-ink</option>
              </select>
            </label>
            <label className="field accent-field">
              Accent
              <select
                data-testid="accent-select"
                value={p.accent}
                onChange={(e) => update({ accent: e.target.value })}
              >
                {themeAccents.map((accent) => (
                  <option value={accent.value} key={accent.value}>
                    {accent.name}
                  </option>
                ))}
              </select>
              <span className="accent-help">
                <span
                  className="accent-swatch"
                  data-testid="accent-swatch"
                  style={{ background: accentForTheme(p.accent, previewTheme) }}
                />
                {previewTheme === 'eink'
                  ? 'E-ink stays monochrome'
                  : `${themeAccents.find((accent) => accent.value === p.accent)?.name ?? 'Forest'} preview`}
              </span>
            </label>
            <label className="field">
              Text size · {Math.round(p.fontScale * 100)}%
              <input
                type="range"
                min="1"
                max="1.5"
                step="0.05"
                value={p.fontScale}
                onChange={(e) => update({ fontScale: Number(e.target.value) })}
              />
            </label>
            <label className="field">
              Card typeface
              <select
                data-testid="card-font-select"
                value={p.cardFont}
                onChange={(e) => update({ cardFont: e.target.value as Preferences['cardFont'] })}
              >
                {cardFonts.map((font) => (
                  <option value={font.id} key={font.id}>
                    {font.name} · {font.note}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Card spacing
              <select
                value={p.density}
                onChange={(e) => update({ density: e.target.value as Preferences['density'] })}
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </label>
            <label className="field">
              Maximum columns
              <select
                value={p.columns}
                onChange={(e) => update({ columns: Number(e.target.value) })}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option value={n} key={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Countdown detail
              <select
                value={p.countdown}
                onChange={(e) => update({ countdown: e.target.value as Preferences['countdown'] })}
              >
                <option value="days">Days (hours when close)</option>
                <option value="detailed">Days, hours & minutes</option>
              </select>
            </label>
          </div>
          <div className="check-row">
            <label className="check-field">
              <input
                type="checkbox"
                checked={p.showNotes}
                onChange={(e) => update({ showNotes: e.target.checked })}
              />
              Show next steps
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={p.showProgress}
                onChange={(e) => update({ showProgress: e.target.checked })}
              />
              Show time elapsed
            </label>
          </div>
          <div
            className="settings-preview"
            data-theme={previewTheme}
            style={
              {
                fontSize: p.fontScale + 'rem',
                '--card-font-family': cardFontStack(p.cardFont),
                '--accent': accentForTheme(p.accent, previewTheme),
                '--accent-soft': accentSoftForTheme(p.accent, previewTheme),
              } as CSSProperties
            }
          >
            <DeadlineCard item={sample} prefs={p} now={Date.now()} onOpen={() => {}} display />
          </div>
        </div>
      </section>
      <section className="settings-section">
        <div>
          <h2>Time & attention</h2>
          <p>Make the deadlines fit how you think about time.</p>
        </div>
        <div className="settings-content">
          <label className="check-field">
            <input
              type="checkbox"
              checked={p.followDevice}
              onChange={(e) => update({ followDevice: e.target.checked })}
            />
            Follow this device’s timezone
          </label>
          <TimezoneSelect
            label="Fixed timezone (used when device detection is off)"
            value={p.timezone}
            onChange={(v) => update({ timezone: v })}
          />
          <div className="check-row">
            <label className="check-field">
              <input
                type="checkbox"
                checked={p.hour24}
                onChange={(e) => update({ hour24: e.target.checked })}
              />
              24-hour clock
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={p.hideExpired}
                onChange={(e) => update({ hideExpired: e.target.checked })}
              />
              Hide deadlines after they pass
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                data-testid="urgency-colors-toggle"
                checked={p.urgencyColors}
                onChange={(e) => update({ urgencyColors: e.target.checked })}
              />
              Use urgency colors
            </label>
          </div>
          <div className="urgency-legend" aria-label="Urgency color guide">
            <span className="later">Comfortably ahead</span>
            <span className="upcoming">Approaching</span>
            <span className="urgent">Urgent</span>
          </div>
          <div className="form-grid">
            <label className="field">
              Urgent within (days)
              <input
                type="number"
                min="0"
                max="365"
                value={p.urgentDays}
                onChange={(e) => update({ urgentDays: Math.max(0, Number(e.target.value)) })}
              />
            </label>
            <label className="field">
              Upcoming within (days)
              <input
                type="number"
                min="0"
                max="365"
                value={p.warningDays}
                onChange={(e) => update({ warningDays: Math.max(0, Number(e.target.value)) })}
              />
            </label>
            <label className="field">
              Focus view limit
              <select
                value={p.focusLimit}
                onChange={(e) => update({ focusLimit: Number(e.target.value) })}
              >
                {[1, 2, 3, 5, 8].map((n) => (
                  <option value={n} key={n}>
                    {n} priorities
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Display refresh
              <select
                value={p.displayRefresh}
                onChange={(e) => update({ displayRefresh: Number(e.target.value) })}
              >
                <option value="30">Every 30 seconds</option>
                <option value="60">Every minute</option>
                <option value="300">Every 5 minutes</option>
                <option value="900">Every 15 minutes</option>
              </select>
            </label>
          </div>
          <label className="check-field">
            <input
              type="checkbox"
              checked={p.showClock}
              onChange={(e) => update({ showClock: e.target.checked })}
            />
            Show clock in display mode
          </label>
        </div>
      </section>
      <section className="settings-section">
        <div>
          <h2>Gentle reminders</h2>
          <p>Choose the timing on each deadline. Quiet hours use your fixed account timezone.</p>
        </div>
        <div className="settings-content">
          {!service.data?.emailReminders && (
            <div className="email-pending">
              Email delivery is not enabled in this installation yet. You can save your preferences
              now; emails will begin only after the owner connects a sending provider.
            </div>
          )}
          <label className="check-field">
            <input
              type="checkbox"
              checked={p.emailReminders}
              onChange={(e) => update({ emailReminders: e.target.checked })}
            />
            Enable deadline reminders when email is available
          </label>
          <label className="check-field">
            <input
              type="checkbox"
              checked={p.weeklyDigest}
              onChange={(e) => update({ weeklyDigest: e.target.checked })}
            />
            Monday morning overview
          </label>
          <div className="form-grid">
            <label className="field">
              Quiet hours start
              <input
                type="time"
                value={p.quietStart}
                onChange={(e) => update({ quietStart: e.target.value })}
              />
            </label>
            <label className="field">
              Quiet hours end
              <input
                type="time"
                value={p.quietEnd}
                onChange={(e) => update({ quietEnd: e.target.value })}
              />
            </label>
          </div>
        </div>
      </section>
      <section className="settings-section">
        <div>
          <h2>Your profile & saved views</h2>
          <p>A name for your workspace, and shortcuts you can tidy up.</p>
        </div>
        <div className="settings-content">
          <label className="field">
            Your name
            <input
              maxLength={100}
              value={p.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </label>
          {p.savedViews.map((v, i) => (
            <div className="saved-view-row" key={i}>
              <span>{v.name}</span>
              <button
                className="text-button danger-text"
                onClick={() => update({ savedViews: p.savedViews.filter((_, j) => j !== i) })}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
      <div className="settings-save">
        <button className="button primary" disabled={saving} onClick={() => void save()}>
          {t('Save settings')}
        </button>
      </div>
      <DataSettings />
      <AccountSettings />
    </div>
  );
}
