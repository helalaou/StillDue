import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { clearPrivateCache } from '../lib/storage';
interface Auth {
  session: Session | null;
  loading: boolean;
  demo: boolean;
  recovery: boolean;
  enterDemo: () => void;
  signOut: () => Promise<void>;
  finishRecovery: () => void;
}
const Context = createContext<Auth>(null!);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null),
    [loading, setLoading] = useState(!!supabase),
    [demo, setDemo] = useState(sessionStorage.getItem('stilldue:demo-mode') === 'yes'),
    [recovery, setRecovery] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    let live = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (live) {
        setSession(data.session);
        setLoading(false);
        if (error) console.error('Could not restore session.');
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession((previous) => {
        if (!s && previous) clearPrivateCache(previous.user.id);
        return s;
      });
      setLoading(false);
      if (s) {
        setDemo(false);
        sessionStorage.removeItem('stilldue:demo-mode');
      }
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
    });
    return () => {
      live = false;
      data.subscription.unsubscribe();
    };
  }, []);
  async function signOut() {
    if (session && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearPrivateCache(session.user.id);
    }
    sessionStorage.removeItem('stilldue:demo-mode');
    setDemo(false);
    setSession(null);
  }
  return (
    <Context.Provider
      value={{
        session,
        loading,
        demo,
        recovery,
        enterDemo() {
          setDemo(true);
          sessionStorage.setItem('stilldue:demo-mode', 'yes');
        },
        signOut,
        finishRecovery() {
          setRecovery(false);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
