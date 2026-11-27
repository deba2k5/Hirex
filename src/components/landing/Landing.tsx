import FloatingNav from './FloatingNav';
import Hero from './Hero';
import { Integrity, Platform, Process, TrustBar } from './Sections';
import { Audiences, CtaBand, Faq, LuxFooter } from './Closing';
import Manifesto from './Manifesto';
import { Marquee, Preloader } from './fx';

interface Props {
  onCandidate: () => void;
  onRecruiter: () => void;
}

/** The public Recruitix landing page. */
export default function Landing({ onCandidate, onRecruiter }: Props) {
  return (
    <div className="hirex-home min-h-screen overflow-x-clip bg-ink-950 font-sans text-ivory selection:bg-champagne selection:text-ink-950">
      <Preloader />
      <FloatingNav onCandidate={onCandidate} onRecruiter={onRecruiter} />
      <main>
        <Hero onCandidate={onCandidate} onRecruiter={onRecruiter} />
        <Marquee words={['Aptitude', 'Communication', 'AI literacy', 'Interviews', 'Coding']} />
        <TrustBar />
        <Manifesto />
        <Platform />
        <Process />
        <Integrity />
        <Audiences onCandidate={onCandidate} onRecruiter={onRecruiter} />
        <Faq />
        <CtaBand onCandidate={onCandidate} />
      </main>
      <LuxFooter onCandidate={onCandidate} onRecruiter={onRecruiter} />
    </div>
  );
}
