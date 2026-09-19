import { useEffect } from 'react';

export default function ConfirmModal({ open, title, message, confirmText = 'Delete', busy, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-title" className="text-xl font-bold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-mute">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-outline" onClick={onCancel} disabled={busy} autoFocus>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
