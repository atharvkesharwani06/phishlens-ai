import React from 'react';
import { Globe, Lock, Unlock, AlertTriangle, ShieldCheck, ExternalLink, Hash, Activity } from 'lucide-react';
import { UrlDetails } from '../types';
import { ThreatBadge } from './ThreatBadge';

interface UrlAnalysisCardProps {
  urlDetails: UrlDetails;
}

export const UrlAnalysisCard: React.FC<UrlAnalysisCardProps> = ({ urlDetails }) => {
  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/60 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-sm text-slate-100 font-mono tracking-wide">
            STATIC URL FORENSIC REPORT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Target Risk:</span>
          <ThreatBadge severity={urlDetails.risk_level} size="sm" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Sanitized URL Banner */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            {urlDetails.is_https ? (
              <span className="flex items-center gap-1 text-emerald-400 shrink-0 font-semibold">
                <Lock className="w-3.5 h-3.5" /> HTTPS
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 shrink-0 font-semibold">
                <Unlock className="w-3.5 h-3.5" /> INSECURE HTTP
              </span>
            )}
            <span className="text-slate-300 truncate">{urlDetails.url}</span>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            STATIC SCAN ONLY
          </span>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Apex Domain</span>
            <span className="text-xs font-mono font-bold text-slate-200 truncate block mt-0.5">
              {urlDetails.domain || 'N/A'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Subdomains</span>
            <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
              {urlDetails.subdomain_count} {urlDetails.subdomain_count >= 3 ? '⚠️ (Excessive)' : ''}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Domain Entropy</span>
            <span className="text-xs font-mono font-bold text-slate-200 block mt-0.5">
              {urlDetails.entropy} {urlDetails.entropy > 3.8 ? '🔥 (Randomized)' : ''}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Brand Spoofing</span>
            <span className={`text-xs font-mono font-bold block mt-0.5 ${urlDetails.brand_mismatch ? 'text-red-400' : 'text-emerald-400'}`}>
              {urlDetails.brand_match ? `${urlDetails.brand_match} (Spoofed)` : 'None Detected'}
            </span>
          </div>
        </div>

        {/* Flags and Anomalies */}
        {urlDetails.suspicious_patterns && urlDetails.suspicious_patterns.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-mono font-semibold text-slate-400 block mb-2">
              Detected Deception Indicators:
            </span>
            <ul className="space-y-1.5">
              {urlDetails.suspicious_patterns.map((pattern, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
