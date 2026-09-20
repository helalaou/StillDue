import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Maximize, Minimize, Lock, Unlock, ArrowLeft, Settings2, Minus, Plus } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useClock } from '../hooks/useClock';
import { useWakeLock } from '../hooks/useWakeLock';
import { DeadlineCard } from '../components/DeadlineCard';
import { Brand } from '../components/Brand';
import { filterDeadlines } from '../domain/filter';
import { EmptyState } from '../components/EmptyState';
import { appConfig } from '../config/app.config';

const DISPLAY_CARD_SCALE_KEY = 'stilldue:display:card-scale';
const cardScaleConfig = appConfig.display.cardScale;
const clampCardScale = (value: number) =>
  Math.min(cardScaleConfig.max, Math.max(cardScaleConfig.min, value));

export function DisplayPage() {
  const { i18n } = useTranslation();
  const { data, offline, lastSynced, refresh } = useWorkspace();
  const [locked, setLocked] = useState(false),
    [board, setBoard] = useState(''),
    [settings, setSettings] = useState(false),
    [eink, setEink] = useState(localStorage.getItem('stilldue:display:eink') === 'true'),
    [cardScale, setCardScale] = useState(() => {
      const saved = localStorage.getItem(DISPLAY_CARD_SCALE_KEY);
      if (saved === null) return cardScaleConfig.default;
      const stored = Number(saved);
      return Number.isFinite(stored) ? clampCardScale(stored) : cardScaleConfig.default;
    }),
    [awake, setAwake] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [page, setPage] = useState(0);
  const prefs = {
    ...data.preferences,
    ...(eink ? { theme: 'eink' as const, countdown: 'days' as const } : {}),
  };
  const now = useClock(eink ? 300 : prefs.countdown === 'seconds' ? 1 : prefs.displayRefresh),
    wakeStatus = useWakeLock(awake);
  const items = filterDeadlines(
    data.deadlines,
    prefs,
    { status: 'active', search: '', boardId: board, priority: '' },
    now,
  );
  const perPage = prefs.columns * 2;
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const zone = prefs.followDevice
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : prefs.timezone;
  useEffect(() => {
    const old = document.documentElement.dataset.theme;
    if (eink) document.documentElement.dataset.theme = 'eink';
    localStorage.setItem('stilldue:display:eink', String(eink));
    return () => {
      document.documentElement.dataset.theme = old;
    };
  }, [eink]);
  useEffect(() => {
    localStorage.setItem(DISPLAY_CARD_SCALE_KEY, String(cardScale));
  }, [cardScale]);
  useEffect(() => {
    const id = setInterval(refresh, (eink ? 300 : prefs.displayRefresh) * 1000);
    return () => clearInterval(id);
  }, [eink, prefs.displayRefresh]);
  useEffect(() => {
    const fn = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);
  useEffect(() => setPage(0), [board]);
  async function full() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      /* The browser's own fullscreen controls remain available. */
    }
  }
  function resizeCards(direction: -1 | 1) {
    setCardScale((current) =>
      clampCardScale(Number((current + direction * cardScaleConfig.step).toFixed(1))),
    );
  }
  return (
    <div className={'display-page ' + (eink ? 'eink-display' : '')}>
      <header className="display-header">
        <Brand />
        <div className="display-clock">
          {prefs.showClock && (
            <>
              <strong>
                {new Date(now).toLocaleTimeString(i18n.resolvedLanguage, {
                  timeZone: zone,
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: !prefs.hour24,
                })}
              </strong>
              <span>
                {new Date(now).toLocaleDateString(i18n.resolvedLanguage, {
                  timeZone: zone,
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </div>
        <div className="display-controls">
          {!locked && (
            <>
              <Link to="/" className="icon-button" aria-label="Back to workspace">
                <ArrowLeft size={22} />
              </Link>
              <button
                className="icon-button"
                aria-label="Display settings"
                onClick={() => setSettings(!settings)}
              >
                <Settings2 size={21} />
              </button>
              <button
                className="icon-button"
                aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                onClick={() => void full()}
              >
                {fullscreen ? <Minimize size={21} /> : <Maximize size={21} />}
              </button>
            </>
          )}
          <button
            className="icon-button"
            aria-label={locked ? 'Unlock display controls' : 'Lock display controls'}
            onClick={() => {
              setLocked(!locked);
              setSettings(false);
            }}
          >
            {locked ? <Lock size={20} /> : <Unlock size={20} />}
          </button>
        </div>
      </header>
      {settings && !locked && (
        <div className="display-settings">
          <label className="field">
            Board
            <select value={board} onChange={(e) => setBoard(e.target.value)}>
              <option value="">All boards</option>
              {data.boards.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="check-field">
            <input type="checkbox" checked={eink} onChange={(e) => setEink(e.target.checked)} />
            E-ink preset on this device
          </label>
          <div className="display-size-setting">
            <div className="display-size-heading">
              <span>Card size</span>
              <output htmlFor="display-card-size">{Math.round(cardScale * 100)}%</output>
            </div>
            <div className="display-size-control">
              <button
                className="icon-button"
                aria-label="Make cards smaller"
                disabled={cardScale <= cardScaleConfig.min}
                onClick={() => resizeCards(-1)}
              >
                <Minus size={18} />
              </button>
              <input
                id="display-card-size"
                aria-label="Card size"
                type="range"
                min={cardScaleConfig.min}
                max={cardScaleConfig.max}
                step={cardScaleConfig.step}
                value={cardScale}
                onChange={(event) => setCardScale(clampCardScale(Number(event.target.value)))}
              />
              <button
                className="icon-button"
                aria-label="Make cards larger"
                disabled={cardScale >= cardScaleConfig.max}
                onClick={() => resizeCards(1)}
              >
                <Plus size={18} />
              </button>
            </div>
            <small>Saved on this device</small>
          </div>
          <label className="check-field">
            <input type="checkbox" checked={awake} onChange={(e) => setAwake(e.target.checked)} />
            Keep screen awake
          </label>
          {wakeStatus && <span className="fine-print">{wakeStatus}</span>}
        </div>
      )}
      <div className="display-title">
        <span className="eyebrow">
          {data.boards.find((b) => b.id === board)?.name || 'IN VIEW'}
        </span>
        <span>
          {items.length} active · {zone.split('/').pop()?.replaceAll('_', ' ')}
        </span>
      </div>
      {items.length ? (
        <div
          className="deadline-grid display-grid"
          style={
            {
              '--display-columns': prefs.columns,
              '--display-card-scale': cardScale,
            } as React.CSSProperties
          }
        >
          {items
            .slice(Math.min(page, pages - 1) * perPage, (Math.min(page, pages - 1) + 1) * perPage)
            .map((d) => (
              <DeadlineCard
                key={d.id}
                item={d}
                board={data.boards.find((b) => b.id === d.boardId)}
                project={data.projects.find((p) => p.id === d.projectId)}
                prefs={prefs}
                now={now}
                onOpen={() => {}}
                display
              />
            ))}
        </div>
      ) : (
        <EmptyState
          title="A little room to breathe."
          description="Your active deadlines will appear here. Add them from any signed-in device."
        />
      )}
      <footer className="display-footer">
        <span>
          {offline
            ? 'Offline · Last saved view'
            : lastSynced
              ? 'Last synced ' +
                new Date(lastSynced).toLocaleTimeString('en', {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : 'Waiting for sync'}
          {eink ? ' · E-ink · 5-minute updates' : ''}
        </span>
        {pages > 1 && (
          <div className="inline-actions">
            <button
              className="text-button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              {Math.min(page + 1, pages)} / {pages}
            </span>
            <button
              className="text-button"
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
        <span>One thing at a time.</span>
      </footer>
    </div>
  );
}
