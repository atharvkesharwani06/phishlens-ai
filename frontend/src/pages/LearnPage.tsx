import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
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
  Award,
  Loader2
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [modData, quizData] = await Promise.all([
        AnalysisService.getEducationModules(),
        AnalysisService.getQuizQuestions(),
      ]);
      setModules(modData || []);
      setQuestions(quizData || []);
    } catch (err) {
      console.error('Failed to load education data:', err);
      setError('Unable to load educational scenarios from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 space-y-10 font-sans animate-page-enter">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75] text-xs font-medium mb-3 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-[#087F75]" />
          <span>Security Education &amp; Reflex Training</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172321] tracking-tight font-sans">
          Cyber Threat Defense Academy
        </h1>
        <p className="text-xs sm:text-sm text-[#697773] mt-1.5 leading-relaxed">
          Master the psychological and technical heuristics leveraged in digital social engineering, and test your instincts in the scenario simulator.
        </p>
      </div>

      {/* Interactive Quiz Simulator Section */}
      <section className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E2E8E5] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75]">
              <HelpCircle className="w-4 h-4 text-[#087F75]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172321] font-sans uppercase tracking-wide">
                Spot-The-Phish Verification Quiz
              </h2>
              <p className="text-xs text-[#697773] font-sans">Can you distinguish deceptive lures from verified legitimate messages?</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#172321] bg-[#F7F8F6] px-3 py-1 rounded-md border border-[#E2E8E5]">
            <span>Score: <strong className="text-[#087F75]">{score}/{questions.length}</strong></span>
            <span className="text-[#E2E8E5]">|</span>
            <span>Scenario {questions.length > 0 ? currentQuizIdx + 1 : 0} of {questions.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#697773] space-y-2 font-sans">
            <Loader2 className="w-5 h-5 animate-spin text-[#087F75]" />
            <span className="text-xs">Loading threat verification scenarios...</span>
          </div>
        ) : error && questions.length === 0 ? (
          <div className="py-8 text-center space-y-3 font-sans">
            <p className="text-xs text-[#C74747]">{error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="px-4 py-1.5 rounded-md bg-[#087F75] hover:bg-[#076c64] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : !quizCompleted && currentQ ? (
          <div className="space-y-5">
            {/* Scenario Card */}
            <div className="p-4 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] space-y-2.5 font-sans">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#697773]">
                <span>SCENARIO #{currentQ.id} • {currentQ.category.toUpperCase()}</span>
                {currentQ.sender && <span>Sender: <strong className="text-[#172321]">{currentQ.sender}</strong></span>}
              </div>

              <div className="text-xs sm:text-sm text-[#172321] font-mono leading-relaxed bg-[#FFFFFF] p-3 rounded border border-[#E2E8E5]">
                "{currentQ.scenario}"
              </div>

              {currentQ.url && (
                <div className="text-xs font-mono text-[#697773] bg-[#FFFFFF] p-2 rounded border border-[#E2E8E5] truncate">
                  Target Link: <span className="font-semibold text-[#087F75]">{currentQ.url}</span>
                </div>
              )}
            </div>

            {/* Question Prompt & Buttons */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-center font-sans text-[#172321] uppercase tracking-wide">
                {currentQ.question}
              </h3>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectAnswer(true)}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold font-sans active:scale-[0.98] transition-all duration-150 border flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-default ${
                    isAnswerSubmitted
                      ? currentQ.is_phishing
                        ? 'bg-[#C74747]/15 border-[#C74747] text-[#C74747] font-bold'
                        : selectedAnswer === true
                        ? 'bg-[#F7F8F6] border-[#E2E8E5] text-[#697773]'
                        : 'bg-[#FFFFFF] border-[#E2E8E5] text-[#697773]'
                      : 'bg-[#C74747]/10 hover:bg-[#C74747]/20 text-[#C74747] border-[#C74747]/30'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C74747]" />
                  <span>Suspicious / Phishing</span>
                </button>

                <button
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectAnswer(false)}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold font-sans active:scale-[0.98] transition-all duration-150 border flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-default ${
                    isAnswerSubmitted
                      ? !currentQ.is_phishing
                        ? 'bg-[#39805A]/15 border-[#39805A] text-[#39805A] font-bold'
                        : selectedAnswer === false
                        ? 'bg-[#F7F8F6] border-[#E2E8E5] text-[#697773]'
                        : 'bg-[#FFFFFF] border-[#E2E8E5] text-[#697773]'
                      : 'bg-[#39805A]/10 hover:bg-[#39805A]/20 text-[#39805A] border-[#39805A]/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#39805A]" />
                  <span>Safe / Legitimate</span>
                </button>
              </div>
            </div>

            {/* Answer Explanation Box */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {selectedAnswer === currentQ.is_phishing ? (
                      <span className="text-[#39805A] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-[#39805A]" /> Correct Assessment
                      </span>
                    ) : (
                      <span className="text-[#C74747] flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-[#C74747]" /> Incorrect Assessment
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#697773] uppercase">
                    True Class: {currentQ.is_phishing ? 'PHISHING' : 'LEGITIMATE'}
                  </span>
                </div>

                <p className="text-[#172321] leading-relaxed">
                  {currentQ.explanation}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentQ.indicators.map((ind, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E2E8E5] text-[#172321]">
                      • {ind}
                    </span>
                  ))}
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-4 py-1.5 rounded-md bg-[#087F75] hover:bg-[#076c64] text-white text-xs font-sans font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{currentQuizIdx + 1 === questions.length ? 'View Summary Score' : 'Next Scenario'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center space-y-3 font-sans">
            <div className="w-12 h-12 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#172321] font-sans">Quiz Completed</h3>
            <p className="text-xs font-sans text-[#697773]">
              You correctly classified <strong className="font-mono text-[#087F75] text-sm">{score} of {questions.length}</strong> scenarios ({Math.round((score / (questions.length || 1)) * 100)}%).
            </p>
            <p className="text-xs text-[#697773] max-w-md mx-auto">
              Review the detailed defensive modules below to inspect how individual technical indicators operate.
            </p>
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="px-4 py-2 rounded-lg bg-[#087F75] hover:bg-[#076c64] text-white text-xs font-sans font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Exercise</span>
            </button>
          </div>
        )}
      </section>

      {/* 6 Defensive Learning Topic Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#172321] font-sans uppercase tracking-wide">
            Defensive Cybersecurity Modules
          </h2>
          <p className="text-xs text-[#697773] mt-0.5">
            Technical and behavioral breakdowns of social engineering mechanisms and mitigations.
          </p>
        </div>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center text-[#697773] text-xs font-sans">
            <Loader2 className="w-4 h-4 animate-spin text-[#087F75] mr-2" />
            <span>Loading defensive modules...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => {
              const Icon = getModuleIcon(mod.id);
              return (
                <div
                  key={mod.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 flex flex-col justify-between shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 space-y-3"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="p-1.5 rounded-md bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-sans font-bold text-[#172321] text-xs">
                        {mod.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#697773] leading-relaxed mb-3 font-sans">
                      {mod.description}
                    </p>

                    <div className="space-y-2 font-sans text-xs">
                      <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5]">
                        <strong className="text-[#172321] text-[10px] uppercase block mb-0.5 font-semibold">
                          Typical Pattern
                        </strong>
                        <p className="text-[#697773] font-mono text-[11px] leading-snug">{mod.what_it_looks_like}</p>
                      </div>

                      <div className="p-2.5 rounded-md bg-[#B77932]/10 border border-[#B77932]/25">
                        <strong className="text-[#B77932] text-[10px] uppercase block mb-0.5 font-bold">
                          Attacker Motivation
                        </strong>
                        <p className="text-[#172321] text-xs leading-snug">{mod.why_attackers_use_it}</p>
                      </div>

                      <div className="p-2.5 rounded-md bg-[#39805A]/10 border border-[#39805A]/25">
                        <strong className="text-[#39805A] text-[10px] uppercase block mb-0.5 font-bold">
                          Defense Protocol
                        </strong>
                        <p className="text-[#172321] text-xs leading-snug">{mod.how_to_protect}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};