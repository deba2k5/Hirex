import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Clock, Sparkles, Bug } from 'lucide-react';
import type { QuestionBankRow } from '@/lib/examRounds';
import QuestionNavigator from './QuestionNavigator';

interface Coding2RoundViewProps {
  durationMin: number;
  questions: QuestionBankRow[];
  onSubmit: (result: { score: number; pct: number; answers: Record<string, string> }) => void;
}

const TOKEN_LIMIT = 2000;
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
const estimateTokens = (value: string) => Math.ceil(value.length / 4);

const Coding2RoundView = ({ durationMin, questions, onSubmit }: Coding2RoundViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState('Python');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [timeLeft, setTimeLeft] = useState(durationMin * 60);
  const question = questions[currentIndex];
  const maxPoints = useMemo(() => questions.reduce((sum, item) => sum + item.points, 0), [questions]);
  const usedTokens = estimateTokens(assistantPrompt);

  useEffect(() => {
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    if (!question || answers[question.id]) return;
    setAnswers((previous) => ({ ...previous, [question.id]: question.starterCode?.[language] ?? '' }));
  }, [answers, language, question]);

  const submit = () => {
    const score = questions.reduce((total, item) => total + (answers[item.id]?.trim() ? item.points : 0), 0);
    onSubmit({ score, pct: maxPoints ? Math.round((score / maxPoints) * 100) : 0, answers });
  };

  if (questions.length === 0) {
    return <div className="hirex-app-shell min-h-screen flex items-center justify-center text-white">No Coding 2 questions configured.</div>;
  }

  const isLast = currentIndex === questions.length - 1;
  const changeLanguage = (value: string) => {
    setLanguage(value);
    if (!answers[question.id]?.trim() || answers[question.id] === question.starterCode?.[language]) {
      setAnswers((previous) => ({ ...previous, [question.id]: question.starterCode?.[value] ?? '' }));
    }
  };

  return (
    <div className="hirex-app-shell min-h-screen p-4">
      <div className="max-w-6xl mx-auto py-8 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {question.mode === 'debugging' ? <Bug className="w-7 h-7 text-orange-400" /> : <Sparkles className="w-7 h-7 text-fuchsia-400" />}
            <h1 className="text-2xl font-bold text-white">Coding 2 · {question.mode === 'debugging' ? 'Debugging' : 'AI-Assisted DSA'}</h1>
          </div>
          <Badge className="bg-white/[.06] text-white flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(timeLeft)}</Badge>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
        <p className="text-white/55 text-sm">Task {currentIndex + 1} of {questions.length} · {question.category}</p>

        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_minmax(0,1fr)]">
          <QuestionNavigator questions={questions} currentIndex={currentIndex} answers={answers} onSelect={setCurrentIndex} />
          <Card className="hirex-card">
            <CardHeader><CardTitle className="text-white">{question.prompt}</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-white/75">
              <p>{question.description}</p>
              {question.caseStudy && <div><h3 className="font-semibold text-white mb-1">Case study</h3><p>{question.caseStudy}</p></div>}
              <div><h3 className="font-semibold text-white mb-1">Input</h3><p className="whitespace-pre-wrap">{question.inputFormat}</p></div>
              <div><h3 className="font-semibold text-white mb-1">Output</h3><p>{question.outputFormat}</p></div>
              <div><h3 className="font-semibold text-white mb-1">Constraints</h3><ul className="list-disc pl-5">{question.constraints?.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3 className="font-semibold text-white mb-2">Visible test cases ({question.visibleTestCases ?? 0})</h3>
                <div className="space-y-2">{question.examples?.map((example, index) => (
                  <div key={`${example.input}-${index}`} className="rounded border border-white/15 bg-white/[.06] p-2">
                    <p><span className="text-white/55">Input:</span> <code>{example.input}</code></p>
                    <p><span className="text-white/55">Output:</span> <code>{example.output}</code></p>
                    {example.explanation && <p className="text-white/55 mt-1">{example.explanation}</p>}
                  </div>
                ))}</div>
                <p className="text-xs text-white/40 mt-2">The evaluator also runs {question.hiddenTestCases ?? 0} hidden test cases.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hirex-card">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{question.mode === 'debugging' ? 'Corrected code' : 'Your solution'}</CardTitle>
                <select value={language} onChange={(event) => changeLanguage(event.target.value)} className="rounded border border-white/15 bg-white/[.06] px-3 py-2 text-sm text-white">
                  {(question.supportedLanguages ?? ['Python', 'C', 'C++', 'Java']).map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              {question.mode === 'ai_assisted' && (
                <div className="space-y-2 rounded border border-fuchsia-500/30 bg-fuchsia-950/20 p-3">
                  <div className="flex justify-between text-xs"><span className="text-fuchsia-200">AI assistance credits</span><span className={usedTokens > TOKEN_LIMIT ? 'text-red-300' : 'text-fuchsia-300'}>{Math.min(usedTokens, TOKEN_LIMIT)} / {TOKEN_LIMIT} tokens</span></div>
                  <textarea value={assistantPrompt} onChange={(event) => setAssistantPrompt(event.target.value.slice(0, TOKEN_LIMIT * 4))} placeholder="Ask for algorithm guidance or edge-case analysis..." className="min-h-20 w-full rounded border border-white/15 bg-ink-950/80 p-2 text-sm text-white" />
                  <p className="text-xs text-white/40">The final submitted answer must be your own code. Assistance is limited to 2,000 credits.</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <textarea value={answers[question.id] ?? ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [question.id]: event.target.value }))} spellCheck={false} className="min-h-[520px] w-full resize-y rounded border border-white/15 bg-ink-950/80 p-4 font-mono text-sm text-ivory outline-none focus:border-champagne/60" aria-label={`Coding 2 solution in ${language}`} />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex((value) => value - 1)} className="bg-transparent border-white/15 text-white/75 hover:bg-white/[.06]"><ChevronLeft className="w-4 h-4 mr-1" />Previous</Button>
          {isLast ? <Button onClick={submit} className="bg-green-600 hover:bg-green-700 text-white">Submit Coding 2</Button> : <Button onClick={() => setCurrentIndex((value) => value + 1)} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">Next<ChevronRight className="w-4 h-4 ml-1" /></Button>}
        </div>
      </div>
    </div>
  );
};

export default Coding2RoundView;
