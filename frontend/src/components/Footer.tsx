import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#E2E8E5] bg-[#FFFFFF] text-[#697773] py-6 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-[#172321]">PhishLens AI</span>
            <span className="text-[#E2E8E5]">|</span>
            <span className="text-[#697773]">Department of Computer Science &amp; Engineering</span>
            <span className="text-[#E2E8E5]">|</span>
            <span className="text-[#697773] font-mono text-[11px]">v1.0.0-academic</span>
          </div>

          <div className="flex items-center gap-5 text-[#697773] text-xs font-medium">
            <Link to="/about" className="hover:text-[#087F75] transition-colors">How It Works</Link>
            <Link to="/learn" className="hover:text-[#087F75] transition-colors">Security Education</Link>
            <Link to="/demo" className="hover:text-[#087F75] transition-colors">Demo Center</Link>
            <Link to="/analyze" className="hover:text-[#087F75] transition-colors">Analyze</Link>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8E5]/70 text-[11px] text-[#697773] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#087F75]" />
            Static URL analysis protocol: targets are evaluated purely offline and never fetched or executed.
          </p>
          <p>
            Academic Engineering Prototype — Explainable Cyber Threat Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
};
