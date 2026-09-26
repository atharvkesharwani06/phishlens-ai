import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck, AlertOctagon } from 'lucide-react';
import { DosAndDonts } from '../types';

interface DosAndDontsCardProps {
  dosAndDonts: DosAndDonts;
  isPhishing?: boolean;
}

export const DosAndDontsCard: React.FC<DosAndDontsCardProps> = ({
  dosAndDonts,
  isPhishing = true,
}) => {
  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
      <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-sm text-slate-100 font-mono tracking-wide">
            RECOMMENDED ACTIONS FOR USER SAFETY
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Non-Technical Defensive Protocol
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DO NOT Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
            <XCircle className="w-4 h-4 text-red-400" />
            <h4 className="font-bold text-sm text-red-400 font-mono uppercase tracking-wider">
              WHAT TO AVOID (DO NOT)
            </h4>
          </div>

          <ul className="space-y-2">
            {dosAndDonts.donts && dosAndDonts.donts.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-200 bg-red-500/5 border border-red-500/15 p-2.5 rounded-lg leading-relaxed font-sans"
              >
                <span className="text-red-400 shrink-0 font-bold">❌</span>
                <span>{item.replace(/^❌\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DO Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-emerald-400 font-mono uppercase tracking-wider">
              RECOMMENDED SAFE STEPS (DO)
            </h4>
          </div>

          <ul className="space-y-2">
            {dosAndDonts.dos && dosAndDonts.dos.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-200 bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-lg leading-relaxed font-sans"
              >
                <span className="text-emerald-400 shrink-0 font-bold">✅</span>
                <span>{item.replace(/^✅\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
