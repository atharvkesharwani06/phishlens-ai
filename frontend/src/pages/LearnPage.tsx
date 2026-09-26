import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ClockAlert, 
  Link2, 
  KeyRound, 
  ShieldAlert, 
  Package, 
  Gift, 
  ArrowRight, 
  RotateCcw, 
  Award 
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { EducationModule, QuizQuestion } from '../types';

export const LearnPage: React.FC = () => {
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modData, quizData] = await Promise.all([
          AnalysisService.getEducationModules(),
          AnalysisService.getQuizQuestions(),
        ]);
        setModules(modData);
        setQuestions(quizData);
      } catch (err) {
        console.error('Failed to load education data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSelectAnswer = (ans: boolean) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(ans);
    setIsAnswerSubmitted(true);

    const currentQ = questions[currentQuizIdx];
    if (ans === currentQ.is_phishing) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (currentQuizIdx + 1 < questions.length) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const currentQ = questions[currentQuizIdx];

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'urgency': return ClockAlert;
      case 'urls': return Link2;
      case 'otp': return KeyRound;
      case 'impersonation': return ShieldAlert;
      case 'parcel': return Package;
      case 'prize': return Gift;
      default: return BookOpen;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBER DEFENSE ACADEMY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          LEARN TO SPOT DIGITAL THREATS
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Master the psychological and technical tactics used by cyber criminals, and test your defensive reflexes in our interactive spot-the-phish simulator.
        </p>
      </div>

      {/* Interactive Quiz Simulator Section */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0A1020] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-white">
                SPOT-THE-PHISH INTERACTIVE QUIZ
              </h2>
              <p className="text-xs text-slate-400">Can you distinguish deceptive attacks from legitimate messages?</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Score: {score}/{questions.length}</span>
            <span>•</span>
            <span>Question {currentQuizIdx + 1} of {questions.length}</span>
          </div>
        </div>

        {!quizCompleted && currentQ ? (
          <div className="space-y-6">
            {/* Scenario Card */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>SCENARIO #{currentQ.id} • {currentQ.category.toUpperCase()}</span>
                {currentQ.sender && <span>Sender: {currentQ.sender}</span>}
              </div>

              <div className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed">
                "{currentQ.scenario}"
              </div>

              {currentQ.url && (
                <div className="text-xs text-cyan-400 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                  Target Link: {currentQ.url}
                </div>
              )}
            </div>

            {/* Question Prompt & Buttons */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-center font-mono text-slate-200">
                {currentQ.question}
              </h3>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectAnswer(true)}
                  className={`py-3 px-6 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    isAnswerSubmitted
                      ? currentQ.is_phishing
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : selectedAnswer === true
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 hover:scale-[1.02]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>SUSPICIOUS / PHISHING</span>
                </button>

                <button
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectAnswer(false)}
                  className={`py-3 px-6 rounded-xl font-mono text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    isAnswerSubmitted
                      ? !currentQ.is_phishing
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : selectedAnswer === false
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:scale-[1.02]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SAFE / LEGITIMATE</span>
                </button>
              </div>
            </div>

            {/* Answer Explanation Box */}
            {isAnswerSubmitted && (
              <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    {selectedAnswer === currentQ.is_phishing ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> CORRECT! Excellent cyber reflexes.
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> INCORRECT! Here is why this was a trap.
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Verdict: {currentQ.is_phishing ? 'PHISHING ATTACK' : 'LEGITIMATE COMMUNICATION'}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentQ.explanation}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentQ.indicators.map((ind, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                      • {ind}
                    </span>
                  ))}
                </div>

                <div className="pt-3 text-right">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <span>{currentQuizIdx + 1 === questions.length ? 'View Final Results' : 'Next Question'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold font-mono text-white">QUIZ COMPLETED!</h3>
            <p className="text-sm font-mono text-slate-300">
              You scored <strong className="text-cyan-400 text-lg">{score} / {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {score === questions.length
                ? 'Outstanding! You demonstrated expert-level threat recognition.'
                : 'Great effort! Review the defensive topic cards below to reinforce your cyber instincts.'}
            </p>
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </section>

      {/* 6 Defensive Learning Topic Cards */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white font-mono">
            CYBERSECURITY DEFENSIVE MODULES
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed breakdown of social engineering tricks, deceptive tactics, and defensive countermeasures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = getModuleIcon(mod.id);
            return (
              <div
                key={mod.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-mono font-bold text-slate-100 text-sm">
                      {mod.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                      <strong className="text-red-400 font-mono text-[11px] block uppercase mb-0.5">
                        WHAT IT LOOKS LIKE
                      </strong>
                      <p className="text-slate-300 font-mono text-[11px]">{mod.what_it_looks_like}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                      <strong className="text-amber-400 font-mono text-[11px] block uppercase mb-0.5">
                        WHY ATTACKERS USE IT
                      </strong>
                      <p className="text-slate-300 leading-snug">{mod.why_attackers_use_it}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <strong className="text-emerald-400 font-mono text-[11px] block uppercase mb-0.5">
                        HOW TO DEFEND YOURSELF
                      </strong>
                      <p className="text-slate-200 leading-snug">{mod.how_to_protect}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
