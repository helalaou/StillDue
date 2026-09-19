import { useRegisterSW } from 'virtual:pwa-register/react';
export function UpdatePrompt() {
  const {
    needRefresh: [refresh, setRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!refresh) return null;
  return (
    <div className="update-prompt" role="status">
      <span>A fresh version of StillDue is ready. Save your work before reloading.</span>
      <button className="button primary" onClick={() => void updateServiceWorker(true)}>
        Update
      </button>
      <button className="text-button" onClick={() => setRefresh(false)}>
        Later
      </button>
    </div>
  );
}
