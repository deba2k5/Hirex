import { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppHeader, { HeaderButton } from '@/components/shell/AppHeader';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, BarChart3, CheckCircle, Clock, Eye, FileText, Loader, Search, ShieldAlert, Trash2, Users, X } from 'lucide-react';

interface SessionSummary {
  id: string;
  section: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  percentage: number | null;
  integrityScore: number | null;
  violations: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  year: string;
  department: string;
  enrollmentNo: string;
  enrollmentStatus: string;
  createdAt: string | null;
  sessions: SessionSummary[];
  completedAssessments: number;
  averagePercentage: number | null;
}

interface Overview {
  analytics: {
    registeredCandidates: number;
    completedAssessments: number;
    activeAssessments: number;
    averageScore: number;
    flaggedAssessments: number;
    liveCandidates: number;
  };
  candidates: Candidate[];
}

interface ReportSummary {
  report: {
    section: string | null;
    percentage: number;
    score: number;
    maxScore: number;
    answeredCount: number;
    unansweredCount: number;
    violations: Array<{ type: string; severity: string; message?: string }>;
  };
}

const sectionName = (section: string) => ({
  english: 'English Communication',
  aptitude: 'Hard Aptitude',
  ai_technical: 'AI & Technical',
  coding1: 'Coding 1',
  coding2: 'Coding 2',
  technical_interview: 'Technical Interview',
}[section] ?? section.replaceAll('_', ' '));

const dateLabel = (value: string | null) => value ? new Date(value).toLocaleString() : 'Not available';

const RecruiterPortal = ({ onBack }: { onBack: () => void }) => {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);
  const [report, setReport] = useState<ReportSummary['report'] | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOverview = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      setOverview(await apiGet<Overview>('/api/admin/overview'));
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : 'Unable to load admin data.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
    // keep the live-candidate count fresh without flashing the loader
    const t = window.setInterval(() => void loadOverview(true), 15_000);
    return () => window.clearInterval(t);
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return overview?.candidates ?? [];
    return (overview?.candidates ?? []).filter((candidate) =>
      [candidate.name, candidate.email, candidate.department, candidate.enrollmentNo].some((value) => value.toLowerCase().includes(query)),
    );
  }, [overview, search]);

  const openReport = async (session: SessionSummary) => {
    setSelectedSession(session);
    setReport(null);
    setReportLoading(true);
    try {
      const result = await apiGet<ReportSummary>(`/api/exam/sessions/${session.id}/report`);
      setReport(result.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load report.');
    } finally {
      setReportLoading(false);
    }
  };

  const deleteReport = async (session: SessionSummary) => {
    if (!window.confirm(`Delete the ${sectionName(session.section)} report? This permanently removes its assessment data.`)) return;
    try {
      await apiDelete(`/api/admin/sessions/${session.id}`);
      setSelectedSession(null);
      setReport(null);
      await loadOverview();
      setSelectedCandidate((candidate) => candidate ? { ...candidate, sessions: candidate.sessions.filter((item) => item.id !== session.id) } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete report.');
    }
  };

  const deleteCandidate = async () => {
    if (!selectedCandidate || !window.confirm(`Delete ${selectedCandidate.name || selectedCandidate.email} and all assessment data? This cannot be undone.`)) return;
    try {
      await apiDelete(`/api/admin/candidates/${selectedCandidate.id}`);
      setSelectedCandidate(null);
      setSelectedSession(null);
      setReport(null);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete candidate.');
    }
  };

  return (
    <div className="hirex-app-shell min-h-screen text-white">
      <AppHeader section="Recruiter workspace">
        <span className="mr-1 hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3.5 py-2 text-[.78rem] text-white/70 sm:inline-flex">
          <span className={`h-2 w-2 rounded-full ${(overview?.analytics.liveCandidates ?? 0) > 0 ? 'animate-pulse-ring bg-emerald-400' : 'bg-white/25'}`} />
          {overview?.analytics.liveCandidates ?? 0} live
        </span>
        <HeaderButton onClick={onBack}>Sign out</HeaderButton>
      </AppHeader>
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        <div className="pt-6"><p className="mb-4 inline-flex items-center gap-3 text-[.72rem] font-semibold uppercase tracking-[.28em] text-champagne"><span className="h-px w-8 bg-champagne/60" />Recruitix operations</p><h1 className="font-display text-5xl leading-[1] tracking-tight text-ivory sm:text-7xl">Candidate <em className="lx-text-gold">command center.</em></h1><p className="mt-5 max-w-2xl text-lg text-white/55">Review enrollment details, assessment progress, reports, and integrity signals in one place.</p></div>
        {error && <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
        {loading ? <div className="flex items-center justify-center py-24 text-white/70"><Loader className="mr-3 h-5 w-5 animate-spin" />Loading candidate records...</div> : overview && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {([
                ['Registered', overview.analytics.registeredCandidates, Users],
                ['Completed tests', overview.analytics.completedAssessments, CheckCircle],
                ['In progress', overview.analytics.activeAssessments, Clock],
                ['Average score', `${overview.analytics.averageScore}%`, BarChart3],
                ['Flagged', overview.analytics.flaggedAssessments, ShieldAlert],
              ] as Array<[string, string | number, LucideIcon]>).map(([label, value, Icon]) => <Card key={String(label)} className="hirex-card"><CardContent className="p-6"><span className="mb-5 grid h-10 w-10 place-items-center rounded-xl border border-champagne/25 bg-champagne/10 text-champagne"><Icon className="h-4 w-4" /></span><p className="font-display text-5xl leading-none text-ivory">{value}</p><p className="mt-3 text-[.7rem] font-semibold uppercase tracking-[.18em] text-white/45">{label}</p></CardContent></Card>)}
            </div>
            <Card className="hirex-card">
              <CardHeader className="flex flex-row items-center justify-between gap-4"><CardTitle>Registered candidates</CardTitle><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, department..." className="w-full rounded-full border border-white/15 bg-black/40 py-2 pl-9 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/40" /></div></CardHeader>
              <CardContent><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40"><tr><th className="px-3 py-3">Candidate</th><th className="px-3 py-3">Academic profile</th><th className="px-3 py-3">Assessments</th><th className="px-3 py-3">Average</th><th className="px-3 py-3">Action</th></tr></thead><tbody className="divide-y divide-white/10">{filteredCandidates.map((candidate) => <tr key={candidate.id} className="hover:bg-white/[.04]"><td className="px-3 py-4"><p className="font-medium">{candidate.name || 'Unnamed candidate'}</p><p className="text-xs text-white/40">{candidate.email}</p><p className="mt-1 text-xs text-slate-600">Joined {dateLabel(candidate.createdAt)}</p></td><td className="px-3 py-4 text-white/70"><p>{candidate.department || 'Department not provided'}</p><p className="text-xs text-white/40">{candidate.year} · {candidate.enrollmentNo}</p></td><td className="px-3 py-4"><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{candidate.completedAssessments} completed / {candidate.sessions.length} total</span></td><td className="px-3 py-4 font-semibold">{candidate.averagePercentage === null ? '—' : `${candidate.averagePercentage}%`}</td><td className="px-3 py-4"><Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => setSelectedCandidate(candidate)}><Eye className="mr-2 h-4 w-4" />View profile</Button></td></tr>)}</tbody></table>{filteredCandidates.length === 0 && <p className="py-12 text-center text-white/40">No candidates match this search.</p>}</div></CardContent>
            </Card>
          </>
        )}
      </main>
      {selectedCandidate && <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)}><aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0b0b0b] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-sm text-white/40">Candidate profile</p><h2 className="mt-1 text-2xl font-semibold">{selectedCandidate.name}</h2><p className="text-sm text-white/55">{selectedCandidate.email}</p></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="border-red-400/40 text-red-200 hover:bg-red-400/10" onClick={() => void deleteCandidate()}><Trash2 className="mr-2 h-4 w-4" />Delete candidate</Button><Button variant="ghost" size="icon" onClick={() => setSelectedCandidate(null)}><X /></Button></div></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-white/40">Department</p><p className="mt-1">{selectedCandidate.department || '—'}</p></div><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-white/40">Year</p><p className="mt-1">{selectedCandidate.year || '—'}</p></div><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-white/40">Enrollment no.</p><p className="mt-1">{selectedCandidate.enrollmentNo || '—'}</p></div><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-white/40">Account status</p><p className="mt-1 capitalize">{selectedCandidate.enrollmentStatus}</p></div></div><div className="mt-8"><h3 className="mb-3 text-lg font-semibold">Assessment reports</h3><div className="space-y-3">{selectedCandidate.sessions.length === 0 && <p className="text-sm text-white/40">No assessment sessions yet.</p>}{selectedCandidate.sessions.map((session) => <div key={session.id} className="rounded-xl border border-white/10 bg-white/[.04] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-medium capitalize">{sectionName(session.section)}</p><p className="text-xs text-white/40">{dateLabel(session.startedAt)}</p></div><Badge className={session.status === 'submitted' || session.status === 'auto_submitted' ? 'bg-white text-black' : 'bg-white/10 text-white'}>{session.status.replaceAll('_', ' ')}</Badge></div><div className="mt-4 flex items-center justify-between text-sm"><span className="text-white/55">Score: <strong className="text-white">{session.percentage === null ? '—' : `${session.percentage}%`}</strong></span><span className={session.violations ? 'text-red-300' : 'text-white/40'}>{session.violations} flags</span>      <div className="flex gap-2"><Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => void openReport(session)}><FileText className="mr-2 h-4 w-4" />Report</Button><Button size="sm" variant="outline" className="border-red-400/40 text-red-200 hover:bg-red-400/10" onClick={() => void deleteReport(session)} aria-label={`Delete ${sectionName(session.section)} report`}><Trash2 className="h-4 w-4" /></Button></div></div></div>)}</div></div>{selectedSession && <div className="mt-8 rounded-xl border border-white/15 bg-white/[.06] p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">{sectionName(selectedSession.section)} report</h3>{reportLoading && <Loader className="h-4 w-4 animate-spin" />}</div>{report && <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-white/40">Percentage</p><p className="text-2xl font-semibold">{report.percentage}%</p></div><div><p className="text-white/40">Raw score</p><p className="text-2xl font-semibold">{report.score}/{report.maxScore}</p></div><div><p className="text-white/40">Answered</p><p>{report.answeredCount}</p></div><div><p className="text-white/40">Unanswered</p><p>{report.unansweredCount}</p></div><div className="col-span-2"><p className="text-white/40">Integrity flags</p><p className={report.violations.length ? 'text-red-300' : 'text-emerald-300'}>{report.violations.length ? `${report.violations.length} flags require review` : 'No recorded flags'}</p></div></div>}</div>}</aside></div>}
    </div>
  );
};

export default RecruiterPortal;
