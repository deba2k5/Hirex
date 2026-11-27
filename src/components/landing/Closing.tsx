import { ArrowRight, Github } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrandMark, BRAND, Wordmark } from './brand';
import { Reveal, SectionHeading, SpotlightCard } from './motion';
import { Magnetic, RevealWords } from './fx';

interface Handlers {
  onCandidate: () => void;
  onRecruiter: () => void;
}

/* ------------------------------------------------------------------ audiences */

export function Audiences({ onCandidate, onRecruiter }: Handlers) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8 lg:pb-36">
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal>
          <SpotlightCard
            className="h-full min-h-[26rem] p-9 sm:p-12"
            photo={{ src: '/img/wire-hand.webp', tone: 'gold', className: '-bottom-24 -right-32 h-[82%] w-auto opacity-40 [mask-image:linear-gradient(215deg,#000_25%,transparent_80%)]' }}
          >
            <p className="text-[.7rem] font-semibold uppercase tracking-[.26em] text-champagne">For candidates</p>
            <h3 className="mt-5 font-display text-4xl leading-tight text-ivory sm:text-5xl">A fair chance to show what you can do.</h3>
            <p className="mt-5 max-w-md leading-7 text-white/55">
              Clear instructions, a calm interface and consistent scoring. Prove your skills on your own terms, not
              through a résumé keyword.
            </p>
            <button onClick={onCandidate} className="lx-btn-glass group mt-9 inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium">
              Start an assessment <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </SpotlightCard>
        </Reveal>
        <Reveal delay={0.1}>
          <SpotlightCard
            className="h-full min-h-[26rem] p-9 sm:p-12"
            photo={{ src: '/img/wire-face.webp', tone: 'gold', className: '-bottom-10 -right-10 h-[96%] w-auto opacity-45 [mask-image:linear-gradient(215deg,#000_25%,transparent_80%)]' }}
          >
            <p className="text-[.7rem] font-semibold uppercase tracking-[.26em] text-champagne">For recruiters</p>
            <h3 className="mt-5 font-display text-4xl leading-tight text-ivory sm:text-5xl">Evidence your team can act on.</h3>
            <p className="mt-5 max-w-md leading-7 text-white/55">
              Track candidates in real time, compare reports side by side and decide with a full audit trail behind every call.
            </p>
            <button onClick={onRecruiter} className="lx-btn-gold group mt-9 inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm">
              Open the recruiter portal <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ faq */

const FAQ = [
  {
    q: 'How does proctoring work?',
    a: 'During an exam, camera and screen-share monitoring run alongside the questions. Events such as face detection and focus changes are recorded with a time-stamp and included in the candidate’s report.',
  },
  {
    q: 'Is scoring really deterministic?',
    a: 'Yes. Scoring uses semantic similarity with keyword weighting and event-driven rules, so identical inputs always produce identical results. Every score and deduction is logged so it can be explained and audited.',
  },
  {
    q: 'What do candidates need?',
    a: 'A modern browser, a working camera and microphone, a stable connection, and permission to share their screen for proctored rounds.',
  },
  {
    q: 'Which roles can I assess?',
    a: 'Assessments cover roles such as Software Engineer, AI/ML Engineer, Data Scientist and Product Manager, with rounds that combine aptitude, communication, technical and coding evaluation.',
  },
  {
    q: 'Who can see a candidate’s report?',
    a: 'Reports are available to the hiring team through the recruiter portal. Candidates sign in with their own account to take assessments.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 border-y border-white/[.07] bg-ink-900/50">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:py-36">
        <Reveal>
          <SectionHeading eyebrow="Questions" title={<RevealWords as="span" parts={[{ t: 'Good things to ' }, { t: 'know.', c: 'italic text-champagne' }]} />}>
            The short answers to what teams and candidates ask most.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-white/[.09]">
                <AccordionTrigger className="py-6 text-left font-display text-2xl font-normal text-ivory hover:no-underline sm:text-[1.7rem] [&[data-state=open]]:text-champagne-light">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-7 text-white/55">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ cta */

export function CtaBand({ onCandidate }: Pick<Handlers, 'onCandidate'>) {
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-champagne/25 px-6 py-24 text-center sm:px-16 lg:py-36">
          <img
            src="/img/creation-hands.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="lx-tone-gold absolute inset-0 -z-10 h-full w-full -scale-x-100 object-cover object-[50%_50%] opacity-45"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,rgba(6,7,10,.2),rgba(6,7,10,.88)_75%)]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950/70" />
          <h2 className="mx-auto max-w-4xl font-display text-5xl leading-[.98] tracking-tight text-ivory sm:text-7xl lg:text-8xl">
            <RevealWords as="span" parts={[{ t: 'Make your next hire ' }, { t: 'your best one.', c: 'lx-text-gold italic' }]} />
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/70">
            Start with a fair, focused assessment experience built for the way modern teams hire.
          </p>
          <div className="mt-11">
            <Magnetic>
              <button onClick={onCandidate} className="lx-btn-gold group inline-flex h-14 items-center gap-2 rounded-full px-10 text-[.95rem]">
                Get started with {BRAND.name}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ footer */

export function LuxFooter({ onCandidate, onRecruiter }: Handlers) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const col = 'text-sm text-white/50 transition-colors hover:text-ivory';
  return (
    <footer className="border-t border-white/[.07] bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark />
            <Wordmark />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/45">
            Deterministic, auditable assessment and live integrity validation for fair, evidence-based hiring.
          </p>
          <a
            href={BRAND.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Recruitix on GitHub"
            className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-champagne/50 hover:text-champagne"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
        <nav aria-label="Product" className="grid content-start gap-3">
          <p className="mb-2 text-[.7rem] font-semibold uppercase tracking-[.24em] text-champagne">Product</p>
          <button className={`${col} text-left`} onClick={() => go('platform')}>Platform</button>
          <button className={`${col} text-left`} onClick={() => go('process')}>How it works</button>
          <button className={`${col} text-left`} onClick={() => go('integrity')}>Integrity</button>
          <button className={`${col} text-left`} onClick={() => go('faq')}>FAQ</button>
        </nav>
        <nav aria-label="Get started" className="grid content-start gap-3">
          <p className="mb-2 text-[.7rem] font-semibold uppercase tracking-[.24em] text-champagne">Get started</p>
          <button className={`${col} text-left`} onClick={onCandidate}>Candidate sign in</button>
          <button className={`${col} text-left`} onClick={onRecruiter}>Recruiter portal</button>
        </nav>
      </div>
      <div aria-hidden="true" className="relative overflow-hidden border-t border-white/[.06] select-none">
        <p className="lx-outline whitespace-nowrap text-center font-display text-[clamp(5rem,23vw,22rem)] leading-[.8] tracking-tight [mask-image:linear-gradient(180deg,#000_10%,transparent_95%)]">
          Recruitix
        </p>
      </div>
      <div className="border-t border-white/[.06]">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/35 sm:px-8">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
