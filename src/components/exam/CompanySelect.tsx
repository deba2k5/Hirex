import { useEffect, useState } from 'react';
import { ArrowRight, BrainCircuit, Calculator, Clock, Code2, Mic2, MessageSquareText, ShieldCheck, type LucideIcon } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import AppHeader, { HeaderButton } from '@/components/shell/AppHeader';
import { Reveal, SpotlightCard } from '@/components/landing/motion';

interface CompanySelectProps {
  onSessionReady: (sessionId: string) => void;
  onBack: () => void;
  onReports: () => void;
}

type Section = 'english' | 'aptitude' | 'ai_technical' | 'coding1' | 'coding2' | 'technical_interview';

interface SectionDef {
  key: Section;
  title: string;
  blurb: string;
  note: string;
  icon: LucideIcon;
  /** which duration field on the company record applies */
  minutes: string;
  fallbackMinutes: number;
  photo: string;
  photoClass: string;
}

const SECTIONS: SectionDef[] = [
  {
    key: 'aptitude',
    title: 'Hard Aptitude',
    blurb: '30 advanced MCQs covering quantitative reasoning and problem solving.',
    note: 'Camera and screen sharing for proctoring',
    icon: Calculator,
    minutes: 'aptitudeDurationMin',
    fallbackMinutes: 45,
    photo: '/img/creation-hands.webp',
    photoClass: '-right-10 -bottom-6 h-[80%] w-auto opacity-30',
  },
  {
    key: 'english',
    title: 'English Communication',
    blurb: 'Listening, reading, speaking, grammar and sentence formation.',
    note: 'Camera and screen sharing for proctoring',
    icon: MessageSquareText,
    minutes: 'englishDurationMin',
    fallbackMinutes: 45,
    photo: '/img/pixel-hands.webp',
    photoClass: '-right-12 -bottom-10 h-[95%] w-auto opacity-30',
  },
  {
    key: 'ai_technical',
    title: 'AI Literacy & Technical Knowledge',
    blurb: '40 MCQs: GenAI, agentic AI, RAG, LLMs, DBMS, OOP, networking and web development.',
    note: '20 AI literacy + 20 technical questions',
    icon: BrainCircuit,
    minutes: 'aiTechnicalDurationMin',
    fallbackMinutes: 60,
    photo: '/img/vapor-grid.webp',
    photoClass: '-right-8 top-0 h-full w-[55%] object-cover opacity-35',
  },
  {
    key: 'coding1',
    title: 'Coding I',
    blurb: 'Two real-time DSA problems with constraints, sample tests and hidden evaluation cases.',
    note: 'C, C++, Java or Python',
    icon: Code2,
    minutes: 'coding1DurationMin',
    fallbackMinutes: 75,
    photo: '/img/wire-face.webp',
    photoClass: '-right-8 -bottom-8 h-[88%] w-auto opacity-35',
  },
  {
    key: 'coding2',
    title: 'Coding II',
    blurb: 'An AI-assisted DSA case study and a debugging task, with a 2,000-token assistance budget.',
    note: 'Python, C, C++ or Java',
    icon: Code2,
    minutes: 'coding2DurationMin',
    fallbackMinutes: 60,
    photo: '/img/wire-hand.webp',
    photoClass: '-right-14 -bottom-12 h-[78%] w-auto opacity-35',
  },
  {
    key: 'technical_interview',
    title: 'Technical Interview',
    blurb: 'A voice-assisted interview built from your CV, with recorded answers.',
    note: 'Upload a readable CV and answer by voice',
    icon: Mic2,
    minutes: 'technicalInterviewDurationMin',
    fallbackMinutes: 30,
    photo: '/img/spotlight-desk.webp',
    photoClass: 'right-0 top-0 h-full w-[55%] object-cover opacity-35',
  },
];

/** The candidate's home: pick a section to begin. Each section has its own questions and timer. */
const CompanySelect = ({ onSessionReady, onBack, onReports }: CompanySelectProps) => {
  const { profile } = useAuthProfile();
  const [starting, setStarting] = useState<Section | null>(null);
  const [error, setError] = useState('');
  const [durations, setDurations] = useState<Record<string, number>>({});

  // Section lengths come from the seeded company record; fall back to the defaults if it is unavailable.
  useEffect(() => {
    apiGet<{ companies: Array<Record<string, unknown> & { slug: string }> }>('/api/companies')
      .then(({ companies }) => {
        const c = companies.find((x) => x.slug === 'general') ?? companies[0];
        if (!c) return;
        const out: Record<string, number> = {};
        for (const s of SECTIONS) {
          const v = c[s.minutes];
          if (typeof v === 'number') out[s.key] = v;
        }
        setDurations(out);
      })
      .catch(() => {});
  }, []);

  const startRound = async (section: Section) => {
    setStarting(section);
    setError('');
    try {
      const { sessionId } = await apiPost<{ sessionId: string }>('/api/exam/sessions', { section });
      onSessionReady(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start this section.');
      setStarting(null);
    }
  };

  const first = (profile?.displayName || '').trim().split(/\s+/)[0];

  return (
    <div className="hirex-app-shell min-h-screen pb-24">
      <AppHeader section="Assessments" user={{ name: profile?.displayName, email: profile?.email }}>
        <HeaderButton onClick={onReports}>My reports</HeaderButton>
        <HeaderButton onClick={onBack}>Log out</HeaderButton>
      </AppHeader>

      <main className="mx-auto max-w-[1120px] px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-3 text-[.72rem] font-semibold uppercase tracking-[.28em] text-champagne">
            <span className="h-px w-8 bg-champagne/60" /> Your assessments
          </p>
          <h1 className="font-display text-[3.2rem] leading-[.98] tracking-tight text-ivory sm:text-[5rem]">
            {first ? <>Welcome, <em className="lx-text-gold">{first}.</em></> : <>Choose a <em className="lx-text-gold">section.</em></>}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/55">
            Six sections, each with its own questions and timer. Begin whichever you like — you can return for the others any time.
          </p>
        </Reveal>

        {error && (
          <div role="alert" className="mt-8 rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const busy = starting === s.key;
            const mins = durations[s.key] ?? s.fallbackMinutes;
            return (
              <Reveal key={s.key} delay={(i % 3) * 0.08} y={22}>
                <SpotlightCard
                  className="h-full min-h-[22rem]"
                  photo={{ src: s.photo, tone: 'gold', className: `${s.photoClass} [mask-image:linear-gradient(200deg,#000_30%,transparent_85%)]` }}
                >
                  <div className="flex h-full flex-col p-7">
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-champagne/25 bg-champagne/10 text-champagne">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-5xl leading-none text-white/[.1]">0{i + 1}</span>
                    </div>

                    <h2 className="mt-7 font-display text-[1.9rem] leading-[1.05] text-ivory">{s.title}</h2>
                    <p className="mt-3 text-[.93rem] leading-6 text-white/55">{s.blurb}</p>

                    <ul className="mt-5 space-y-2 text-[.8rem] text-white/50">
                      <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-champagne" /> {mins} minutes</li>
                      <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-champagne" /> {s.note}</li>
                    </ul>

                    <div className="mt-auto pt-7">
                    <button
                      onClick={() => startRound(s.key)}
                      disabled={starting !== null}
                      className="lx-btn-gold group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[.9rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? 'Starting…' : 'Begin section'}
                      {!busy && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
                    </button>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 flex items-center gap-2 text-sm text-white/40">
          <ShieldCheck className="h-4 w-4 text-champagne/70" />
          You will be asked to allow camera and screen sharing when a proctored section begins.
        </p>
      </main>
    </div>
  );
};

export default CompanySelect;
