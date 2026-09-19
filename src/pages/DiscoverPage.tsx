import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowUpRight, Plus, Globe2, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchConferences } from '../lib/catalog';
import { fields, subfieldName } from '../domain/taxonomy';
import { formatDate } from '../domain/time';
import { newDeadline } from '../domain/defaults';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/EmptyState';
import { DeadlineEditor } from '../components/DeadlineEditor';
import { Modal } from '../components/Modal';
import type { Deadline, Conference } from '../domain/types';
export function DiscoverPage() {
  const { data, save } = useWorkspace(),
    toast = useToast();
  const query = useQuery({
    queryKey: ['conferences'],
    queryFn: fetchConferences,
    staleTime: 3600000,
  });
  const [field, setField] = useState('computer-science'),
    [subfield, setSubfield] = useState(''),
    [search, setSearch] = useState(''),
    [windowDays, setWindowDays] = useState('365'),
    [limit, setLimit] = useState(30),
    [editor, setEditor] = useState<Deadline | null>(null),
    [review, setReview] = useState<{ deadline: Deadline; conference: Conference } | null>(null);
  const zone = data.preferences.followDevice
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : data.preferences.timezone;
  const now = Date.now();
  const conferences = (query.data || [])
    .filter(
      (c) =>
        c.field === field &&
        (!subfield || c.subfield === subfield) &&
        (!search ||
          [c.title, c.name, c.round, c.place]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        (!c.dueAt || Date.parse(c.dueAt) > now - 86400000) &&
        (windowDays === 'all' ||
          !c.dueAt ||
          Date.parse(c.dueAt) < now + Number(windowDays) * 86400000),
    )
    .sort(
      (a, b) =>
        (a.dueAt ? Date.parse(a.dueAt) : Infinity) - (b.dueAt ? Date.parse(b.dueAt) : Infinity),
    );
  const changes = data.deadlines
    .filter((d) => d.research.sourceId && d.status !== 'trash')
    .map((d) => ({
      deadline: d,
      conference: query.data?.find((c) => c.id === d.research.sourceId),
    }))
    .filter(
      (x): x is { deadline: Deadline; conference: Conference } =>
        !!x.conference && x.conference.dueAt !== x.deadline.research.sourceDueAt,
    );
  function importConference(c: Conference) {
    if (data.deadlines.some((d) => d.research.sourceId === c.id && d.status !== 'trash')) {
      toast('This submission round is already on your board.');
      return;
    }
    const d = newDeadline(data.boards[0]?.id || null);
    setEditor({
      ...d,
      title: c.title + ' ' + c.year + (c.round ? ' · ' + c.round : ''),
      kind: 'Research',
      certainty: c.certainty,
      dueAt: c.dueAt,
      timezone: c.timezone,
      research: {
        ...d.research,
        field: c.field,
        subfield: c.subfield,
        venue: c.title,
        year: String(c.year),
        track: c.round,
        sourceId: c.id,
        sourceDueAt: c.dueAt,
        sourceUrl: c.sourceUrl,
        submissionUrl: c.url,
      },
    });
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FIND YOUR NEXT OPPORTUNITY</div>
          <h1>Ideas need a place to go.</h1>
          <p>Discover a conference. Bring its deadline into your space.</p>
        </div>
        <button
          className="button secondary"
          onClick={() =>
            setEditor({ ...newDeadline(data.boards[0]?.id || null), kind: 'Research' })
          }
        >
          <Plus size={17} />
          Add manually
        </button>
      </div>
      <div className="discovery-filters">
        <label className="field">
          1. Field
          <select
            value={field}
            onChange={(e) => {
              setField(e.target.value);
              setSubfield('');
              setLimit(30);
            }}
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          2. Subfield
          <select
            value={subfield}
            onChange={(e) => {
              setSubfield(e.target.value);
              setLimit(30);
            }}
          >
            <option value="">All subfields</option>
            {fields
              .find((f) => f.id === field)
              ?.subfields.map((s) => (
                <option key={s[0]} value={s[0]}>
                  {s[1]}
                </option>
              ))}
          </select>
        </label>
        <label className="field">
          3. Deadline window
          <select value={windowDays} onChange={(e) => setWindowDays(e.target.value)}>
            <option value="90">Next 3 months</option>
            <option value="180">Next 6 months</option>
            <option value="365">Next year</option>
            <option value="all">All upcoming</option>
          </select>
        </label>
      </div>
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
          <input
            aria-label="Search conferences"
            placeholder="Search a conference, acronym, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="icon-button"
          aria-label="Reload catalog"
          onClick={() => void query.refetch()}
        >
          <RefreshCw size={18} />
        </button>
        <span className="muted small-text">{conferences.length} submission rounds</span>
      </div>
      {changes.length > 0 && (
        <div className="source-updates">
          <strong>{changes.length} source updates to review</strong>
          {changes.map((x) => (
            <button key={x.deadline.id} onClick={() => setReview(x)}>
              {x.deadline.title}
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      )}
      {field !== 'computer-science' ? (
        <EmptyState
          title="There’s room for every field."
          description="The live catalog currently covers computer science. You can add conferences from this field manually, with the same timezone and research tools."
          action={
            <button
              className="button primary"
              onClick={() => {
                const d = newDeadline(data.boards[0]?.id || null);
                setEditor({ ...d, kind: 'Research', research: { ...d.research, field, subfield } });
              }}
            >
              <Plus size={17} />
              Add a conference
            </button>
          }
        />
      ) : query.isPending ? (
        <div className="loading-state">Gathering conference deadlines…</div>
      ) : query.error ? (
        <EmptyState
          title="The catalog is taking a break."
          description={query.error.message}
          action={
            <button className="button secondary" onClick={() => void query.refetch()}>
              Try again
            </button>
          }
        />
      ) : !conferences.length ? (
        <EmptyState
          title="No matching conferences yet."
          description="Try a wider deadline window, another subfield, or add one manually."
        />
      ) : (
        <div className="conference-list">
          {conferences.slice(0, limit).map((c) => {
            const added = data.deadlines.some(
              (d) => d.research.sourceId === c.id && d.status !== 'trash',
            );
            return (
              <article key={c.id}>
                <div className="conference-acronym">{c.title}</div>
                <div className="conference-info">
                  <span className="eyebrow">
                    {subfieldName(c.field, c.subfield)} · {c.year}
                  </span>
                  <h2>{c.name}</h2>
                  <p>
                    {c.round || 'Submission deadline'}
                    {c.place ? ' · ' + c.place : ''}
                  </p>
                  <div className="conference-links">
                    <a href={c.url} target="_blank" rel="noreferrer">
                      Official website
                      <ExternalLink size={12} />
                    </a>
                    <a href={c.sourceUrl} target="_blank" rel="noreferrer">
                      Source record
                      <ExternalLink size={12} />
                    </a>
                    <span>Checked {new Date(c.checkedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="conference-due">
                  <strong>
                    {c.dueAt
                      ? formatDate(c.dueAt, zone, data.preferences.hour24, true)
                      : 'Date not announced'}
                  </strong>
                  <small>
                    {c.timezone} · {c.certainty}
                  </small>
                  <button
                    className="button secondary"
                    disabled={added}
                    onClick={() => importConference(c)}
                  >
                    {added ? (
                      'On your board'
                    ) : (
                      <>
                        <Plus size={15} />
                        Add deadline
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {conferences.length > limit && (
        <button className="button secondary load-more" onClick={() => setLimit(limit + 30)}>
          Show more conferences
        </button>
      )}
      <p className="fine-print">
        <Globe2 size={14} /> Community data from CCF Deadlines. Always check the official call for
        papers before submitting. Imported dates never change without your review.
      </p>
      {editor && <DeadlineEditor key={editor.id} item={editor} onClose={() => setEditor(null)} />}{' '}
      {review && (
        <Modal title="Review a changed source date" onClose={() => setReview(null)}>
          <h3>{review.deadline.title}</h3>
          <p>On your board: {formatDate(review.deadline.dueAt, zone)}</p>
          <p>Current source: {formatDate(review.conference.dueAt, zone)}</p>
          <p className="muted">
            Review the official source before accepting. Personal targets and other details stay as
            you set them.
          </p>
          <a href={review.conference.url} target="_blank" rel="noreferrer" className="text-button">
            Open official website
            <ExternalLink size={15} />
          </a>
          <div className="form-actions">
            <button
              className="button secondary"
              onClick={async () => {
                if (
                  await save('deadlines', {
                    ...review.deadline,
                    research: { ...review.deadline.research, sourceDueAt: review.conference.dueAt },
                  })
                )
                  setReview(null);
              }}
            >
              Keep my date
            </button>
            <button
              className="button primary"
              onClick={async () => {
                const c = review.conference,
                  d = review.deadline;
                if (
                  await save('deadlines', {
                    ...d,
                    dueAt: c.dueAt,
                    timezone: c.timezone,
                    certainty: c.certainty,
                    targetAt:
                      d.targetAt && c.dueAt && Date.parse(d.targetAt) > Date.parse(c.dueAt)
                        ? null
                        : d.targetAt,
                    research: { ...d.research, sourceDueAt: c.dueAt },
                  })
                ) {
                  toast('Source date updated.');
                  setReview(null);
                }
              }}
            >
              Use source date
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
