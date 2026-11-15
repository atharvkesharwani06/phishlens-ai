import React, { useState } from 'react';
import { Search, X, Info, ShieldAlert } from 'lucide-react';
import { HighlightSpan } from '../types';
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

  if (!originalText) {
    return (
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-sm italic">
        No content preview available for this entry.
      </div>
    );
  }

  const renderHighlightedText = () => {
    if (!highlights || highlights.length === 0) {
      return <span className="text-slate-800 whitespace-pre-wrap">{originalText}</span>;
    }

    const sortedHighlights = [...highlights].filter(h => h.text && h.text.trim().length > 0);
    const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const pattern = new RegExp(`(${sortedHighlights.map(h => escapeRegex(h.text)).join('|')})`, 'gi');
    
    const parts = originalText.split(pattern);

    return parts.map((part, idx) => {
      const matched = sortedHighlights.find(
        (h) => h.text.toLowerCase() === part.toLowerCase()
      );

      if (matched) {
        const isSelected = selectedHighlight?.text.toLowerCase() === matched.text.toLowerCase();
        let bgStyle = 'bg-[#B77932]/10 text-[#B77932] border-[#B77932]/30 hover:bg-[#B77932]/20';
        
        if (matched.severity === 'CRITICAL') {
          bgStyle = 'bg-[#C74747]/10 text-[#C74747] border-[#C74747]/30 hover:bg-[#C74747]/20';
        } else if (matched.severity === 'HIGH') {
          bgStyle = 'bg-[#B77932]/15 text-[#B77932] border-[#B77932]/35 hover:bg-[#B77932]/25';
        }

        return (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedHighlight(matched)}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono font-medium border text-xs transition-colors cursor-pointer ${bgStyle} ${
              isSelected ? 'ring-2 ring-[#087F75] ring-offset-1 font-semibold' : ''
            }`}
            title="Inspect forensic indicator details"
          >
            <span>{part}</span>
          </button>
        );
      }

      return <span key={idx} className="text-[#172321] whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] overflow-hidden shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F7F8F6] border-b border-[#E2E8E5]">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#087F75]" />
          <span className="font-semibold text-xs text-[#172321] font-sans tracking-wide uppercase">
            Interactive Evidence Span Viewer
          </span>
        </div>
        <span className="text-xs text-[#697773] font-sans flex items-center gap-1.5 hidden sm:flex">
          <Info className="w-3.5 h-3.5 text-[#697773]" />
          Click highlighted spans to inspect underlying rationale
        </span>
      </div>

      {/* Main Text Content Area */}
      <div className="p-5 font-mono text-xs leading-relaxed border-b border-[#E2E8E5] bg-[#FFFFFF] text-[#172321] overflow-x-auto">
        {renderHighlightedText()}
      </div>

      {/* Selected Indicator Explanation Drawer */}
      {selectedHighlight ? (
        <div className="p-4 bg-[#F7F8F6]/70 border-t border-[#E2E8E5]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75] mt-0.5">
                <ShieldAlert className="w-4 h-4 text-[#087F75]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-sans font-semibold text-[#172321]">
                    Detection Rationale:
                  </span>
                  <ThreatBadge severity={selectedHighlight.severity} size="sm" />
                </div>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs text-[#697773] font-sans">Flagged Token:</span>
                  <code className="text-xs font-mono font-semibold text-[#172321] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2E8E5]">
                    "{selectedHighlight.text}"
                  </code>
                </div>

                <p className="mt-2 text-xs text-[#172321] leading-relaxed font-sans">
                  {selectedHighlight.reason}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedHighlight(null)}
              className="text-[#697773] hover:text-[#172321] p-1 rounded hover:bg-[#E2E8E5]/50 transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-2.5 bg-[#F7F8F6] text-[#697773] text-xs font-sans flex items-center justify-between">
          <span>{highlights.length} suspicious pattern span(s) identified in input.</span>
          <span>Click any colored keyword to view forensic breakdown.</span>
        </div>
      )}
    </div>
  );
};
