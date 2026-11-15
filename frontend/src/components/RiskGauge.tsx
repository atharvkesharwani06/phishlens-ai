import React, { useEffect, useState, useRef } from 'react';
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
  const [displayedScore, setDisplayedScore] = useState<number>(score);
  const previousScoreRef = useRef<number>(score);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startScore = previousScoreRef.current;
    const targetScore = Math.max(0, Math.min(100, Math.round(score)));

    if (prefersReducedMotion || startScore === targetScore) {
      setDisplayedScore(targetScore);
      previousScoreRef.current = targetScore;
      return;
    }

    const duration = 600; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + (targetScore - startScore) * easeProgress);

      setDisplayedScore(currentScore);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        previousScoreRef.current = targetScore;
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [score]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayedScore / 100) * circumference;

  let strokeColor = '#39805A'; // success
  let levelText = 'LOW RISK';

  if (displayedScore >= 80 || riskLevel === 'CRITICAL') {
    strokeColor = '#C74747'; // danger
    levelText = 'CRITICAL RISK';
  } else if (displayedScore >= 60 || riskLevel === 'HIGH') {
    strokeColor = '#C74747'; // danger
    levelText = 'HIGH RISK';
  } else if (displayedScore >= 30 || riskLevel === 'MEDIUM') {
    strokeColor = '#B77932'; // warning
    levelText = 'MEDIUM RISK';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
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
            stroke="#E2E8E5"
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
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-[#172321] tabular-nums">
              {displayedScore}
            </span>
            <span className="text-[#697773] font-mono text-sm ml-0.5">/100</span>
          </div>
          <span
            className="text-[11px] font-mono font-bold tracking-wider uppercase mt-1 px-2 py-0.5 rounded transition-colors duration-300"
            style={{ color: strokeColor }}
          >
            {levelText}
          </span>
        </div>
      </div>

      {/* Confidence Pill */}
      <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-[#697773] bg-[#F7F8F6] px-3 py-1 rounded-full border border-[#E2E8E5] transition-colors">
        <span className="text-[#697773]">Model Confidence:</span>
        <span className="text-[#172321] font-semibold">{Math.round(confidence * 100)}%</span>
      </div>
    </div>
  );
};