import { createContext, useContext, useState, type ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
interface Notice {
  id: number;
  message: string;
  error: boolean;
  action?: { label: string; run: () => void };
}
const Context = createContext<
  (message: string, error?: boolean, action?: Notice['action']) => void
>(() => {});
export function ToastProvider({ children }: { children: ReactNode }) {
  const [notices, set] = useState<Notice[]>([]);
  function dismiss(id: number) {
    set((n) => n.filter((x) => x.id !== id));
  }
  function notify(message: string, error = false, action?: Notice['action']) {
    const id = Date.now() + Math.random();
    set((n) => [...n.slice(-2), { id, message, error, action }]);
    setTimeout(() => dismiss(id), error ? 14000 : 9000);
  }
  return (
    <Context.Provider value={notify}>
      {children}
      <div className="toasts" aria-live="polite">
        {notices.map((n) => (
          <div className={'toast ' + (n.error ? 'error' : '')} key={n.id}>
            {n.error ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />}
            <span>{n.message}</span>
            {n.action && (
              <button
                onClick={() => {
                  n.action!.run();
                  dismiss(n.id);
                }}
              >
                {n.action.label}
              </button>
            )}
            <button
              aria-label="Dismiss message"
              className="icon-button"
              onClick={() => dismiss(n.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </Context.Provider>
  );
}
export const useToast = () => useContext(Context);
