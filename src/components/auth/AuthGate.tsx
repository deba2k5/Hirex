import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, Eye, EyeOff, GraduationCap, IdCard, Lock, Mail, ShieldCheck, User as UserIcon, Video, FileCheck2 } from 'lucide-react';
import { apiPost, setToken } from '@/lib/api';
import { BrandMark } from '@/components/landing/brand';

interface AuthGateProps {
  onBack: () => void;
  onAuthenticated: () => Promise<void> | void;
}

const input =
  'w-full rounded-xl border border-white/10 bg-white/[.04] py-3.5 pl-11 pr-4 text-[.95rem] text-ivory placeholder:text-white/30 outline-none transition focus:border-champagne/60 focus:bg-white/[.06] focus:ring-4 focus:ring-champagne/10';

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[.68rem] font-semibold uppercase tracking-[.18em] text-white/50">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">{icon}</span>
        {children}
      </span>
    </label>
  );
}

/** Account access against the Express API. Camera access is requested only for exam proctoring. */
const AuthGate = ({ onBack, onAuthenticated }: AuthGateProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isSignupValid =
    name.trim() &&
    email.trim() &&
    year.trim() &&
    department.trim() &&
    enrollmentNo.trim() &&
    password.length >= 6;
  const isSigninValid = email.trim() && password.length > 0;
  const canSubmit = mode === 'signup' ? !!isSignupValid : !!isSigninValid;

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      const path = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body =
        mode === 'signup'
          ? { name, email, year, department, enrollmentNo, password }
          : { email, password };
      const { token } = await apiPost<{ token: string }>(path, body);
      setToken(token);
      await onAuthenticated();
    } catch (err) {
      const unreachable = err instanceof TypeError || (err instanceof Error && /failed to fetch|networkerror|load failed/i.test(err.message));
      setError(
        unreachable
          ? 'Cannot reach the Recruitix server. Start it with "npm run server" (it listens on port 8787) and try again.'
          : err instanceof Error
            ? err.message
            : 'Authentication failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setError('');
  };

  return (
    <div className="hirex-app-shell lx-grain relative grid min-h-screen overflow-hidden lg:grid-cols-[minmax(0,1fr)_1.05fr]">
      {/* ------------------------------------------------------------ the form */}
      <div className="relative z-10 flex items-center justify-center px-4 py-10 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-champagne/[.10] blur-[110px]" />
        <div className="relative w-full max-w-md">
          <button onClick={onBack} className="mb-7 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-ivory">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </button>

          <div className="lx-glass rounded-[2rem] p-7 sm:p-9">
            <BrandMark className="mb-6 h-12 w-12" />
            <p className="text-[.7rem] font-semibold uppercase tracking-[.26em] text-champagne">Candidate access</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mt-3 font-display text-[2.7rem] leading-none text-ivory">
                  {mode === 'signup' ? <>Create your <em className="text-champagne">account.</em></> : <>Welcome <em className="text-champagne">back.</em></>}
                </h1>
                <p className="mt-3 text-[.95rem] text-white/50">
                  {mode === 'signup' ? 'Set up your candidate profile to take assessments.' : 'Sign in to continue to your assessments.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* mode switch */}
            <div role="tablist" aria-label="Sign in or create an account" className="relative mt-7 grid grid-cols-2 rounded-full border border-white/10 bg-white/[.03] p-1">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => switchMode(m)}
                  className={`relative z-10 rounded-full py-2.5 text-[.82rem] font-medium transition-colors ${mode === m ? 'text-ink-950' : 'text-white/55 hover:text-ivory'}`}
                >
                  {mode === m && (
                    <motion.span layoutId="auth-tab" className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-champagne-light to-champagne" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit && !isLoading) void handleSubmit();
              }}
            >
              {error && (
                <div role="alert" className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <Field label="Full name" icon={<UserIcon className="h-4 w-4" />}>
                  <input autoComplete="name" className={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
              )}

              <Field label="Email" icon={<Mail className="h-4 w-4" />}>
                <input type="email" autoComplete="email" className={input} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>

              {mode === 'signup' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Year of study" icon={<GraduationCap className="h-4 w-4" />}>
                      <input className={input} placeholder="e.g. 3rd Year" value={year} onChange={(e) => setYear(e.target.value)} />
                    </Field>
                    <Field label="Department" icon={<Building2 className="h-4 w-4" />}>
                      <input className={input} placeholder="e.g. Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Enrollment number" icon={<IdCard className="h-4 w-4" />}>
                    <input className={input} placeholder="Your enrollment number" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} />
                  </Field>
                </>
              )}

              <Field label="Password" icon={<Lock className="h-4 w-4" />}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className={`${input} pr-12`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/40 transition-colors hover:text-ivory"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>
              {mode === 'signup' && <p className="-mt-1 text-xs text-white/35">At least 6 characters.</p>}

              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className="lx-btn-gold mt-2 flex h-14 w-full items-center justify-center rounded-full text-[.95rem] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ the photograph */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src="/img/spotlight-desk.webp" alt="" aria-hidden="true" className="lx-tone-ivory absolute inset-0 h-full w-full object-cover object-[50%_58%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/30 to-ink-950/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_62%,rgba(216,185,122,.18),transparent_60%)]" />

        <div className="absolute inset-x-12 bottom-12">
          <p className="font-display text-5xl leading-[1.02] text-ivory">
            A calm room to <span className="lx-text-gold italic">do your best work.</span>
          </p>
          <ul className="mt-8 space-y-4">
            {[
              [ShieldCheck, 'Fair and consistent', 'Every candidate is scored by the same rules.'],
              [Video, 'Proctored, not intrusive', 'Camera and screen sharing, only during exams.'],
              [FileCheck2, 'Clear reports', 'See exactly how each answer was scored.'],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <li key={t as string} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.05] text-champagne backdrop-blur">
                    <I className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-ivory">{t as string}</p>
                    <p className="text-sm text-white/50">{d as string}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
