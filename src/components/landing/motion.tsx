import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Fade-and-rise when scrolled into view. Respects reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A card with a soft champagne spotlight that follows the pointer, and an optional background photo. */
export function SpotlightCard({
  children,
  className = '',
  photo,
}: {
  children: ReactNode;
  className?: string;
  /** a background photograph: src, how it sits in the card, and its tone */
  photo?: { src: string; className?: string; tone?: 'ivory' | 'gold' };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative isolate overflow-hidden rounded-3xl border border-white/[.08] bg-ink-900/70 transition-colors duration-500 hover:border-champagne/30 ${className}`}
    >
      {photo && (
        <img
          src={photo.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={`pointer-events-none absolute z-0 max-w-none transition-all duration-[900ms] ease-out group-hover:scale-[1.05] group-hover:opacity-90 ${
            photo.tone === 'ivory' ? 'lx-tone-ivory' : 'lx-tone-gold'
          } ${photo.className ?? ''}`}
        />
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white/[.04] to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(216,185,122,.14), transparent 60%)' }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`mb-5 inline-flex items-center gap-3 text-[.72rem] font-semibold uppercase tracking-[.28em] text-champagne ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-champagne/60" />
        {eyebrow}
        {center && <span className="h-px w-8 bg-champagne/60" />}
      </p>
      <h2 className="font-display text-5xl leading-[1.02] tracking-tight text-ivory sm:text-6xl">{title}</h2>
      {children && <p className="mt-6 text-lg leading-8 text-white/60">{children}</p>}
    </div>
  );
}
