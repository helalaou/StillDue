import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { entity } from '../domain/defaults';
import type { Board, Project } from '../domain/types';
export function BoardsPage() {
  const { data, save, remove, saving } = useWorkspace(),
    toast = useToast();
  const [board, setBoard] = useState<Board | null>(null),
    [project, setProject] = useState<Project | null>(null),
    [deleting, setDeleting] = useState<Board | Project | null>(null);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (board && (await save('boards', board))) {
      setBoard(null);
      toast('Board saved.');
    }
    if (project && (await save('projects', project))) {
      setProject(null);
      toast('Project saved.');
    }
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">A PLACE FOR EVERYTHING</div>
          <h1>Your little corners.</h1>
          <p>Keep research, work, and life in their own spaces.</p>
        </div>
        <button
          className="button primary"
          onClick={() => setBoard({ ...entity(), name: '', color: 'mint', description: '' })}
        >
          <Plus size={18} />
          New board
        </button>
      </div>
      <div className="boards-grid">
        {data.boards.map((b) => (
          <article className={'board-card ' + b.color} key={b.id}>
            <div className="card-top">
              <span className="board-symbol">
                <FolderOpen size={25} />
              </span>
              <div className="card-icons">
                <button
                  className="icon-button"
                  aria-label={'Edit ' + b.name}
                  onClick={() => setBoard(b)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={'Delete ' + b.name}
                  onClick={() => {
                    if (
                      data.deadlines.some((d) => d.boardId === b.id) ||
                      data.projects.some((p) => p.boardId === b.id)
                    ) {
                      toast(
                        'Move or remove this board’s deadlines and projects before deleting it.',
                        true,
                      );
                      return;
                    }
                    setDeleting(b);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <Link to={'/?board=' + b.id} className="board-link">
              <h2>
                {b.name}
                <ArrowUpRight size={23} />
              </h2>
            </Link>
            <p>{b.description || 'A little room for what matters.'}</p>
            <span className="board-count">
              {data.deadlines.filter((d) => d.boardId === b.id && d.status !== 'trash').length}{' '}
              deadlines · {data.projects.filter((p) => p.boardId === b.id).length} projects
            </span>
          </article>
        ))}
      </div>
      {!data.boards.length && (
        <EmptyState
          title="Make your first space."
          description="Boards help you separate research, work, and personal deadlines."
        />
      )}
      <div className="section-toolbar spaced">
        <h2>
          Projects <span className="count">{data.projects.length}</span>
        </h2>
        <button
          className="button secondary"
          disabled={!data.boards.length}
          onClick={() =>
            setProject({ ...entity(), name: '', boardId: data.boards[0].id, description: '' })
          }
        >
          <Plus size={17} />
          New project
        </button>
      </div>
      <div className="project-list">
        {data.projects.map((p) => (
          <article key={p.id}>
            <FolderOpen size={22} />
            <div>
              <h3>{p.name}</h3>
              <p>
                {data.boards.find((b) => b.id === p.boardId)?.name} ·{' '}
                {data.deadlines.filter((d) => d.projectId === p.id && d.status !== 'trash').length}{' '}
                milestones
              </p>
            </div>
            <button
              className="icon-button"
              aria-label={'Edit ' + p.name}
              onClick={() => setProject(p)}
            >
              <Pencil size={17} />
            </button>
            <button
              className="icon-button"
              aria-label={'Delete ' + p.name}
              onClick={() => {
                if (data.deadlines.some((d) => d.projectId === p.id)) {
                  toast('Move this project’s milestones before deleting it.', true);
                  return;
                }
                setDeleting(p);
              }}
            >
              <Trash2 size={17} />
            </button>
          </article>
        ))}
      </div>
      {(board || project) && (
        <Modal
          title={board ? 'Your board' : 'Your project'}
          onClose={() => {
            setBoard(null);
            setProject(null);
          }}
        >
          <form onSubmit={submit}>
            <label className="field">
              Name
              <input
                required
                autoFocus
                maxLength={100}
                value={board?.name || project?.name || ''}
                onChange={(e) =>
                  board
                    ? setBoard({ ...board, name: e.target.value })
                    : setProject({ ...project!, name: e.target.value })
                }
              />
            </label>
            <label className="field">
              Description
              <textarea
                rows={3}
                value={board?.description || project?.description || ''}
                onChange={(e) =>
                  board
                    ? setBoard({ ...board, description: e.target.value })
                    : setProject({ ...project!, description: e.target.value })
                }
              />
            </label>
            {board ? (
              <label className="field">
                Color
                <select
                  value={board.color}
                  onChange={(e) => setBoard({ ...board, color: e.target.value })}
                >
                  <option value="mint">Forest green</option>
                  <option value="peach">Warm amber</option>
                  <option value="lavender">Soft violet</option>
                  <option value="blue">Clear blue</option>
                </select>
              </label>
            ) : (
              <label className="field">
                Board
                <select
                  value={project!.boardId}
                  onChange={(e) => setProject({ ...project!, boardId: e.target.value })}
                >
                  {data.boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="form-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setBoard(null);
                  setProject(null);
                }}
              >
                Cancel
              </button>
              <button className="button primary" disabled={saving}>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title={'Delete ' + deleting.name + '?'}
          message="This empty space will be permanently removed."
          label="Delete"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await remove('boardId' in deleting ? 'projects' : 'boards', deleting);
          }}
        />
      )}
    </div>
  );
}
