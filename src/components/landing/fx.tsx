import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { BrandMark } from './brand';

const ease = [0.2, 0.8, 0.2, 1] as const;

/* -------------------------------------------------------------------------
   Word-by-word headline: each word rises out of a mask.
   ------------------------------------------------------------------------- */
export type Part = { t: string; c?: string };

export function RevealWords({
  parts,
  className = '',
  delay = 0,
  as: Tag = 'h2',
  immediate = false,
}: {
  parts: Part[];
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** animate on mount instead of when scrolled into view */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  const reduce = useReducedMotion();
  const go = immediate || inView;
  let i = 0;
  const Comp = motion[Tag] as typeof motion.h2;
  return (
    <Comp ref={ref as never} className={className} aria-label={parts.map((p) => p.t).join('')}>
      {parts.map((p, pi) =>
        p.t.split(/(\s+)/).map((w, wi) => {
          if (/^\s+$/.test(w) || w === '') return w ? ' ' : null;
          const idx = i++;
          return (
            <span key={`${pi}-${wi}`} aria-hidden="true" className="inline-block overflow-hidden pb-[.12em] align-bottom">
              <motion.span
                className={`inline-block will-change-transform ${p.c ?? ''}`}
                initial={reduce ? false : { y: '115%', rotate: 3 }}
                animate={go ? { y: '0%', rotate: 0 } : undefined}
                transition={{ duration: 1, ease, delay: delay + idx * 0.07 }}
              >
                {w}
              </motion.span>
            </span>
          );
        }),
      )}
    </Comp>
  );
}

/* -------------------------------------------------------------------------
   A button that leans toward the pointer.
   ------------------------------------------------------------------------- */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const reduce = useReducedMotion();
  const move = (e: MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={move} onMouseLeave={leave} className="inline-block">
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   Large outlined words drifting across the page.
   ------------------------------------------------------------------------- */
export function Marquee({ words }: { words: string[] }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {words.map((w) => (
        <span key={w} className="flex items-center gap-10">
          <span className="lx-outline font-display text-[clamp(3.2rem,8vw,7rem)] leading-none">{w}</span>
          <span className="text-champagne/70">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-white/[.07] bg-ink-950 py-9">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   An image slot: fades up, warms to gold on hover, and can drift with scroll.
   ------------------------------------------------------------------------- */
export function Photo({
  src,
  tone = 'ivory',
  className = '',
  imgClassName = '',
  alt = '',
}: {
  src: string;
  tone?: 'ivory' | 'gold' | 'raw';
  className?: string;
  imgClassName?: string;
  alt?: string;
}) {
  const tones = { ivory: 'lx-tone-ivory', gold: 'lx-tone-gold', raw: '' } as const;
  return (
    <div className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${tones[tone]} ${imgClassName}`} />
    </div>
  );
}

/* -------------------------------------------------------------------------
   One-time intro curtain per browser session.
   ------------------------------------------------------------------------- */
export function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem('rx-intro') !== '1';
    } catch {
      return false;
    }
  });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!show) return;
    if (reduce) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem('rx-intro', '1');
      } catch {
        /* private mode */
      }
    }, 1500);
    return () => window.clearTimeout(t);
  }, [show, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink-950"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease }}>
              <BrandMark className="h-16 w-16" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="font-display text-4xl text-ivory"
            >
              Recruit<span className="italic text-champagne">ix</span>
            </motion.p>
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <motion.div className="h-full bg-champagne" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
