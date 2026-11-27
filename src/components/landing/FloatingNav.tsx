import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { BrandMark, Wordmark } from './brand';

const LINKS = [
  { id: 'platform', label: 'Platform' },
  { id: 'process', label: 'How it works' },
  { id: 'integrity', label: 'Integrity' },
  { id: 'faq', label: 'FAQ' },
];

interface Props {
  onCandidate: () => void;
  onRecruiter: () => void;
}

/**
 * A pill-shaped glass nav that floats above the page: it tightens as you scroll,
 * highlights the section you are reading, shows reading progress along its lower edge,
 * and opens into a floating sheet on phones.
 */
export default function FloatingNav({ onCandidate, onRecruiter }: Props) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // scroll-spy: which section is in the middle of the screen
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5"
      >
        <nav
          aria-label="Primary"
          className={`floating-nav relative flex w-full items-center justify-between overflow-hidden rounded-full border transition-all duration-500 ${
            stuck
              ? 'max-w-[860px] border-white/[.14] bg-ink-900/75 py-2 pl-3 pr-2 backdrop-blur-2xl'
              : 'max-w-[980px] border-white/10 bg-ink-900/40 py-3 pl-4 pr-3 backdrop-blur-xl'
          }`}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            }}
            className="flex items-center gap-3 rounded-full pr-3"
            aria-label="Recruitix home"
          >
            <BrandMark className={`transition-all duration-500 ${stuck ? 'h-8 w-8' : 'h-9 w-9'}`} />
            <Wordmark className="hidden sm:inline" />
          </a>

          <ul className="relative hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const on = active === l.id;
              return (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className={`relative rounded-full px-4 py-2 text-[.82rem] font-medium tracking-wide transition-colors ${
                      on ? 'text-ivory' : 'text-white/55 hover:text-ivory'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[.09] ring-1 ring-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {l.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onCandidate}
              className="hidden rounded-full px-4 py-2 text-[.82rem] font-medium text-white/65 transition-colors hover:text-ivory sm:block"
            >
              Sign in
            </button>
            <button
              onClick={onRecruiter}
              className="lx-btn-gold hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-[.82rem] md:inline-flex"
            >
              For recruiters <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ivory md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* reading progress along the bottom edge of the pill */}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute inset-x-5 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-champagne to-transparent"
          />
        </nav>
      </motion.header>

      {/* mobile: a floating sheet under the pill */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm md:hidden"
            />
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="lx-glass fixed inset-x-3 top-[4.6rem] z-50 rounded-[2rem] p-3 md:hidden"
            >
              <ul className="flex flex-col">
                {LINKS.map((l, i) => (
                  <motion.li key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                    <button
                      onClick={() => go(l.id)}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-display text-2xl text-ivory transition-colors hover:bg-white/5"
                    >
                      {l.label}
                      <ArrowUpRight className="h-4 w-4 text-champagne" />
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-2 grid gap-2 border-t border-white/10 p-2 pt-4">
                <button onClick={() => { setOpen(false); onCandidate(); }} className="lx-btn-glass rounded-full py-3 text-sm font-medium">
                  Candidate sign in
                </button>
                <button onClick={() => { setOpen(false); onRecruiter(); }} className="lx-btn-gold rounded-full py-3 text-sm">
                  For recruiters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
