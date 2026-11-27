import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Camera, CheckCircle2, MonitorUp, ShieldCheck } from 'lucide-react';

interface Props {
  onCandidate: () => void;
  onRecruiter: () => void;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

function ScoreRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 84 84" className="-rotate-90">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
        <motion.circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.8, delay: 0.9, ease }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1dfb4" />
            <stop offset="1" stopColor="#a98643" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-3xl leading-none text-ivory">{value}</span>
      </div>
    </div>
  );
}

function Bar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[.7rem] text-white/55">
        <span>{label}</span>
        <span className="tabular-nums text-white/80">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[.07]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-champagne-deep to-champagne-light"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.4, delay, ease }}
        />
      </div>
    </div>
  );
}

/** An illustration of the product: a report card, a live proctoring tile and a status chip. */
function ProductPreview() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:mx-0">
      <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-champagne/10 blur-3xl" />

      {/* main report card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease }}
        className="lx-glass relative rounded-[1.75rem] p-6 sm:p-7 sm:pb-[9.5rem]"
      >
        <div className="flex items-center justify-between">
          <p className="text-[.68rem] font-semibold uppercase tracking-[.24em] text-white/45">Candidate report</p>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[.65rem] text-white/60">Sample</span>
        </div>
        <div className="mt-5 flex items-center gap-5">
          <ScoreRing value={86} />
          <div>
            <p className="font-display text-3xl leading-none text-ivory">Overall signal</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-300/90">
              <ShieldCheck className="h-4 w-4" /> Integrity verified
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-3.5">
          <Bar label="Aptitude" value={88} delay={1.1} />
          <Bar label="Coding" value={92} delay={1.25} />
          <Bar label="Communication" value={79} delay={1.4} />
          <Bar label="Technical interview" value={84} delay={1.55} />
        </div>
        <p className="absolute bottom-6 right-7 hidden max-w-[11rem] text-right text-[.68rem] leading-5 text-white/40 sm:block">
          Generated automatically from every round, with the integrity log attached.
        </p>
      </motion.div>

      {/* live proctoring tile */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease }}
        className="absolute -bottom-14 -left-3 hidden w-[215px] sm:block lg:-left-14"
      >
        <div className="lx-glass animate-float-slow rounded-2xl p-3.5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-ink-700 to-ink-900">
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-b from-white/15 to-white/[.04]" />
            </div>
            <div className="absolute left-1/2 top-1/2 h-24 w-20 -translate-x-1/2 -translate-y-[55%] rounded-[40%] border border-champagne/50" />
            <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 text-[.6rem] text-white/80">
              <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-emerald-400" /> LIVE
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[.68rem] text-white/60">
            <span className="flex items-center gap-1.5"><Camera className="h-3.5 w-3.5 text-champagne" /> Face verified</span>
            <span className="flex items-center gap-1.5"><MonitorUp className="h-3.5 w-3.5 text-champagne" /> Screen</span>
          </div>
        </div>
      </motion.div>

      {/* status chip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 1.2, ease }}
        className="absolute -right-2 -top-5 hidden sm:block lg:-right-8"
      >
        <div className="lx-glass flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4 text-xs text-ivory">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /></span>
          Report ready
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero({ onCandidate, onRecruiter }: Props) {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 34 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section id="top" className="relative isolate overflow-hidden lx-grain">
      {/* atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-950" />
      <div aria-hidden="true" className="lx-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[640px] w-[640px] rounded-full bg-champagne/[.13] blur-[120px]" />
      <div aria-hidden="true" className="absolute -left-52 top-1/2 -z-10 h-[520px] w-[520px] rounded-full bg-indigo-500/[.08] blur-[130px]" />

      <div className="mx-auto grid max-w-7xl gap-20 px-5 pb-28 pt-32 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:pb-32 lg:pt-36">
        <div>
          <motion.p
            {...rise(0.25)}
            className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[.04] py-1.5 pl-2 pr-4 text-[.72rem] font-medium tracking-wide text-white/70"
          >
            <span className="rounded-full bg-champagne/15 px-2.5 py-0.5 text-[.65rem] font-semibold uppercase tracking-[.18em] text-champagne">New</span>
            Deterministic, auditable assessment
          </motion.p>

          <motion.h1
            {...rise(0.35)}
            className="font-display text-[3.3rem] leading-[.96] tracking-[-0.02em] text-ivory sm:text-[5rem] lg:text-[5.3rem]"
          >
            Hire for what people can <span className="lx-text-gold animate-shimmer italic">truly&nbsp;do.</span>
          </motion.h1>

          <motion.p {...rise(0.5)} className="mt-7 max-w-xl text-lg leading-8 text-white/60">
            Assessments, AI interviews and live proctoring in one considered workspace — so every decision rests on
            evidence you can explain, and talent never disappears into a résumé pile.
          </motion.p>

          <motion.div {...rise(0.65)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button onClick={onCandidate} className="lx-btn-gold group inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-[.95rem]">
              Take an assessment
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button onClick={onRecruiter} className="lx-btn-glass inline-flex h-14 items-center justify-center rounded-full px-8 text-[.95rem] font-medium">
              Explore for teams
            </button>
          </motion.div>

          <motion.ul {...rise(0.8)} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/50">
            {['Structured evaluation', 'Camera + screen proctoring', 'Explainable reports'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-champagne" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <ProductPreview />
      </div>

      {/* scroll cue */}
      <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[.65rem] uppercase tracking-[.3em] text-white/30 lg:flex">
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
