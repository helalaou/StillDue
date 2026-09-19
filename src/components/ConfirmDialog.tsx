import { useState } from 'react';
import { Modal } from './Modal';
export function ConfirmDialog({
  title,
  message,
  label = 'Confirm',
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  label?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={title} onClose={onClose}>
      <p className="muted">{message}</p>
      <div className="form-actions">
        <button className="button secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="button danger"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
              onClose();
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? 'Working…' : label}
        </button>
      </div>
    </Modal>
  );
}
