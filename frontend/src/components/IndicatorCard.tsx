import React from 'react';
import { 
  ClockAlert, 
  KeyRound, 
  Globe, 
  UserX, 
  DollarSign, 
  FileWarning, 
  ShieldAlert 
} from 'lucide-react';
import { Indicator } from '../types';
import { ThreatBadge } from './ThreatBadge';

interface IndicatorCardProps {
  indicator: Indicator;
}

const renderIndicatorIcon = (type: string) => {
  const t = type.toUpperCase();
  if (t.includes('URGENCY') || t.includes('TIME')) return <ClockAlert className="w-4 h-4 text-[#087F75]" />;
  if (t.includes('CREDENTIAL') || t.includes('PASSWORD') || t.includes('OTP')) return <KeyRound className="w-4 h-4 text-[#087F75]" />;
  if (t.includes('DOMAIN') || t.includes('URL')) return <Globe className="w-4 h-4 text-[#087F75]" />;
  if (t.includes('IMPERSONATION') || t.includes('SENDER')) return <UserX className="w-4 h-4 text-[#087F75]" />;
  if (t.includes('FINANCIAL') || t.includes('FEE') || t.includes('PRIZE')) return <DollarSign className="w-4 h-4 text-[#087F75]" />;
  if (t.includes('FEAR') || t.includes('LEGAL')) return <FileWarning className="w-4 h-4 text-[#087F75]" />;
  return <ShieldAlert className="w-4 h-4 text-[#087F75]" />;
};

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator }) => {
  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-4 flex flex-col justify-between shadow-xs hover:border-[#087F75]/30 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#E6F4F1] text-[#087F75] border border-[#087F75]/20">
              {renderIndicatorIcon(indicator.type)}
            </div>
            <h4 className="font-semibold text-[#172321] text-xs font-sans leading-tight">
              {indicator.title}
            </h4>
          </div>
          <ThreatBadge severity={indicator.severity} size="sm" />
        </div>

        <p className="text-xs text-[#697773] leading-relaxed mt-2 font-sans">
          {indicator.description}
        </p>
      </div>

      {indicator.evidence && (
        <div className="mt-3 pt-2.5 border-t border-[#E2E8E5]">
          <span className="text-[10px] uppercase tracking-wider font-sans text-[#697773] block mb-1 font-medium">
            Forensic Match
          </span>
          <div className="text-xs font-mono text-[#172321] bg-[#F7F8F6] px-2.5 py-1.5 rounded border border-[#E2E8E5] break-words">
            {indicator.evidence}
          </div>
        </div>
      )}
    </div>
  );
};
