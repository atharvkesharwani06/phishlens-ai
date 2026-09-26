import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  AlertTriangle, 
  Sparkles, 
  Database, 
  ArrowRight, 
  Globe, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBERSECURITY ARCHITECTURE & TRANSPARENCY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          HOW PHISHLENS AI WORKS
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          PhishLens AI is engineered to demystify digital deception through transparent, explainable multi-modal cyber threat intelligence.
        </p>
      </div>

      {/* Architecture Pipeline Section */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white">
              END-TO-END DEFENSIVE PIPELINE
            </h2>
            <p className="text-xs text-slate-400">Deterministic flow from untrusted input to explainable risk report</p>
          </div>
        </div>

        {/* Architecture Grid Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">1. INGEST & PREPROCESS</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              Sanitizes raw text, formats, or uploads. Validates MIME types &amp; strips potential script injection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">2. MULTI-MODAL OCR &amp; URL</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              Static URL analysis extracts entropy, TLD risks &amp; brand spoofing without visiting links. OCR isolates visual text.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">3. HYBRID AI &amp; RULES</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              TF-IDF NLP classifier + behavioral heuristic rules assess urgency, credential theft, and fear language.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">4. EXPLAIN &amp; GUIDE</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              Highlights exact suspicious spans, generates non-technical rationale, and issues crisp DOs &amp; DO NOTs.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Risk Formula */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white">
              TRANSPARENT RISK FORMULA (0 - 100)
            </h2>
            <p className="text-xs text-slate-400">Calculated multi-factor weighting — no arbitrary black-box scores</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-xs text-cyan-300">
          <code>RiskScore = 0.50 × (AI NLP Score) + 0.30 × (Security Rule Score) + 0.20 × (Static URL Score)</code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block mb-1">50% AI / ML Weight</span>
            <p className="text-slate-400 text-[11px]">
              Trained on real-world phishing corpus to detect deceptive phrasing, panic patterns, and subtle smishing traps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block mb-1">30% Rule Weight</span>
            <p className="text-slate-400 text-[11px]">
              Deterministic heuristics detecting explicit credential requests, OTP solicitation, and artificial deadlines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block mb-1">20% URL / Context Weight</span>
            <p className="text-slate-400 text-[11px]">
              Shannon domain entropy, high-abuse TLDs (.xyz, .top), IP hosts, sender header mismatches, and brand impersonation.
            </p>
          </div>
        </div>
      </section>

      {/* Security Safety Precautions */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white">
              CORE SAFETY &amp; SECURITY PROTOCOLS
            </h2>
            <p className="text-xs text-slate-400">How PhishLens protects users from accidental detonation</p>
          </div>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Zero Live Navigation:</strong> PhishLens never automatically connects to, pings, or downloads content from submitted URLs. All analysis is purely static.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Untrusted File Quarantine:</strong> Uploaded images are strictly parsed in memory for pixel extraction and discarded. Executables are rejected by MIME and magic headers.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Privacy Protection:</strong> Sensitive user credentials are sanitized before logging, preserving privacy while enabling security audits.</span>
          </div>
        </div>
      </section>

      {/* Limitations & Future Roadmap */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limitations */}
        <div className="rounded-2xl bg-slate-900/80 border border-amber-500/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>KNOWN LIMITATIONS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            PhishLens is a probabilistic risk-assessment and educational platform. AI models can produce false positives or false negatives. Users should independently verify critical financial and institutional communications via trusted official channels.
          </p>
        </div>

        {/* Future Scope */}
        <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>FUTURE ROADMAP</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 font-mono">
            <li>• Browser extension for real-time link hover inspection</li>
            <li>• Enterprise SIEM / Threat Intel feed integration</li>
            <li>• Multi-lingual NLP models (Hindi, Spanish, French)</li>
            <li>• Automated mobile SMS spam filter plugin</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
