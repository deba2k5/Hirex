import { ArrowLeft, Lock } from 'lucide-react';
import { BrandMark } from './brand';

interface Props {
  credentials: { id: string; password: string };
  onChange: (next: { id: string; password: string }) => void;
  error: string;
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const field =
  'w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3.5 text-ivory placeholder:text-white/30 outline-none transition focus:border-champagne/60 focus:bg-white/[.06] focus:ring-4 focus:ring-champagne/10';

/** Recruiter sign-in, in the same visual language as the landing page. Behaviour is unchanged. */
export default function AdminLogin({ credentials, onChange, error, loading, onSubmit, onCancel }: Props) {
  return (
    <div className="hirex-app-shell lx-grain relative grid min-h-screen overflow-hidden lg:grid-cols-[1fr_1.05fr]">
      {/* the photograph, on the right: a receding grid and a lone figure shaping a new world */}
      <div className="relative order-2 hidden overflow-hidden lg:order-2 lg:block">
        <img src="/img/vapor-grid.webp" alt="" aria-hidden="true" className="lx-tone-gold absolute inset-0 h-full w-full object-cover object-[60%_50%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/20 to-ink-950/30" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
        <p className="absolute left-12 top-12 max-w-xs font-display text-4xl leading-tight text-ivory">
          Evidence, <span className="lx-text-gold italic">explained.</span>
        </p>
      </div>

      <div className="relative z-10 order-1 flex items-center justify-center p-4 sm:p-10">
      <div aria-hidden="true" className="absolute -top-40 left-1/2 h-[480px] w-[560px] -translate-x-1/2 rounded-full bg-champagne/[.12] blur-[110px]" />
      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={onCancel}
          disabled={loading}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-ivory"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="lx-glass rounded-[2rem] p-8 sm:p-10"
        >
          <BrandMark className="mb-7 h-14 w-14" />
          <p className="text-[.7rem] font-semibold uppercase tracking-[.26em] text-champagne">Recruiter access</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-ivory">Welcome back.</h1>
          <p className="mt-4 text-white/55">Sign in to open the recruiter dashboard.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-id" className="mb-2 block text-xs font-medium uppercase tracking-[.16em] text-white/50">
                Admin ID
              </label>
              <input
                id="admin-id"
                type="text"
                autoComplete="username"
                value={credentials.id}
                onChange={(e) => onChange({ ...credentials, id: e.target.value })}
                placeholder="Enter admin ID"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-medium uppercase tracking-[.16em] text-white/50">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) => onChange({ ...credentials, password: e.target.value })}
                placeholder="Enter password"
                className={field}
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="lx-btn-gold mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full text-[.95rem] disabled:opacity-60">
            <Lock className="h-4 w-4" />
            {loading ? 'Authenticating…' : 'Access dashboard'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
