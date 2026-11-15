import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { DosAndDonts } from '../types';

interface DosAndDontsCardProps {
  dosAndDonts: DosAndDonts;
  isPhishing?: boolean;
}

export const DosAndDontsCard: React.FC<DosAndDontsCardProps> = ({
  dosAndDonts,
  isPhishing: _isPhishing = true,
}) => {
  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] overflow-hidden shadow-xs">
      <div className="px-5 py-3 bg-[#F7F8F6] border-b border-[#E2E8E5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#087F75]" />
          <span className="font-semibold text-xs text-[#172321] font-sans tracking-wide uppercase">
            Defensive Guidance &amp; Recommended Actions
          </span>
        </div>
        <span className="text-xs font-sans text-[#697773]">
          Operator Action Protocol
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DO NOT Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#C74747]/20">
            <XCircle className="w-4 h-4 text-[#C74747]" />
            <h4 className="font-bold text-xs text-[#C74747] font-sans uppercase tracking-wider">
              Strictly Avoid (Do Not)
            </h4>
          </div>

          <ul className="space-y-2">
            {dosAndDonts.donts && dosAndDonts.donts.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-[#172321] bg-[#C74747]/6 border border-[#C74747]/20 p-2.5 rounded-md leading-relaxed font-sans"
              >
                <span className="text-[#C74747] shrink-0 font-bold">✕</span>
                <span>{item.replace(/^❌\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DO Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#39805A]/20">
            <CheckCircle2 className="w-4 h-4 text-[#39805A]" />
            <h4 className="font-bold text-xs text-[#39805A] font-sans uppercase tracking-wider">
              Recommended Remediation (Do)
            </h4>
          </div>

          <ul className="space-y-2">
            {dosAndDonts.dos && dosAndDonts.dos.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-[#172321] bg-[#39805A]/6 border border-[#39805A]/20 p-2.5 rounded-md leading-relaxed font-sans"
              >
                <span className="text-[#39805A] shrink-0 font-bold">✓</span>
                <span>{item.replace(/^✅\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
