import { useServiceStatus } from '../hooks/useServiceStatus';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';
import { Brand } from '../components/Brand';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { errorMessage } from '../lib/errors';

function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285f4"
        d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9"
      />
      <path
        fill="#34a853"
        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.8c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.6-4.1H3v2.8A10 10 0 0 0 12 22"
      />
      <path
        fill="#fbbc05"
        d="M6.4 13.7A6 6 0 0 1 6.1 12c0-.6.1-1.2.3-1.7V7.5H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.5z"
      />
      <path
        fill="#ea4335"
        d="M12 6.2c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-9 5.5l3.4 2.8A5.9 5.9 0 0 1 12 6.2"
      />
    </svg>
  );
}
export function AuthPage() {
  const auth = useAuth();
  const service = useServiceStatus();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login'),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [name, setName] = useState(''),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const oauthError = query.get('error_description') || hash.get('error_description');
    if (oauthError) {
      setError(oauthError);
      history.replaceState({}, '', '/auth');
    }
  }, []);

  async function signInWithGoogle() {
    setError('');
    setMessage('');
    if (!supabase) {
      setError('Cloud accounts are not configured in this installation. You can explore the demo.');
      return;
    }
    if (!service.data?.googleLogin) {
      setError(
        'Google sign-in is being connected. Please use an existing account or the demo for now.',
      );
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/auth` },
      });
      if (error) throw error;
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!supabase) {
      setError('Cloud accounts are not configured in this installation. You can explore the demo.');
      return;
    }
    if (!auth.recovery && mode !== 'login' && !service.data?.authEmail) {
      setError(
        'Email delivery is being set up. Please explore the demo for now, or sign in to an existing confirmed account.',
      );
      return;
    }
    setBusy(true);
    try {
      if (auth.recovery) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        auth.finishRecovery();
        return;
      }
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name }, emailRedirectTo: location.origin + '/auth' },
        });
        if (error) throw error;
        setMessage('Check your email to confirm your account, then come back to sign in.');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: location.origin + '/auth',
        });
        if (error) throw error;
        setMessage('If an account exists for this email, a reset link is on its way.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <section className="auth-story">
        <Brand />
        <div className="auth-story-content">
          <span className="eyebrow">KEEP IT IN VIEW</span>
          <h1>
            A little clarity.
            <br />A little more
            <br />
            <em>headspace.</em>
          </h1>
          <p>A calm home for your deadlines, your research, and whatever comes next.</p>
          <div className="auth-example">
            <span>YOUR NEXT SMALL STEP</span>
            <p>Make room for the work that matters.</p>
            <div className="auth-track">
              <i />
            </div>
            <small>Your pace. Your space.</small>
          </div>
        </div>
        <small>Made for screens you live with.</small>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">WELCOME TO STILLDUE</span>
          <h2>
            {auth.recovery
              ? 'Choose a new password'
              : mode === 'signup'
                ? 'Make yourself at home.'
                : mode === 'reset'
                  ? 'Let’s get you back in.'
                  : 'Good to see you.'}
          </h2>
          <p className="muted">
            {mode === 'signup'
              ? 'Your deadlines, in one quiet place.'
              : mode === 'reset'
                ? 'We’ll send a link to reset your password.'
                : 'Sign in to pick up where you left off.'}
          </p>
          {mode !== 'login' && !auth.recovery && !service.data?.authEmail && (
            <p className="email-pending">
              Email delivery is being set up. New account verification and password resets will be
              available once it is connected.
            </p>
          )}
          {!auth.recovery && mode !== 'reset' && (
            <>
              <button
                type="button"
                className="button google-button full"
                disabled={busy || service.isLoading || !service.data?.googleLogin}
                onClick={signInWithGoogle}
              >
                <GoogleMark />
                Continue with Google
              </button>
              {!service.isLoading && !service.data?.googleLogin && (
                <p className="provider-pending">Google sign-in is being connected.</p>
              )}
              <div className="auth-divider compact">
                <span>or continue with email</span>
              </div>
            </>
          )}
          <form onSubmit={submit}>
            {mode === 'signup' && !auth.recovery && (
              <label className="field">
                Your name
                <input
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            {!auth.recovery && (
              <label className="field">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            )}
            {(mode !== 'reset' || auth.recovery) && (
              <label className="field">
                Password
                <span className="password-input">
                  <input
                    type={show ? 'text' : 'password'}
                    autoComplete={
                      mode === 'signup' || auth.recovery ? 'new-password' : 'current-password'
                    }
                    minLength={mode === 'signup' || auth.recovery ? 12 : 1}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
                {(mode === 'signup' || auth.recovery) && <small>Use at least 12 characters.</small>}
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="form-success" role="status">
                <Mail size={18} />
                {message}
              </p>
            )}
            <button className="button primary full" disabled={busy}>
              {busy
                ? 'One moment…'
                : auth.recovery
                  ? 'Save password'
                  : mode === 'signup'
                    ? 'Create account'
                    : mode === 'reset'
                      ? 'Send reset link'
                      : 'Sign in'}
              <ArrowRight size={18} />
            </button>
          </form>
          {!auth.recovery && (
            <>
              <div className="auth-links">
                <button
                  className="text-button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                    setMessage('');
                    setError('');
                  }}
                >
                  {mode === 'signup'
                    ? 'Already have an account? Sign in'
                    : 'New here? Create an account'}
                </button>
                {mode === 'login' && (
                  <button className="text-button" onClick={() => setMode('reset')}>
                    Forgot password?
                  </button>
                )}
                {mode === 'reset' && (
                  <button className="text-button" onClick={() => setMode('login')}>
                    Back to sign in
                  </button>
                )}
              </div>
              <div className="auth-divider">
                <span>Take a look around first</span>
              </div>
              <button className="button secondary full" onClick={auth.enterDemo}>
                Explore the demo <ArrowRight size={17} />
              </button>
              <p className="fine-print">
                The demo uses fictional data stored only in this browser.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
