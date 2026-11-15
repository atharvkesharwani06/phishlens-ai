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
  const isCritical = severity === 'CRITICAL' || classification === 'PHISHING';
  const isHigh = severity === 'HIGH';
  const isMedium = severity === 'MEDIUM' || classification === 'SUSPICIOUS';
  const isSafe = severity === 'LOW' || classification === 'SAFE';

  let bgClasses = 'bg-[#F7F8F6] text-[#697773] border-[#E2E8E5]';
  let Icon = ShieldCheck;
  let label = classification || severity || 'UNKNOWN';

  if (isCritical) {
    bgClasses = 'bg-[#C74747]/8 text-[#C74747] border-[#C74747]/25';
    Icon = AlertOctagon;
  } else if (isHigh) {
    bgClasses = 'bg-[#B77932]/10 text-[#B77932] border-[#B77932]/30';
    Icon = ShieldAlert;
  } else if (isMedium) {
    bgClasses = 'bg-[#B77932]/8 text-[#B77932] border-[#B77932]/25';
    Icon = AlertTriangle;
  } else if (isSafe) {
    bgClasses = 'bg-[#39805A]/8 text-[#39805A] border-[#39805A]/25';
    Icon = CheckCircle2;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono font-semibold',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-mono font-semibold',
    lg: 'text-xs px-3 py-1 gap-1.5 font-mono font-bold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border uppercase tracking-wider ${bgClasses} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
    </span>
  );
};
