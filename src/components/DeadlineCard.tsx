import { ArrowUpRight, Pin, Star, Check, CalendarDays } from 'lucide-react';
import type { Deadline, Board, Project, Preferences } from '../domain/types';
import { countdown, detailedRemaining, elapsed, checklistProgress } from '../domain/countdown';
import { formatDate } from '../domain/time';
import { isExpired } from '../domain/lifecycle';
export function DeadlineCard({
  item,
  board,
  project,
  prefs,
  now,
  onOpen,
  onComplete,
  selectable = false,
  selected = false,
  onSelect,
  display = false,
}: {
  item: Deadline;
  board?: Board;
  project?: Project;
  prefs: Preferences;
  now: number;
  onOpen: () => void;
  onComplete?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  display?: boolean;
}) {
  const c = countdown(item, now);
  const zone = prefs.followDevice
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : prefs.timezone;
  const urgency = isExpired(item, now)
    ? 'past'
    : c.days <= prefs.urgentDays
      ? 'urgent'
      : c.days <= prefs.warningDays
        ? 'upcoming'
        : 'later';
  return (
    <article
      className={
        'deadline-card ' +
        (board?.color || 'mint') +
        ' ' +
        urgency +
        (display ? ' display-card' : '') +
        (selected ? ' is-selected' : '')
      }
    >
      <div className="card-top">
        <span className="board-label">{board?.name || item.kind}</span>
        <div className="card-icons">
          {item.pinned && <Pin size={15} aria-label="Pinned" />}
          {item.focus && <Star size={15} aria-label="In focus" />}
          {selectable ? (
            <input
              type="checkbox"
              aria-label={'Select ' + item.title}
              checked={selected}
              onChange={onSelect}
            />
          ) : (
            !display && (
              <button className="icon-button" aria-label={'Open ' + item.title} onClick={onOpen}>
                <ArrowUpRight size={21} />
              </button>
            )
          )}
        </div>
      </div>
      <div className={'countdown ' + (c.value.length > 3 ? 'countdown-small' : '')}>
        {c.value}
        <span>{c.label}</span>
      </div>
      {prefs.countdown === 'detailed' && item.certainty === 'confirmed' && (
        <div className="detailed-time">{detailedRemaining(item, now)}</div>
      )}
      <h3>
        {display ? (
          item.title
        ) : (
          <button className="title-button" onClick={onOpen}>
            {item.title}
          </button>
        )}
      </h3>
      <p className="card-project">{project?.name || item.research.venue || item.kind}</p>
      {prefs.showNotes && (
        <div className="card-next">
          {item.nextAction ? (
            <>
              <span className="next-step-label">Next small step</span>
              {item.nextAction}
            </>
          ) : (
            <span className="next-step-hint">
              {item.certainty === 'ongoing'
                ? 'Keep the idea in view.'
                : 'Add a next step when you’re ready.'}
            </span>
          )}
        </div>
      )}
      {item.targetAt && (
        <div className="target-date">
          Your target · {formatDate(item.targetAt, zone, prefs.hour24, true)}
        </div>
      )}
      <div className="card-date">
        <CalendarDays size={15} />
        <span>
          {item.dueAt
            ? formatDate(item.dueAt, zone, prefs.hour24, item.dateOnly)
            : item.certainty === 'tba'
              ? 'Date not announced'
              : 'Ongoing · no fixed date'}
        </span>
      </div>
      {prefs.showProgress && item.certainty === 'confirmed' && item.dueAt && (
        <div className="time-progress" title="Time elapsed, not work completed">
          <div style={{ width: elapsed(item, now) + '%' }} />
        </div>
      )}
      <div className="card-bottom">
        <span>
          {item.priority === 'high'
            ? 'HIGH PRIORITY'
            : item.certainty === 'estimated'
              ? 'ESTIMATED DATE'
              : item.certainty === 'confirmed'
                ? 'CONFIRMED DEADLINE'
                : 'AT YOUR PACE'}
        </span>
        {item.checklist.length > 0 ? (
          <span>{checklistProgress(item)}% of steps done</span>
        ) : onComplete && item.status === 'active' && !display ? (
          <button className="text-button" onClick={onComplete}>
            <Check size={14} />
            Mark done
          </button>
        ) : (
          <span>
            {item.timezone === 'AoE' ? 'AoE' : item.timezone.split('/').pop()?.replaceAll('_', ' ')}
          </span>
        )}
      </div>
    </article>
  );
}
