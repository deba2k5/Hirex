import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Brain,
  Code2,
  FileCheck2,
  Fingerprint,
  Languages,
  MessagesSquare,
  ScanFace,
  ScrollText,
  Sigma,
  Video,
} from 'lucide-react';
import { Reveal, SectionHeading, SpotlightCard } from './motion';

/* ------------------------------------------------------------------ trust bar */

const FACTS = [
  { value: '6', label: 'assessment rounds' },
  { value: '360°', label: 'candidate view' },
  { value: 'Identical', label: 'inputs, identical scores' },
  { value: 'Every', label: 'event logged & auditable' },
];

export function TrustBar() {
  return (
    <section aria-label="At a glance" className="relative border-y border-white/[.07] bg-ink-900/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
        {FACTS.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.07} y={16}>
            <div className="px-2 text-center lg:border-r lg:border-white/[.07] lg:last:border-0">
              <p className="font-display text-4xl text-ivory sm:text-5xl">{f.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[.2em] text-white/40">{f.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ platform */

const ROUNDS = [
  { icon: Sigma, label: 'Aptitude' },
  { icon: Languages, label: 'English communication' },
  { icon: Brain, label: 'AI literacy' },
  { icon: MessagesSquare, label: 'Technical interview' },
  { icon: Code2, label: 'Coding I' },
  { icon: Code2, label: 'Coding II' },
];

export function Platform() {
  return (
    <section id="platform" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-28 sm:px-8 lg:py-36">
      <Reveal>
        <SectionHeading eyebrow="The platform" title={<>Everything an assessment needs, <em className="text-champagne">nothing it doesn’t.</em></>}>
          One considered workspace replaces scattered tools and gut feeling, with an experience candidates respect and
          teams can trust.
        </SectionHeading>
      </Reveal>

      <div className="mt-16 grid auto-rows-[minmax(220px,auto)] gap-5 lg:grid-cols-6">
        {/* rounds */}
        <Reveal className="lg:col-span-4 lg:row-span-2">
          <SpotlightCard className="h-full p-8 sm:p-10">
            <p className="text-[.7rem] font-semibold uppercase tracking-[.26em] text-champagne">Six rounds, one flow</p>
            <h3 className="mt-4 max-w-md font-display text-4xl leading-tight text-ivory sm:text-5xl">Every angle of a candidate, in a single sitting.</h3>
            <p className="mt-4 max-w-lg leading-7 text-white/55">
              Mix and sequence rounds for each role. Candidates move through a calm, guided flow while the system captures the signal.
            </p>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {ROUNDS.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label + i}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/[.07] bg-white/[.03] px-4 py-3.5 text-[.95rem] text-ivory/90"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-champagne/10 text-champagne">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                  <span className="ml-auto font-display text-lg text-white/25">0{i + 1}</span>
                </motion.li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        {/* proctoring */}
        <Reveal delay={0.08} className="lg:col-span-2">
          <SpotlightCard className="h-full p-7">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-champagne/10 text-champagne"><ScanFace className="h-5 w-5" /></span>
            <h3 className="mt-6 font-display text-3xl text-ivory">Live proctoring</h3>
            <p className="mt-3 text-sm leading-6 text-white/55">Camera and screen-share monitoring with face detection runs quietly in the background.</p>
          </SpotlightCard>
        </Reveal>

        {/* ai interview */}
        <Reveal delay={0.14} className="lg:col-span-2">
          <SpotlightCard className="h-full p-7">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-champagne/10 text-champagne"><Video className="h-5 w-5" /></span>
            <h3 className="mt-6 font-display text-3xl text-ivory">AI interviews</h3>
            <p className="mt-3 text-sm leading-6 text-white/55">Technical questions drawn from the candidate’s own CV, answered by voice or text.</p>
          </SpotlightCard>
        </Reveal>

        {/* deterministic */}
        <Reveal delay={0.05} className="lg:col-span-3">
          <SpotlightCard className="h-full p-8">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-champagne/10 text-champagne"><Fingerprint className="h-5 w-5" /></span>
            <h3 className="mt-6 font-display text-3xl text-ivory sm:text-4xl">Deterministic scoring</h3>
            <p className="mt-3 max-w-md leading-7 text-white/55">
              Semantic similarity with keyword weighting. The same answer always earns the same score, so results are
              reproducible and defensible.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/[.08] bg-ink-900/70 px-4 py-2.5 font-mono text-xs text-champagne-light">
              score(a, b) = |A ∩ B| / |A ∪ B|
            </div>
          </SpotlightCard>
        </Reveal>

        {/* reports */}
        <Reveal delay={0.1} className="lg:col-span-3">
          <SpotlightCard className="h-full p-8">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-champagne/10 text-champagne"><BarChart3 className="h-5 w-5" /></span>
            <h3 className="mt-6 font-display text-3xl text-ivory sm:text-4xl">Reports that tell the story</h3>
            <p className="mt-3 max-w-md leading-7 text-white/55">
              Topic-level breakdowns turn every answer into an actionable candidate profile your whole team can read in minutes.
            </p>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ process */

const STEPS = [
  {
    n: '01',
    title: 'Assess every angle',
    text: 'Aptitude, communication, AI literacy, technical knowledge, coding and interviews in one guided flow.',
    icon: Code2,
  },
  {
    n: '02',
    title: 'Capture real signals',
    text: 'Proctoring, voice responses and structured answers are captured and scored consistently.',
    icon: Activity,
  },
  {
    n: '03',
    title: 'Decide with clarity',
    text: 'Topic-level reports and an event timeline turn the evidence into a confident, explainable yes or no.',
    icon: FileCheck2,
  },
];

export function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 border-y border-white/[.07] bg-ink-900/50">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:py-36">
        <Reveal>
          <SectionHeading center eyebrow="How it works" title={<>From first screen to <em className="text-champagne">confident yes.</em></>} />
        </Reveal>

        <div className="relative mt-20 grid gap-10 lg:grid-cols-3 lg:gap-8">
          <div aria-hidden="true" className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent lg:block" />
          {STEPS.map(({ n, title, text, icon: Icon }, i) => (
            <Reveal key={n} delay={i * 0.12}>
              <div className="relative text-center lg:px-6">
                <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-champagne/40 bg-ink-950 text-champagne shadow-[0_0_40px_-8px_rgba(216,185,122,.5)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-8 font-display text-6xl leading-none text-white/[.12]">{n}</p>
                <h3 className="-mt-3 font-display text-3xl text-ivory">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-7 text-white/55">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ integrity */

const LOG = [
  { t: '09:41:02', text: 'Session started · face detected', tone: 'ok' },
  { t: '09:41:30', text: 'Screen share active', tone: 'ok' },
  { t: '09:47:18', text: 'Round 1 submitted · aptitude scored', tone: 'ok' },
  { t: '09:52:11', text: 'Tab focus lost · event recorded', tone: 'warn' },
  { t: '09:52:14', text: 'Focus restored', tone: 'ok' },
  { t: '09:58:40', text: 'Round 2 submitted · report updated', tone: 'ok' },
];

export function Integrity() {
  return (
    <section id="integrity" className="relative mx-auto grid max-w-7xl scroll-mt-24 items-center gap-16 px-5 py-28 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:py-36">
      <Reveal>
        <SectionHeading eyebrow="Integrity" title={<>Trust you can <em className="text-champagne">show your work on.</em></>}>
          Every score, deduction and event is recorded. When someone asks why a candidate scored the way they did, you have
          the answer.
        </SectionHeading>
        <ul className="mt-10 space-y-5">
          {[
            ['Parameterised proctoring', 'Rules are explicit and consistent, never a black box.'],
            ['An event for everything', 'Focus changes, submissions and verification steps are time-stamped.'],
            ['Explainable by design', 'Scores trace back to the answers and rules that produced them.'],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-4">
              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-champagne/40 text-champagne">
                <ScrollText className="h-3 w-3" />
              </span>
              <div>
                <p className="font-medium text-ivory">{t}</p>
                <p className="mt-1 text-sm leading-6 text-white/50">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-full bg-champagne/[.07] blur-3xl" />
          <div className="lx-glass overflow-hidden rounded-[1.75rem]">
            <div className="flex items-center justify-between border-b border-white/[.07] px-6 py-4">
              <p className="text-[.68rem] font-semibold uppercase tracking-[.24em] text-white/45">Session timeline</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[.65rem] text-white/60">Illustrative</span>
            </div>
            <ol className="relative px-6 py-6">
              <span aria-hidden="true" className="absolute bottom-8 left-[6.2rem] top-8 w-px bg-gradient-to-b from-champagne/50 via-white/10 to-transparent" />
              {LOG.map((e, i) => (
                <motion.li
                  key={e.t}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="relative grid grid-cols-[4.5rem_1fr] items-center gap-6 py-3"
                >
                  <span className="font-mono text-xs tabular-nums text-white/40">{e.t}</span>
                  <span className="flex items-center gap-3 text-sm text-ivory/90">
                    <span
                      className={`relative z-10 -ml-[1.62rem] h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-ink-800 ${
                        e.tone === 'warn' ? 'bg-amber-400' : 'bg-champagne'
                      }`}
                    />
                    {e.text}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
