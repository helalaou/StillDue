import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Layers,
  CalendarDays,
  Compass,
  Files,
  Monitor,
  Settings2,
  Archive,
  CheckCircle2,
  Trash2,
  Menu,
  X,
  LogOut,
  Cloud,
  CloudOff,
  Focus,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Brand } from './Brand';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../lib/errors';
const mainLinks = [
  ['/', 'Overview', LayoutGrid],
  ['/boards', 'My boards', Layers],
  ['/calendar', 'Calendar', CalendarDays],
  ['/focus', 'Focus', Focus],
] as const;
export function Layout() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { data, saving, offline, lastSynced, setPreferences } = useWorkspace();
  const { demo, signOut } = useAuth();
  const toast = useToast(),
    navigate = useNavigate();
  const prefs = data.preferences;
  const zone = prefs.followDevice
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : prefs.timezone;
  async function leave() {
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      toast(errorMessage(e), true);
    }
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {t('Skip to content')}
      </a>
      {open && (
        <button
          className="sidebar-scrim"
          aria-label={t('Close navigation')}
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={'sidebar ' + (open ? 'is-open' : '')}>
        <Link to="/" className="brand-link" onClick={() => setOpen(false)}>
          <Brand />
        </Link>
        <button
          className="workspace-switch"
          onClick={() => {
            navigate('/boards');
            setOpen(false);
          }}
        >
          {t('Personal workspace')} <ChevronDown size={16} />
        </button>
        <nav aria-label={t('Main navigation')}>
          {mainLinks.map(([to, label, Icon]) => (
            <NavLink
              end={to === '/'}
              to={to}
              key={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => 'nav-item ' + (isActive ? 'selected' : '')}
            >
              <Icon size={19} />
              {t(label)}
            </NavLink>
          ))}
          <span className="nav-label">{t('PLAN WHAT’S NEXT')}</span>
          {[
            ['/discover', 'Discover conferences', Compass],
            ['/templates', 'Templates', Files],
          ].map(([to, label, Icon]) => {
            const I = Icon as typeof Files;
            return (
              <NavLink
                to={String(to)}
                key={String(to)}
                onClick={() => setOpen(false)}
                className={({ isActive }) => 'nav-item ' + (isActive ? 'selected' : '')}
              >
                <I size={19} />
                {t(String(label))}
              </NavLink>
            );
          })}
          <div className="nav-history">
            {[
              ['/inactive', 'Inactive', Archive],
              ['/completed', 'Completed', CheckCircle2],
              ['/trash', 'Trash', Trash2],
            ].map(([to, label, Icon]) => {
              const I = Icon as typeof Files;
              return (
                <NavLink
                  to={String(to)}
                  key={String(to)}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => 'nav-item small ' + (isActive ? 'selected' : '')}
                >
                  <I size={17} />
                  {t(String(label))}
                </NavLink>
              );
            })}
          </div>
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/display" className="nav-item">
            <Monitor size={19} />
            {t('Display mode')}
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setOpen(false)}
            className={({ isActive }) => 'nav-item ' + (isActive ? 'selected' : '')}
          >
            <Settings2 size={19} />
            {t('Settings')}
          </NavLink>
          <div className="profile">
            <span className="avatar">{(prefs.name || 'S').slice(0, 1).toUpperCase()}</span>
            <div>
              {prefs.name || t('My workspace')}
              <small>{demo ? t('Demo workspace') : t('Personal workspace')}</small>
            </div>
            <button
              className="icon-button"
              aria-label={demo ? t('Leave demo') : t('Sign out')}
              onClick={leave}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      <main className="main" id="main-content">
        <header className="topbar">
          <div className="topbar-start">
            <button
              className="icon-button mobile-menu"
              aria-label={open ? t('Close navigation') : t('Open navigation')}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span>
              {t('Workspace')} <span className="breadcrumb">/ {t('Personal')}</span>
            </span>
          </div>
          <div className="top-actions">
            <span
              className="sync-state"
              title={
                lastSynced
                  ? t('Last synced') +
                    ' ' +
                    new Date(lastSynced).toLocaleTimeString(i18n.resolvedLanguage)
                  : undefined
              }
            >
              {offline ? <CloudOff size={16} /> : <Cloud size={16} />}
              <span>
                {demo
                  ? t('Demo · this browser')
                  : offline
                    ? t('Offline')
                    : saving
                      ? t('Saving…')
                      : t('Synced')}
              </span>
            </span>
            <button
              className="icon-button"
              title={t('Switch light and dark theme')}
              aria-label={t('Switch light and dark theme')}
              onClick={() =>
                void setPreferences({
                  ...prefs,
                  theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark',
                })
              }
            >
              {document.documentElement.dataset.theme === 'dark' ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>
            <span className="timezone">{zone?.split('/').pop()?.replaceAll('_', ' ')}</span>
          </div>
        </header>
        {demo && (
          <div className="demo-bar">
            {t('You’re exploring a demo. Changes stay in this browser.')}
            <button onClick={leave}>
              {t('Sign in to sync')} <span aria-hidden>↗</span>
            </button>
          </div>
        )}
        {offline && (
          <div className="offline-bar" role="status">
            {t('Offline view · Showing your last saved workspace. Reconnect to save changes.')}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
