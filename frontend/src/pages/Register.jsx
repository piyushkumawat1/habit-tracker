import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowLeft, Mail } from 'lucide-react';
import '../landing.css';

export default function Register() {
  const { register, loginWithGoogle, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const turnstileRef = useRef(null);

  // Redirect to dashboard if they are already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/habits');
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!captchaToken) {
      setError('Please complete the CAPTCHA check below to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await register(email, password, name || undefined, captchaToken);
      if (data?.user && !data.session) {
        // Confirm email is required
        setShowOtpForm(true);
        setError('');
      } else if (data?.session) {
        // Auto logged in (Confirm email is off)
        navigate('/habits');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      turnstileRef.current?.reset();
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otp, 'signup');
      // Success, AuthContext onAuthStateChange will handle redirect
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google login failed.');
    }
  }

  return (
    <div className="landing-page-root min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--ld-primary)] opacity-[0.15] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--ld-primary-light)] opacity-[0.1] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 py-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[var(--ld-text-secondary)] hover:text-[var(--ld-text)] transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="bg-[var(--ld-card)] border border-[var(--ld-border)] rounded-2xl p-8 md:p-10 ld-shadow-card">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-5 rounded-xl overflow-hidden border border-[var(--ld-border)] shadow-sm">
              <img src="/logo.png" alt="Habitley Logo" className="w-full h-full object-cover bg-[var(--ld-surface)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--ld-text)] mb-2">Create account</h1>
            <p className="text-sm text-[var(--ld-text-secondary)]">Start building better habits today</p>
          </div>

          {error && (
            <div className="bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.2)] text-[#f43f5e] px-4 py-3 rounded-xl text-sm font-medium mb-6 text-center">
              {error}
            </div>
          )}

          {showOtpForm ? (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <div className="mx-auto w-12 h-12 bg-[var(--ld-primary-light)] text-[var(--ld-primary)] rounded-full flex items-center justify-center mb-3">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--ld-text)]">Check your email</h3>
                <p className="text-[13px] text-[var(--ld-text-secondary)] mt-1">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[var(--ld-text-secondary)] mb-1.5" htmlFor="reg-otp">Verification Code</label>
                <input id="reg-otp" type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="w-full text-center tracking-widest text-lg bg-[var(--ld-surface)] border border-[var(--ld-border)] rounded-xl px-4 py-3 text-[var(--ld-text)] focus:outline-none focus:border-[var(--ld-primary-light)] focus:ring-1 focus:ring-[var(--ld-primary-light)] transition-all" placeholder="Enter code" maxLength={8} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 rounded-xl bg-[var(--ld-primary)] hover:bg-[var(--ld-primary-hover)] text-white font-bold text-sm transition-all shadow-sm flex justify-center items-center">
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <button type="button" onClick={() => setShowOtpForm(false)} className="text-[13px] text-[var(--ld-text-secondary)] hover:text-[var(--ld-text)] mt-2 font-medium">
                ← Use a different email
              </button>
            </form>
          ) : !showEmailForm ? (
            <div className="flex flex-col gap-4">
              <button onClick={handleGoogleLogin} className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm flex items-center justify-center gap-3 transition-all border border-gray-200 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-[var(--ld-border)]"></div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--ld-text-muted)]">OR</span>
                <div className="flex-1 h-px bg-[var(--ld-border)]"></div>
              </div>

              <button onClick={() => setShowEmailForm(true)} className="w-full py-3.5 px-4 rounded-xl bg-[var(--ld-surface)] hover:bg-[var(--ld-card-hover)] text-[var(--ld-text)] border border-[var(--ld-border)] hover:border-[var(--ld-border-hover)] font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-sm">
                <Mail size={18} className="text-[var(--ld-text-muted)]" />
                Continue with Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ld-text-secondary)] mb-1.5" htmlFor="reg-name">Name (optional)</label>
                <input id="reg-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[var(--ld-surface)] border border-[var(--ld-border)] rounded-xl px-4 py-3 text-sm text-[var(--ld-text)] focus:outline-none focus:border-[var(--ld-primary-light)] focus:ring-1 focus:ring-[var(--ld-primary-light)] transition-all placeholder:text-[var(--ld-text-muted)]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ld-text-secondary)] mb-1.5" htmlFor="reg-email">Email Address</label>
                <input id="reg-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[var(--ld-surface)] border border-[var(--ld-border)] rounded-xl px-4 py-3 text-sm text-[var(--ld-text)] focus:outline-none focus:border-[var(--ld-primary-light)] focus:ring-1 focus:ring-[var(--ld-primary-light)] transition-all placeholder:text-[var(--ld-text-muted)]" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ld-text-secondary)] mb-1.5" htmlFor="reg-password">Password</label>
                <input id="reg-password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[var(--ld-surface)] border border-[var(--ld-border)] rounded-xl px-4 py-3 text-sm text-[var(--ld-text)] focus:outline-none focus:border-[var(--ld-primary-light)] focus:ring-1 focus:ring-[var(--ld-primary-light)] transition-all placeholder:text-[var(--ld-text-muted)]" placeholder="At least 6 characters" />
              </div>

              <div className="flex justify-center my-2 bg-[var(--ld-surface)] p-2 rounded-xl border border-[var(--ld-border)]">
                <Turnstile
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => {
                    setCaptchaToken(token);
                    setError('');
                  }}
                  ref={turnstileRef}
                  options={{ theme: 'auto' }}
                />
              </div>

              {/* Notice the button is NOT explicitly disabled by captchaToken anymore, so it remains vibrant. If they click it, we show the error above. */}
              <button type="submit" disabled={loading} className="w-full py-3.5 mt-2 rounded-xl bg-[var(--ld-primary)] hover:bg-[var(--ld-primary-hover)] text-white font-bold text-sm transition-all shadow-sm flex justify-center items-center">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <button type="button" onClick={() => setShowEmailForm(false)} className="text-[13px] text-[var(--ld-text-secondary)] hover:text-[var(--ld-text)] mt-2 font-medium">
                ← Back to options
              </button>
            </form>
          )}

          <p className="text-center mt-8 text-[13px] text-[var(--ld-text-secondary)]">
            Already have an account? <Link to="/login" className="text-[var(--ld-primary-light)] hover:text-[var(--ld-primary)] font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
