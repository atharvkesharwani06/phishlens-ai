import React, { useState } from 'react';
import { AlertCircle, Sparkles, X, Info, ShieldAlert } from 'lucide-react';
import { HighlightSpan, ThreatSeverity } from '../types';
import { ThreatBadge } from './ThreatBadge';

interface InteractiveEvidenceViewerProps {
  originalText: string;
  highlights?: HighlightSpan[];
}

export const InteractiveEvidenceViewer: React.FC<InteractiveEvidenceViewerProps> = ({
  originalText,
  highlights = [],
}) => {
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightSpan | null>(
    highlights.length > 0 ? highlights[0] : null
  );

  // If no highlights or plain text, render plain view
  if (!originalText) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 text-sm italic">
        No original content preview available.
      </div>
    );
  }

  // Render text with interactive highlighted spans
  const renderHighlightedText = () => {
    if (!highlights || highlights.length === 0) {
      return <span className="text-slate-200 whitespace-pre-wrap">{originalText}</span>;
    }

    // Sort highlights by length descending to match longer phrases first
    const sortedHighlights = [...highlights].filter(h => h.text && h.text.trim().length > 0);
    
    // Create regex from highlight phrases
    const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const pattern = new RegExp(`(${sortedHighlights.map(h => escapeRegex(h.text)).join('|')})`, 'gi');
    
    const parts = originalText.split(pattern);

    return parts.map((part, idx) => {
      const matched = sortedHighlights.find(
        (h) => h.text.toLowerCase() === part.toLowerCase()
      );

      if (matched) {
        const isSelected = selectedHighlight?.text.toLowerCase() === matched.text.toLowerCase();
        let bgStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
        
        if (matched.severity === 'CRITICAL') {
          bgStyle = 'bg-red-500/25 text-red-200 border-red-500/50 hover:bg-red-500/40';
        } else if (matched.severity === 'HIGH') {
          bgStyle = 'bg-orange-500/25 text-orange-200 border-orange-500/50 hover:bg-orange-500/40';
        }

        return (
          <button
            key={idx}
            onClick={() => setSelectedHighlight(matched)}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-semibold border text-sm transition-all cursor-pointer underline decoration-dotted underline-offset-2 ${bgStyle} ${
              isSelected ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-lg shadow-cyan-500/20' : ''
            }`}
            title="Click to see why PhishLens flagged this phrase"
          >
            <span>{part}</span>
          </button>
        );
      }

      return <span key={idx} className="text-slate-200 whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/60 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-sm text-slate-100 font-mono tracking-wide">
            EXPLAINABLE EVIDENCE SCANNER
          </span>
        </div>
        <span className="text-xs text-cyan-400/90 font-mono flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Click any highlighted phrase to inspect AI reasoning
        </span>
      </div>

      {/* Main Text Content Area */}
      <div className="p-5 font-mono text-sm leading-relaxed border-b border-slate-800 bg-[#0A0F1D]/80">
        {renderHighlightedText()}
      </div>

      {/* Selected Indicator Explanation Drawer */}
      {selectedHighlight ? (
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-t border-cyan-500/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    WHY IS THIS SUSPICIOUS?
                  </span>
                  <ThreatBadge severity={selectedHighlight.severity} size="sm" />
                </div>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs text-slate-400">Flagged Phrase:</span>
                  <code className="text-xs font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    "{selectedHighlight.text}"
                  </code>
                </div>

                <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                  {selectedHighlight.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedHighlight(null)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-3 bg-slate-950 text-slate-500 text-xs font-mono flex items-center justify-between">
          <span>{highlights.length} threat patterns identified in text.</span>
          <span>Click any colored keyword to view forensic breakdown.</span>
        </div>
      )}
    </div>
  );
};
