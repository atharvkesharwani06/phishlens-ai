import React from 'react';
import { Shield, Loader2, Search, Cpu, CheckCheck, FileText } from 'lucide-react';

interface AnalysisLoaderProps {
  inputType?: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ inputType = 'content' }) => {
  const pipelineStages = [
    { id: 1, title: 'Input Sanitization', icon: FileText, desc: 'Normalizing UTF-8 encoding and safely isolating payload in memory.' },
    { id: 2, title: 'Entity & Linguistic Parsing', icon: Search, desc: 'Detecting urgency tokens, social engineering phrases, and target entities.' },
    { id: 3, title: 'Static Forensic Inspection', icon: Shield, desc: 'Evaluating Shannon domain entropy, high-risk TLDs, and heuristic indicators.' },
    { id: 4, title: 'Multi-Factor Risk Scoring', icon: Cpu, desc: 'Applying deterministic 50/30/20 weights across language and security rules.' },
    { id: 5, title: 'Defensive Protocol Assembly', icon: CheckCheck, desc: 'Synthesizing actionable DOs and DO NOTs with interactive highlighted evidence.' },
  ];

  const formatModality = (type: string) => {
    switch (type.toLowerCase()) {
      case 'url': return 'target link URL';
      case 'email': return 'email message & headers';
      case 'screenshot':
      case 'image': return 'screenshot OCR artifact';
      default: return 'text message';
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs animate-fade-in font-sans">
      {/* Header with active pulse and spinner */}
      <div className="flex flex-col items-center justify-center mb-6 text-center">
        <div className="relative w-12 h-12 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#087F75]" />
        </div>

        <h3 className="font-sans font-bold text-base text-[#172321] tracking-tight">
          Active Security Analysis in Progress
        </h3>
        <p className="text-xs text-[#697773] font-sans mt-1">
          Evaluating {formatModality(inputType)} across deterministic cybersecurity heuristics.
        </p>

        {/* Real-time indeterminate scanning track */}
        <div className="w-full max-w-xs h-1.5 bg-[#E2E8E5] rounded-full mt-4 overflow-hidden relative">
          <div className="absolute inset-y-0 w-1/3 bg-[#087F75] rounded-full animate-scan-beam" />
        </div>
      </div>

      {/* Genuine Inspection Pipeline Modules */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono font-semibold text-[#697773] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Engine Pipeline Stages</span>
          <span className="text-[#087F75] flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#087F75] animate-ping" />
            LIVE EVALUATION
          </span>
        </div>

        {pipelineStages.map((stage) => {
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className="flex items-start gap-3 p-2.5 rounded-lg border border-[#E2E8E5] bg-[#F7F8F6]/60 transition-colors"
            >
              <div className="mt-0.5 shrink-0 p-1 rounded bg-[#E6F4F1] text-[#087F75]">
                <StageIcon className="w-3.5 h-3.5 text-[#087F75]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold text-[#172321]">
                    {stage.id}. {stage.title}
                  </span>
                </div>
                <p className="text-[11px] text-[#697773] mt-0.5 leading-snug font-sans">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};