import { useState, type FormEvent } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { Modal } from './Modal';
import { TimezoneSelect } from './TimezoneSelect';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDraft } from '../hooks/useDraft';
import { instantToLocal, localToInstant, validZone } from '../domain/time';
import { validateDeadline } from '../domain/validation';
import { fields } from '../domain/taxonomy';
import type { Deadline } from '../domain/types';
import { errorMessage } from '../lib/errors';
export function DeadlineEditor({ item, onClose }: { item: Deadline; onClose: () => void }) {
  const { data, save, saving } = useWorkspace();
  const { session, demo } = useAuth();
  const toast = useToast();
  const exists = data.deadlines.some((d) => d.id === item.id);
  const [draft, setDraft, clearDraft] = useDraft(
    'stilldue:draft:' +
      (demo ? 'demo' : session!.user.id) +
      ':' +
      (exists ? item.id : 'new' + (item.research.sourceId ? ':' + item.research.sourceId : '')),
    {
      record: item,
      due: instantToLocal(item.dueAt, item.timezone, item.dateOnly),
      target: instantToLocal(item.targetAt, item.timezone, false),
    },
  );
  const d = draft.record;
  const latest = data.deadlines.find((x) => x.id === d.id);
  const hasConflict = !!latest && latest.version !== d.version;
  const [tab, setTab] = useState('basics'),
    [error, setError] = useState(''),
    [step, setStep] = useState('');
  function update(p: Partial<Deadline>) {
    setDraft((v) => ({ ...v, record: { ...v.record, ...p } }));
  }
  function research(key: string, value: string) {
    update({ research: { ...d.research, [key]: value } });
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = {
        ...d,
        dueAt: ['confirmed', 'estimated'].includes(d.certainty)
          ? localToInstant(draft.due, d.timezone, d.dateOnly)
          : null,
        targetAt: draft.target ? localToInstant(draft.target, d.timezone) : null,
      };
      validateDeadline(result);
      if (await save('deadlines', result)) {
        clearDraft();
        toast(exists ? 'Deadline updated.' : 'A little more clarity. Deadline added.');
        onClose();
      }
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  return (
    <Modal title={exists ? 'Edit deadline' : 'A new thing to keep in view'} onClose={onClose} wide>
      <form onSubmit={submit}>
        {hasConflict && (
          <div className="form-error" role="alert">
            This deadline changed elsewhere. Your draft is preserved.{' '}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                if (window.confirm('Replace this draft with the latest saved version?'))
                  setDraft({
                    record: latest!,
                    due: instantToLocal(latest!.dueAt, latest!.timezone, latest!.dateOnly),
                    target: instantToLocal(latest!.targetAt, latest!.timezone),
                  });
              }}
            >
              Load latest version
            </button>
          </div>
        )}
        <label className="field">
          Title
          <input
            autoFocus
            required
            maxLength={160}
            value={d.title}
            placeholder="What’s coming up?"
            onChange={(e) => update({ title: e.target.value })}
          />
        </label>
        <div className="tabs" role="tablist" aria-label="Deadline details">
          {[
            ['basics', 'The essentials'],
            ['steps', 'Next steps'],
            ['research', 'Research details'],
          ].map(([id, label]) => (
            <button
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? 'active' : ''}
              key={id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === 'basics' && (
          <div className="form-section">
            <div className="form-grid">
              <label className="field">
                Board
                <select
                  value={d.boardId || ''}
                  onChange={(e) => update({ boardId: e.target.value || null, projectId: null })}
                >
                  <option value="">No board</option>
                  {data.boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Project
                <select
                  value={d.projectId || ''}
                  onChange={(e) => update({ projectId: e.target.value || null })}
                >
                  <option value="">Standalone deadline</option>
                  {data.projects
                    .filter((p) => p.boardId === d.boardId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="field">
                Date certainty
                <select
                  value={d.certainty}
                  onChange={(e) =>
                    update({
                      certainty: e.target.value as Deadline['certainty'],
                      recurrence: 'none',
                    })
                  }
                >
                  <option value="confirmed">Confirmed deadline</option>
                  <option value="estimated">Estimated date</option>
                  <option value="tba">Date not announced</option>
                  <option value="ongoing">Ongoing · no deadline</option>
                </select>
              </label>
              <label className="field">
                Priority
                <select
                  value={d.priority}
                  onChange={(e) => update({ priority: e.target.value as Deadline['priority'] })}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>
            {['confirmed', 'estimated'].includes(d.certainty) && (
              <>
                <div className="form-grid">
                  <label className="field">
                    {d.certainty === 'estimated' ? 'Estimated date' : 'Official deadline'}
                    <input
                      type={d.dateOnly ? 'date' : 'datetime-local'}
                      required
                      value={draft.due}
                      onChange={(e) => setDraft((v) => ({ ...v, due: e.target.value }))}
                    />
                  </label>
                  <TimezoneSelect value={d.timezone} onChange={(v) => update({ timezone: v })} />
                </div>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={d.dateOnly}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setDraft((v) => ({
                        ...v,
                        record: { ...v.record, dateOnly: checked },
                        due: checked
                          ? v.due.slice(0, 10)
                          : v.due
                            ? v.due.slice(0, 10) + 'T23:59'
                            : '',
                      }));
                    }}
                  />
                  Date only · due at the end of the day in this timezone
                </label>
                <details className="advanced">
                  <summary>
                    Personal target & repetition <ChevronDown size={15} />
                  </summary>
                  <div className="form-grid">
                    <label className="field">
                      Personal target (optional)
                      <input
                        type="datetime-local"
                        value={draft.target}
                        onChange={(e) => setDraft((v) => ({ ...v, target: e.target.value }))}
                      />
                    </label>
                    <label className="field">
                      Repeat
                      <select
                        disabled={d.certainty !== 'confirmed'}
                        value={d.recurrence}
                        onChange={(e) =>
                          update({ recurrence: e.target.value as Deadline['recurrence'] })
                        }
                      >
                        <option value="none">Does not repeat</option>
                        <option value="weekly">Every week</option>
                        <option value="monthly">Every month</option>
                        <option value="yearly">Every year</option>
                      </select>
                    </label>
                  </div>
                </details>
              </>
            )}
            <div className="form-grid">
              <label className="field">
                Type
                <input
                  value={d.kind}
                  maxLength={80}
                  onChange={(e) => update({ kind: e.target.value })}
                  placeholder="Paper, application, personal…"
                />
              </label>
              <label className="field">
                Tags, separated by commas
                <input
                  value={d.tags.join(', ')}
                  onChange={(e) =>
                    update({
                      tags: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
            </div>
            <div className="check-row">
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={d.focus}
                  onChange={(e) => update({ focus: e.target.checked })}
                />
                Keep in focus
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={d.pinned}
                  onChange={(e) => update({ pinned: e.target.checked })}
                />
                Pin to top
              </label>
            </div>
            <details className="advanced">
              <summary>
                Email reminder timing <ChevronDown size={15} />
              </summary>
              <p className="muted small-text">
                Requires email reminders to be enabled in Settings. Reminders use your account’s
                quiet hours.
              </p>
              <div className="check-row">
                {[
                  [10080, '1 week before'],
                  [1440, '1 day before'],
                  [60, '1 hour before'],
                ].map(([n, label]) => (
                  <label key={n} className="check-field">
                    <input
                      type="checkbox"
                      checked={d.reminderMinutes.includes(Number(n))}
                      onChange={(e) =>
                        update({
                          reminderMinutes: e.target.checked
                            ? [...d.reminderMinutes, Number(n)]
                            : d.reminderMinutes.filter((x) => x !== n),
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </details>
          </div>
        )}
        {tab === 'steps' && (
          <div className="form-section">
            <label className="field">
              Your next small step
              <input
                maxLength={500}
                value={d.nextAction}
                placeholder="Something concrete you can do next"
                onChange={(e) => update({ nextAction: e.target.value })}
              />
            </label>
            <label className="field">
              Notes
              <textarea
                rows={5}
                maxLength={10000}
                value={d.notes}
                onChange={(e) => update({ notes: e.target.value })}
              />
            </label>
            <div className="field">Checklist</div>
            {d.checklist.map((c) => (
              <div className="checklist-row" key={c.id}>
                <input
                  type="checkbox"
                  aria-label={'Complete ' + c.text}
                  checked={c.done}
                  onChange={(e) =>
                    update({
                      checklist: d.checklist.map((x) =>
                        x.id === c.id ? { ...x, done: e.target.checked } : x,
                      ),
                    })
                  }
                />
                <span>{c.text}</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={'Remove ' + c.text}
                  onClick={() => update({ checklist: d.checklist.filter((x) => x.id !== c.id) })}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <div className="inline-form">
              <input
                aria-label="New checklist step"
                value={step}
                placeholder="Add a small step"
                onChange={(e) => setStep(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (step.trim()) {
                      update({
                        checklist: [
                          ...d.checklist,
                          { id: crypto.randomUUID(), text: step.trim(), done: false },
                        ],
                      });
                      setStep('');
                    }
                  }
                }}
              />
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  if (step.trim()) {
                    update({
                      checklist: [
                        ...d.checklist,
                        { id: crypto.randomUUID(), text: step.trim(), done: false },
                      ],
                    });
                    setStep('');
                  }
                }}
              >
                <Plus size={17} />
                Add
              </button>
            </div>
          </div>
        )}
        {tab === 'research' && (
          <div className="form-section">
            <div className="form-grid">
              <label className="field">
                Field
                <select
                  value={d.research.field}
                  onChange={(e) =>
                    update({ research: { ...d.research, field: e.target.value, subfield: '' } })
                  }
                >
                  <option value="">Choose a field</option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Subfield
                <input
                  list="research-subfields"
                  value={d.research.subfield}
                  onChange={(e) => research('subfield', e.target.value)}
                  placeholder="Choose or enter a subfield"
                />
                <datalist id="research-subfields">
                  {fields
                    .find((f) => f.id === d.research.field)
                    ?.subfields.map((s) => (
                      <option value={s[1]} key={s[0]} />
                    ))}
                </datalist>
              </label>
              {[
                ['venue', 'Conference or venue'],
                ['year', 'Year'],
                ['track', 'Submission track'],
                ['role', 'Your role'],
                ['pageLimit', 'Page limit'],
                ['submissionUrl', 'Submission link'],
                ['sourceUrl', 'Official source link'],
              ].map(([k, label]) => (
                <label className="field" key={k}>
                  {label}
                  <input
                    type={k.endsWith('Url') ? 'url' : 'text'}
                    value={d.research[k as keyof typeof d.research] || ''}
                    onChange={(e) => research(k, e.target.value)}
                  />
                </label>
              ))}
            </div>
            <p className="muted small-text">
              These details stay optional. You can track any field, even when it is not in the
              discovery catalog.
            </p>
          </div>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {!validZone(d.timezone) && (
          <p className="form-error">Choose a valid timezone before saving.</p>
        )}
        <div className="form-actions">
          <span className="draft-note">Draft saved on this device</span>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              clearDraft();
              onClose();
            }}
          >
            Discard draft
          </button>
          <button className="button primary" disabled={saving || hasConflict}>
            {saving ? 'Saving…' : exists ? 'Save changes' : 'Add deadline'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
