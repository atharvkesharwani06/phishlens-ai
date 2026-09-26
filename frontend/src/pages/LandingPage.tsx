import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  Lock, 
  Eye, 
  Cpu, 
  Zap 
} from 'lucide-react';
import { ThreatBadge } from '../components/ThreatBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16">
        {/* Background ambient glowing gradient spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-sm shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPLAINABLE CYBERSECURITY DEFENSE SYSTEM</span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans">
            PHISH<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">LENS</span> AI
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-mono text-cyan-300 tracking-wide">
            "Understand the threat before you click."
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered phishing detection that doesn't just warn you — it visually <strong className="text-white">explains why</strong> a message, URL, email, or screenshot may be dangerous and guides your next safe action.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 group"
            >
              <Search className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Analyze Something</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              to="/demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Try Live Demo Scenarios</span>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
            <div>
              <div className="text-2xl font-extrabold font-mono text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Static URL Isolation</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-cyan-400">4-Way</div>
              <div className="text-xs text-slate-400 mt-0.5">Text, URL, Email, OCR</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-white">0-100</div>
              <div className="text-xs text-slate-400 mt-0.5">Transparent Risk Score</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">&lt; 3s</div>
              <div className="text-xs text-slate-400 mt-0.5">Real-time Hybrid AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Threat Report Card Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Sample Threat Detection
          </h2>
          <p className="text-2xl font-bold text-white mt-1">
            See Explainable AI in Action
          </p>
        </div>

        <div className="rounded-2xl bg-[#0B1120] border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-red-500/10 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-8 h-8 text-red-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold font-mono text-white">91</span>
                  <span className="text-slate-400 font-mono text-xs">/100</span>
                  <ThreatBadge classification="PHISHING" size="md" />
                </div>
                <h3 className="text-base font-semibold text-slate-200 mt-0.5">
                  Critical Risk: Credential Harvesting Scam
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block">Confidence Metric</span>
              <span className="text-sm font-mono font-bold text-cyan-400">94% Converged</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Highlighted text & reasoning */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                FLAGGED INCOMING SMS MESSAGE
              </span>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-sm leading-relaxed border border-slate-800 text-slate-300">
                "URGENT! Your Chase bank account will be{' '}
                <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-1 py-0.5 rounded font-bold">
                  BLOCKED TODAY
                </span>
                . Verify your{' '}
                <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-1 py-0.5 rounded font-bold">
                  PASSWORD
                </span>{' '}
                immediately at{' '}
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.5 rounded font-bold">
                  https://chase-auth-security.xyz
                </span>
                "
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300">
                <strong className="text-cyan-400 font-mono block mb-1">💡 Natural Language Threat Summary:</strong>
                PhishLens identified high urgency pressure, a direct request for confidential banking credentials, and an unofficial .xyz domain impersonating Chase.
              </div>
            </div>

            {/* Right: Detected Indicators */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                WHY IT WAS FLAGGED (KEY INDICATORS)
              </span>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <span className="text-red-400 font-bold">🚨</span>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">Urgency Detected</div>
                    <div className="text-[11px] text-slate-400">Pressures user with immediate account blockage threats.</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <span className="text-red-400 font-bold">🚨</span>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">Credential Request</div>
                    <div className="text-[11px] text-slate-400">Solicits private password inputs over unverified links.</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <span className="text-orange-400 font-bold">⚠️</span>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">Brand Impersonation & Suspicious TLD</div>
                    <div className="text-[11px] text-slate-400">Spoofs Chase brand on an unofficial `.xyz` domain.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/analyze"
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <span>Test Your Own Messages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Capability Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Complete Defensive Suite
          </h2>
          <h3 className="text-3xl font-extrabold text-white mt-2">
            Multi-Modal Threat Identification
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Comprehensive security inspection tailored for everyday digital interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Text */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">TEXT ANALYSIS</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Analyze suspicious SMS, WhatsApp messages, social DMs, and urgent communications for psychological manipulation.
              </p>
            </div>
            <Link to="/analyze?tab=text" className="mt-6 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>Scan Text</span> &rarr;
            </Link>
          </div>

          {/* Card 2: URL */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">STATIC URL ANALYSIS</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Inspect suspicious hyperlinks safely in isolation without ever visiting or downloading untrusted payloads.
              </p>
            </div>
            <Link to="/analyze?tab=url" className="mt-6 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>Scan URL</span> &rarr;
            </Link>
          </div>

          {/* Card 3: Email */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">EMAIL INSPECTION</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Detect sender name spoofing, display header mismatches, body traps, and embedded malicious links.
              </p>
            </div>
            <Link to="/analyze?tab=email" className="mt-6 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>Scan Email</span> &rarr;
            </Link>
          </div>

          {/* Card 4: Screenshot OCR */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white font-mono">SCREENSHOT OCR</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Extract text and deceptive links directly from phone screenshots of messages, banking portals, or scam popups.
              </p>
            </div>
            <Link to="/analyze?tab=screenshot" className="mt-6 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>Upload Image</span> &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Hackathon Mission / Educational CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-sans">
              Learn to Spot Phishing Tactics Independently
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              PhishLens is built as an educational cybersecurity shield. Test your knowledge with interactive threat scenarios and quizzes.
            </p>
          </div>
          <Link
            to="/learn"
            className="shrink-0 px-6 py-3 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-2"
          >
            <span>Start Learning Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
