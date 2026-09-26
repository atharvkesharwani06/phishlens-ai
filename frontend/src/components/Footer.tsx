import React from 'react';
import { Shield, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#060910] text-slate-400 py-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Security Systems Operational</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono">PhishLens v1.0 AI Core</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <Link to="/about" className="hover:text-cyan-400 transition-colors">How It Works</Link>
            <Link to="/learn" className="hover:text-cyan-400 transition-colors">Security Education</Link>
            <Link to="/demo" className="hover:text-cyan-400 transition-colors">Demo Center</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Hackathon Edition</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/40 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            Static URL analysis protocol: Targets are never automatically visited or executed.
          </p>
          <p>
            PhishLens AI — "Understand the threat before you click."
          </p>
        </div>
      </div>
    </footer>
  );
};
