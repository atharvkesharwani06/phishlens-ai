import React from 'react';
import { Globe, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { UrlDetails } from '../types';
import { ThreatBadge } from './ThreatBadge';

interface UrlAnalysisCardProps {
  urlDetails: UrlDetails;
}

export const UrlAnalysisCard: React.FC<UrlAnalysisCardProps> = ({ urlDetails }) => {
  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F7F8F6] border-b border-[#E2E8E5]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#087F75]" />
          <span className="font-semibold text-xs text-[#172321] font-sans tracking-wide uppercase">
            Static URL Forensic Report
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans text-[#697773]">Risk Assessment:</span>
          <ThreatBadge severity={urlDetails.risk_level} size="sm" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Sanitized URL Banner */}
        <div className="bg-[#F7F8F6] p-3 rounded-lg border border-[#E2E8E5] flex items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            {urlDetails.is_https ? (
              <span className="flex items-center gap-1 text-[#39805A] shrink-0 font-semibold">
                <Lock className="w-3.5 h-3.5" /> HTTPS
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#C74747] shrink-0 font-semibold">
                <Unlock className="w-3.5 h-3.5" /> HTTP
              </span>
            )}
            <span className="text-[#172321] truncate font-mono">{urlDetails.url}</span>
          </div>
          <span className="text-[10px] font-mono text-[#697773] shrink-0 bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2E8E5]">
            OFFLINE INSPECTION
          </span>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[#F7F8F6]/80 border border-[#E2E8E5]">
            <span className="text-[10px] uppercase font-sans font-medium text-[#697773] block">Apex Domain</span>
            <span className="text-xs font-mono font-bold text-[#172321] truncate block mt-0.5">
              {urlDetails.domain || 'N/A'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7F8F6]/80 border border-[#E2E8E5]">
            <span className="text-[10px] uppercase font-sans font-medium text-[#697773] block">Subdomains</span>
            <span className="text-xs font-mono font-bold text-[#172321] block mt-0.5">
              {urlDetails.subdomain_count} {urlDetails.subdomain_count >= 3 ? '(Excessive)' : ''}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7F8F6]/80 border border-[#E2E8E5]">
            <span className="text-[10px] uppercase font-sans font-medium text-[#697773] block">Domain Entropy</span>
            <span className="text-xs font-mono font-bold text-[#172321] block mt-0.5">
              {urlDetails.entropy} {urlDetails.entropy > 3.8 ? '(High Randomness)' : ''}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7F8F6]/80 border border-[#E2E8E5]">
            <span className="text-[10px] uppercase font-sans font-medium text-[#697773] block">Brand Spoofing</span>
            <span className={`text-xs font-mono font-bold block mt-0.5 ${urlDetails.brand_mismatch ? 'text-[#C74747]' : 'text-[#39805A]'}`}>
              {urlDetails.brand_match ? `${urlDetails.brand_match} (Spoofed)` : 'None Detected'}
            </span>
          </div>
        </div>

        {/* Flags and Anomalies */}
        {urlDetails.suspicious_patterns && urlDetails.suspicious_patterns.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-sans font-semibold text-[#172321] block mb-2">
              Detected Deception Indicators:
            </span>
            <ul className="space-y-1.5">
              {urlDetails.suspicious_patterns.map((pattern, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#B77932] bg-[#B77932]/8 border border-[#B77932]/25 px-3 py-1.5 rounded-md font-sans">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B77932] shrink-0 mt-0.5" />
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
