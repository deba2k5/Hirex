import { useEffect, useState } from 'react';
import { apiPost } from '@/lib/api';
import CompanySelect from './CompanySelect';
import ExamRunner from './ExamRunner';
import ExamReportsPage from './ExamReportsPage';
import ExamReport from './ExamReport';

interface CandidateFlowProps {
  onBack: () => void;
}

type Step = 'select_company' | 'exam' | 'reports' | 'report';

/** Orchestrates company selection -> continuously-proctored exam. */
const CandidateFlow = ({ onBack }: CandidateFlowProps) => {
  const [step, setStep] = useState<Step>('select_company');
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Tell the server this candidate is online, so recruiters see a live count.
  useEffect(() => {
    const ping = () => void apiPost('/api/auth/heartbeat', { page: step }).catch(() => {});
    ping();
    const t = window.setInterval(ping, 25_000);
    return () => window.clearInterval(t);
  }, [step]);

  if (step === 'select_company') {
    return (
      <CompanySelect
        onBack={onBack}
        onReports={() => setStep('reports')}
        onSessionReady={(id) => {
          setSessionId(id);
          setStep('exam');
        }}
      />
    );
  }

  if (step === 'exam' && sessionId) {
    return <ExamRunner sessionId={sessionId} onExamComplete={() => setStep('reports')} />;
  }

  if (step === 'reports') {
    return (
      <ExamReportsPage
        onSelectReport={(id) => {
          setSessionId(id);
          setStep('report');
        }}
        onBack={() => setStep('select_company')}
        onLogout={onBack}
      />
    );
  }

  if (step === 'report' && sessionId) {
    return (
      <div className="hirex-app-shell min-h-screen flex items-center justify-center p-4">
        <ExamReport sessionId={sessionId} onContinue={() => setStep('reports')} />
      </div>
    );
  }

  return null;
};

export default CandidateFlow;
