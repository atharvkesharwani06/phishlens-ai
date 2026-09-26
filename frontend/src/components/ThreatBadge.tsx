import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ThreatClassification, ThreatSeverity } from '../types';

interface ThreatBadgeProps {
  classification?: ThreatClassification;
  severity?: ThreatSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  classification,
  severity,
  size = 'md',
  showIcon = true,
}) => {
  // Determine color and styling based on classification or severity
  const isCritical = severity === 'CRITICAL' || classification === 'PHISHING';
  const isHigh = severity === 'HIGH';
  const isMedium = severity === 'MEDIUM' || classification === 'SUSPICIOUS';
  const isSafe = severity === 'LOW' || classification === 'SAFE';

  let bgClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = ShieldCheck;
  let label = classification || severity || 'UNKNOWN';

  if (isCritical) {
    bgClasses = 'bg-red-500/10 text-red-400 border-red-500/30 shadow-sm shadow-red-500/10';
    Icon = AlertOctagon;
  } else if (isHigh) {
    bgClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-sm shadow-orange-500/10';
    Icon = ShieldAlert;
  } else if (isMedium) {
    bgClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10';
    Icon = AlertTriangle;
  } else if (isSafe) {
    bgClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10';
    Icon = CheckCircle2;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono border uppercase tracking-wider ${bgClasses} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
