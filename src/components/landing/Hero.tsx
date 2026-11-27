import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Magnetic, RevealWords } from './fx';

interface Props {
  onCandidate: () => void;
  onRecruiter: () => void;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * Full-bleed hero: a human hand reaching toward a dotted, machine hand. The image drifts with
 * the pointer and with scroll, a spark pulses in the gap between the fingertips, and the
 * headline rises word by word over it.
 */
export default function Hero({ onCandidate, onRecruiter }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 60, damping: 22 });
  const py = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 60, damping: 22 });
  const glowX = useTransform(mx, [-1, 1], ['35%', '65%']);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink-950 lx-grain"
    >
      {/* the photograph */}
      <motion.div
        aria-hidden="true"
        style={{ y: imgY, scale: imgScale, x: px, translateY: py }}
        className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[86%]"
      >
        <img
          src="/img/creation-hands.webp"
          alt=""
          fetchPriority="high"
          className="lx-tone-ivory h-full w-full object-cover object-[62%_48%] opacity-80 [mask-image:linear-gradient(90deg,transparent_0%,#000_30%,#000_88%,transparent_100%)] lg:opacity-100"
        />
        {/* a spark where the two hands almost touch */}
        <span className="absolute left-[47%] top-[47%] hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <span className="absolute -inset-16 animate-pulse rounded-full bg-champagne/25 blur-3xl" />
          <span className="relative block h-2 w-2 rounded-full bg-champagne-light shadow-[0_0_24px_8px_rgba(241,223,180,.7)]" />
        </span>
      </motion.div>

      {/* depth: vignette + warm glow that follows the pointer */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_70%_45%,transparent_30%,#06070a_85%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink-950/90 to-transparent" />
      <motion.div
        aria-hidden="true"
        style={{ left: glowX }}
        className="absolute top-1/3 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-champagne/[.10] blur-[120px]"
      />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-40 sm:px-8 lg:pb-24"
      >
        <motion.p
          {...rise(0.2)}
          className="mb-8 flex items-center gap-4 text-[.72rem] font-medium uppercase tracking-[.3em] text-champagne"
        >
          <span className="h-px w-10 bg-champagne/70" />
          Human judgement · machine rigour
        </motion.p>

        <RevealWords
          as="h1"
          immediate
          delay={0.35}
          className="max-w-[16ch] font-display text-[3.6rem] leading-[.92] tracking-[-0.03em] text-ivory sm:text-[6.4rem] lg:text-[8.6rem]"
          parts={[{ t: 'Hire for what people can ' }, { t: 'truly do.', c: 'lx-text-gold italic' }]}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end">
          <motion.p {...rise(1.1)} className="text-lg leading-8 text-white/65 sm:text-xl sm:leading-9">
            Assessments, AI interviews and live proctoring in one considered workspace — so every decision rests on
            evidence you can explain.
          </motion.p>

          <motion.div {...rise(1.25)} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Magnetic>
              <button onClick={onCandidate} className="lx-btn-gold group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-9 text-[.95rem] sm:w-auto">
                Take an assessment
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={onRecruiter} className="lx-btn-glass inline-flex h-14 w-full items-center justify-center rounded-full px-9 text-[.95rem] font-medium sm:w-auto">
                Explore for teams
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.ul {...rise(1.45)} className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/50">
          {['Structured evaluation', 'Camera + screen proctoring', 'Explainable reports', 'Deterministic scoring'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-champagne" /> {t}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <div aria-hidden="true" className="absolute bottom-8 right-28 hidden flex-col items-center gap-3 text-[.62rem] uppercase tracking-[.32em] text-white/35 xl:flex">
        <span style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <span className="h-14 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
