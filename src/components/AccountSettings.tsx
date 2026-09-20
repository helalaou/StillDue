import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { Modal } from './Modal';
import { supabase } from '../lib/supabase';
import { errorMessage } from '../lib/errors';
import { matchesAccountEmail, usesGoogleSignIn } from '../lib/account-auth';
export function AccountSettings() {
  const { demo, session, signOut } = useAuth(),
    { resetDemo } = useWorkspace(),
    toast = useToast(),
    navigate = useNavigate();
  const [confirm, setConfirm] = useState(false),
    [password, setPassword] = useState(''),
    [confirmationEmail, setConfirmationEmail] = useState(''),
    [busy, setBusy] = useState(false);
  const googleAccount = !!session && usesGoogleSignIn(session.user);
  async function removeAccount() {
    if (!session || !supabase) return;
    setBusy(true);
    try {
      let accessToken = session.access_token;
      if (!googleAccount) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: session.user.email!,
          password,
        });
        if (error) throw error;
        accessToken = data.session!.access_token;
      }
      const response = await fetch('/.netlify/functions/delete-account', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmation: 'DELETE MY ACCOUNT',
          confirmationEmail: googleAccount ? confirmationEmail : undefined,
        }),
      });
      if (!response.ok)
        throw new Error((await response.json()).error || 'Account deletion failed.');
      await signOut();
      navigate('/');
      toast('Your account and active application data have been deleted.');
    } catch (e) {
      toast(errorMessage(e), true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="settings-section">
      <div>
        <h2>Account</h2>
        <p>{demo ? 'This demo lives only in this browser.' : session?.user.email}</p>
      </div>
      <div className="settings-content">
        {demo ? (
          <button
            className="button secondary"
            onClick={() => {
              if (window.confirm('Reset this demo and remove your demo edits?')) {
                resetDemo();
                toast('Demo reset.');
              }
            }}
          >
            <RotateCcw size={17} />
            Reset demo
          </button>
        ) : (
          <>
            <p className="muted">
              Deleting your account removes its boards, projects, deadlines, templates, and
              preferences. Export your data first if you want to keep a copy.
            </p>
            <button className="button secondary danger-text" onClick={() => setConfirm(true)}>
              <Trash2 size={17} />
              Delete my account
            </button>
          </>
        )}
      </div>
      {confirm && (
        <Modal title="Delete your account permanently?" onClose={() => setConfirm(false)}>
          <p>
            This removes your account and all its active application data. This cannot be undone.
          </p>
          {googleAccount ? (
            <label className="field">
              Type {session?.user.email} to confirm
              <input
                type="email"
                autoComplete="off"
                value={confirmationEmail}
                onChange={(e) => setConfirmationEmail(e.target.value)}
              />
            </label>
          ) : (
            <label className="field">
              Confirm with your password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          <div className="form-actions">
            <button className="button secondary" onClick={() => setConfirm(false)}>
              Keep my account
            </button>
            <button
              className="button danger"
              disabled={
                busy ||
                (googleAccount ? !matchesAccountEmail(session!.user, confirmationEmail) : !password)
              }
              onClick={() => void removeAccount()}
            >
              {busy ? 'Deleting…' : 'Delete permanently'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
