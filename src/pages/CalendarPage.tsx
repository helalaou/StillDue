import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { calendarDays, dayKey } from '../domain/time';
import { newDeadline } from '../domain/defaults';
import { DeadlineEditor } from '../components/DeadlineEditor';
import { DeadlineDetail } from '../components/DeadlineDetail';
import type { Deadline } from '../domain/types';
export function CalendarPage() {
  const { t, i18n } = useTranslation();
  const { data } = useWorkspace();
  const [month, setMonth] = useState(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ),
    [editor, setEditor] = useState<Deadline | null>(null),
    [detail, setDetail] = useState<Deadline | null>(null);
  const zone = data.preferences.followDevice
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : data.preferences.timezone;
  const days = calendarDays(month.getFullYear(), month.getMonth() + 1),
    today = dayKey(new Date().toISOString(), zone);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">THE BIGGER PICTURE</div>
          <h1>A little perspective.</h1>
          <p>See what’s gathering on the horizon.</p>
        </div>
        <button
          className="button primary"
          onClick={() => setEditor(newDeadline(data.boards[0]?.id || null))}
        >
          <Plus size={18} />
          {t('New deadline')}
        </button>
      </div>
      <div className="section-toolbar">
        <h2>
          {month.toLocaleDateString(i18n.resolvedLanguage, { month: 'long', year: 'numeric' })}
        </h2>
        <div className="inline-actions">
          <button
            className="icon-button"
            aria-label="Previous month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="button secondary"
            onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
          >
            Today
          </button>
          <button
            className="icon-button"
            aria-label="Next month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="calendar-scroll">
        <div className="calendar-grid">
          {Array.from({ length: 7 }, (_, index) =>
            new Intl.DateTimeFormat(i18n.resolvedLanguage, { weekday: 'short' }).format(
              new Date(Date.UTC(2024, 0, 7 + index)),
            ),
          ).map((s) => (
            <div className="weekday" key={s}>
              {s}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={day}
              className={
                'calendar-day ' +
                (Number(day.slice(5, 7)) !== month.getMonth() + 1 ? 'outside ' : '') +
                (day === today ? 'today' : '')
              }
            >
              <span className="day-number">{Number(day.slice(-2))}</span>
              {data.deadlines
                .filter((d) => d.dueAt && d.status !== 'trash' && dayKey(d.dueAt, zone) === day)
                .map((d) => (
                  <button
                    key={d.id}
                    className={'calendar-event ' + (d.status === 'completed' ? 'done' : '')}
                    onClick={() => setDetail(d)}
                  >
                    {d.certainty === 'estimated' ? '~ ' : ''}
                    {d.title}
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
      <p className="fine-print">
        Dates shown in {zone}. Estimated dates carry a ~ marker. Ongoing and unannounced items
        remain on your boards.
      </p>
      {detail && !editor && (
        <DeadlineDetail
          item={detail}
          onClose={() => setDetail(null)}
          onEdit={(d) => {
            setDetail(null);
            setEditor(d);
          }}
        />
      )}
      {editor && <DeadlineEditor key={editor.id} item={editor} onClose={() => setEditor(null)} />}
    </div>
  );
}
