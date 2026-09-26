import React from 'react';
import { ThreatSeverity } from '../types';

interface RiskGaugeProps {
  score: number; // 0 - 100
  riskLevel: ThreatSeverity;
  confidence: number; // 0.0 - 1.0
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  confidence,
  size = 200,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Use 240 degrees arc for speedometer style
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // emerald
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  let levelText = 'LOW RISK';

  if (score >= 80 || riskLevel === 'CRITICAL') {
    strokeColor = '#EF4444'; // red
    glowColor = 'rgba(239, 68, 68, 0.4)';
    levelText = 'CRITICAL RISK';
  } else if (score >= 60 || riskLevel === 'HIGH') {
    strokeColor = '#F97316'; // orange
    glowColor = 'rgba(249, 115, 22, 0.35)';
    levelText = 'HIGH RISK';
  } else if (score >= 30 || riskLevel === 'MEDIUM') {
    strokeColor = '#FBBF24'; // amber
    glowColor = 'rgba(251, 191, 36, 0.35)';
    levelText = 'MEDIUM RISK';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 10px ${glowColor})`,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease',
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
              {score}
            </span>
            <span className="text-slate-400 font-mono text-sm ml-0.5">/100</span>
          </div>
          <span
            className="text-[11px] font-mono font-bold tracking-wider uppercase mt-1 px-2 py-0.5 rounded"
            style={{ color: strokeColor }}
          >
            {levelText}
          </span>
        </div>
      </div>

      {/* Confidence Pill */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
        <span className="text-slate-500">AI Confidence:</span>
        <span className="text-cyan-400 font-semibold">{Math.round(confidence * 100)}%</span>
      </div>
    </div>
  );
};
