import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { RevealWords } from './fx';
import { Reveal } from './motion';

const ease = [0.2, 0.8, 0.2, 1] as const;

function Bar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[.7rem] text-white/60">
        <span>{label}</span>
        <span className="tabular-nums text-white/85">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[.1]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-champagne-deep to-champagne-light"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay, ease }}
        />
      </div>
    </div>
  );
}

const PILLARS = [
  ['01', 'Human context', 'Interviews and open answers are judged in context, not reduced to a keyword.'],
  ['02', 'Machine consistency', 'The same input earns the same score every time, for every candidate.'],
  ['03', 'Shared evidence', 'Recruiters and candidates see the same record of what happened.'],
];

/**
 * The pixel-hands image grows into view as you scroll, with a sample report floating over it.
 */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clip = useTransform(scrollYProgress, [0.05, 0.35], ['inset(14% 14% 14% 14% round 2.5rem)', 'inset(0% 0% 0% 0% round 2rem)']);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['10%', '-14%']);

  return (
    <section ref={ref} className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-24 lg:py-40">
      <div className="relative">
        <motion.div style={{ clipPath: clip }} className="relative aspect-[4/4.4] overflow-hidden bg-ink-900">
          <motion.img
            src="/img/pixel-hands.webp"
            alt="Two hands made of pixels reaching toward one another across a window titled PROJECT.EXE"
            loading="lazy"
            style={{ scale, y }}
            className="lx-tone-ivory absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/30" />
        </motion.div>

        {/* a sample report resting on the image */}
        <motion.div style={{ y: cardY }} className="absolute -bottom-10 right-3 w-[min(19rem,78%)] sm:-right-8">
          <div className="lx-glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-[.62rem] font-semibold uppercase tracking-[.24em] text-white/50">Candidate report</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[.58rem] text-white/60">Sample</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="font-display text-5xl leading-none text-ivory">86</p>
              <p className="flex items-center gap-1.5 pb-1 text-xs text-emerald-300/90">
                <ShieldCheck className="h-3.5 w-3.5" /> Integrity verified
              </p>
            </div>
            <div className="mt-5 space-y-3">
              <Bar label="Aptitude" value={88} delay={0.2} />
              <Bar label="Coding" value={92} delay={0.35} />
              <Bar label="Communication" value={79} delay={0.5} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="lg:pl-6">
        <p className="mb-6 inline-flex items-center gap-3 text-[.72rem] font-semibold uppercase tracking-[.28em] text-champagne">
          <span className="h-px w-8 bg-champagne/60" /> Our approach
        </p>
        <h2 className="font-display text-5xl leading-[1] tracking-tight text-ivory sm:text-6xl">
          <RevealWords as="span" parts={[{ t: 'Where human judgement meets ' }, { t: 'machine rigour.', c: 'italic text-champagne' }]} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/60">
            Recruitix is built on a simple idea: technology should extend a hiring team’s judgement, not replace it. The
            machine is exacting and consistent; the people stay in charge.
          </p>
        </Reveal>
        <ul className="mt-12 divide-y divide-white/[.08] border-y border-white/[.08]">
          {PILLARS.map(([n, t, d], i) => (
            <Reveal key={n} delay={0.1 + i * 0.08} y={18}>
              <li className="group grid grid-cols-[3rem_1fr] gap-4 py-6 transition-colors">
                <span className="font-display text-2xl text-champagne/70 transition-colors group-hover:text-champagne">{n}</span>
                <div>
                  <p className="font-display text-3xl text-ivory">{t}</p>
                  <p className="mt-1.5 text-[.95rem] leading-6 text-white/50">{d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
