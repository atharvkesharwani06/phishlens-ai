import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Loader2, Sparkles, Cpu, Search, FileText } from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete?: () => void;
  inputType?: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ inputType = 'content' }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Input Received & Sanitized', icon: FileText, desc: 'Verifying encoding and parsing structures safely.' },
    { id: 2, title: 'Extracting Content & Indicators', icon: Search, desc: 'Isolating URLs, brand keywords, psychological triggers, and entity vectors.' },
    { id: 3, title: 'Analyzing Threat Patterns & URLs', icon: Shield, desc: 'Performing static URL entropy, domain validation, and spoofing checks.' },
    { id: 4, title: 'Running NLP AI Assessment', icon: Cpu, desc: 'Executing probabilistic TF-IDF and Bayesian linguistic threat classification.' },
    { id: 5, title: 'Generating Explainable Report', icon: Sparkles, desc: 'Assembling non-technical rationale, evidence highlighting, and defensive actions.' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 600);
    const timer2 = setTimeout(() => setCurrentStep(3), 1300);
    const timer3 = setTimeout(() => setCurrentStep(4), 2100);
    const timer4 = setTimeout(() => setCurrentStep(5), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md">
      {/* Radar scanning animation */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-cyan-500/60 animate-pulse"></div>
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400 flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h3 className="mt-4 font-mono font-bold text-lg text-white tracking-wide">
          DEEP FORENSIC SCAN IN PROGRESS
        </h3>
        <p className="text-xs text-cyan-400/80 font-mono mt-1">
          Analyzing {inputType} for deception & malicious vectors...
        </p>
      </div>

      {/* Steps Pipeline */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
                  : isDone
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                  : 'opacity-40 border-transparent text-slate-600'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <StepIcon className="w-5 h-5 text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    STEP {step.id}: {step.title}
                  </span>
                  {isDone && <span className="text-[10px] font-mono text-emerald-400">DONE</span>}
                  {isCurrent && <span className="text-[10px] font-mono text-cyan-400 animate-pulse">ANALYZING...</span>}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
