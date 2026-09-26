import React from 'react';
import { 
  ClockAlert, 
  KeyRound, 
  Globe, 
  UserX, 
  DollarSign, 
  AlertTriangle, 
  FileWarning, 
  ShieldAlert 
} from 'lucide-react';
import { Indicator } from '../types';
import { ThreatBadge } from './ThreatBadge';

interface IndicatorCardProps {
  indicator: Indicator;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator }) => {
  // Choose icon based on indicator type
  const getIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes('URGENCY') || t.includes('TIME')) return ClockAlert;
    if (t.includes('CREDENTIAL') || t.includes('PASSWORD') || t.includes('OTP')) return KeyRound;
    if (t.includes('DOMAIN') || t.includes('URL')) return Globe;
    if (t.includes('IMPERSONATION') || t.includes('SENDER')) return UserX;
    if (t.includes('FINANCIAL') || t.includes('FEE') || t.includes('PRIZE')) return DollarSign;
    if (t.includes('FEAR') || t.includes('LEGAL')) return FileWarning;
    return ShieldAlert;
  };

  const Icon = getIcon(indicator.type);

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all p-4 flex flex-col justify-between shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700/80">
              <Icon className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-100 text-sm font-mono leading-tight">
              {indicator.title}
            </h4>
          </div>
          <ThreatBadge severity={indicator.severity} size="sm" />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          {indicator.description}
        </p>
      </div>

      {indicator.evidence && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block mb-1">
            FORENSIC EVIDENCE
          </span>
          <div className="text-xs font-mono text-amber-300 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800/80 break-words">
            {indicator.evidence}
          </div>
        </div>
      )}
    </div>
  );
};
