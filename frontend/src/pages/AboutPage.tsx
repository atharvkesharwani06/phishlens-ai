import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  AlertTriangle, 
  Layers, 
  CheckCircle2,
  Compass
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 space-y-8 font-sans animate-page-enter">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75] text-xs font-medium mb-3 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#087F75]" />
          <span>Architecture &amp; Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172321] tracking-tight font-sans">
          How PhishLens AI Works
        </h1>
        <p className="text-xs sm:text-sm text-[#697773] mt-1.5 leading-relaxed">
          Engineered to dismantle cyber threats through transparent, multi-factor scoring and human-readable forensic evidence.
        </p>
      </div>

      {/* Architecture Pipeline Section */}
      <section className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8E5]">
          <div className="p-1.5 rounded-md bg-[#E6F4F1] text-[#087F75] border border-[#087F75]/20">
            <Layers className="w-4 h-4 text-[#087F75]" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-sans text-[#172321] uppercase tracking-wide">
              Deterministic Defense Pipeline
            </h2>
            <p className="text-xs text-[#697773]">End-to-end execution flow from raw untrusted input to structured evidence report</p>
          </div>
        </div>

        {/* Architecture Grid Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] space-y-1.5">
            <span className="text-[#087F75] font-bold block text-xs">1. Ingest &amp; Sanitize</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Strips potential executable scripts, normalizes UTF-8 encodings, and parses headers safely in isolated memory.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] space-y-1.5">
            <span className="text-[#087F75] font-bold block text-xs">2. Static Forensics &amp; OCR</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Extracts Shannon domain entropy, subdomain count, and typosquatting tokens without live network resolution.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] space-y-1.5">
            <span className="text-[#087F75] font-bold block text-xs">3. Hybrid Heuristics &amp; NLP</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Combines deterministic security pattern matching with a Bayesian NLP classifier to flag psychological pressure.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] space-y-1.5">
            <span className="text-[#087F75] font-bold block text-xs">4. Explain &amp; Guide</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Binds highlighted spans with explanatory rationale and generates actionable DOs &amp; DO NOTs for the operator.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Risk Formula */}
      <section className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8E5]">
          <div className="p-1.5 rounded-md bg-[#E6F4F1] text-[#087F75] border border-[#087F75]/20">
            <Cpu className="w-4 h-4 text-[#087F75]" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-sans text-[#172321] uppercase tracking-wide">
              Transparent Risk Formula (0 – 100)
            </h2>
            <p className="text-xs text-[#697773]">Deterministic multi-factor weighting to eliminate unexplainable black-box verdicts</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] font-mono text-xs text-[#172321] overflow-x-auto">
          <code>RiskScore = 0.50 × (NLP Language Score) + 0.30 × (Security Rule Score) + 0.20 × (Static URL Score)</code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5]">
            <span className="text-[#172321] font-semibold block mb-1">50% Linguistic Model</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Evaluates panic language, artificial deadlines, and deceptive psychological hooks.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5]">
            <span className="text-[#172321] font-semibold block mb-1">30% Heuristic Rules</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Deterministic detection of credential harvesting, OTP solicitation, and fee scams.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5]">
            <span className="text-[#172321] font-semibold block mb-1">20% URL / Header Metrics</span>
            <p className="text-[#697773] text-[11px] leading-relaxed">
              Shannon entropy, IP addresses in hosts, brand mismatch, and high-risk TLDs.
            </p>
          </div>
        </div>
      </section>

      {/* Security Safety Precautions */}
      <section className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8E5]">
          <div className="p-1.5 rounded-md bg-[#39805A]/10 text-[#39805A] border border-[#39805A]/20">
            <Lock className="w-4 h-4 text-[#39805A]" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-sans text-[#172321] uppercase tracking-wide">
              Safety &amp; Privacy Safeguards
            </h2>
            <p className="text-xs text-[#697773]">Protection mechanisms ensuring safe offline evaluation</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs font-sans">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] text-[#172321]">
            <CheckCircle2 className="w-4 h-4 text-[#39805A] shrink-0 mt-0.5" />
            <span><strong className="text-[#172321]">Zero Live Detonation:</strong> PhishLens never opens, pings, or triggers client scripts from target URLs. All inspections occur statically.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] text-[#172321]">
            <CheckCircle2 className="w-4 h-4 text-[#39805A] shrink-0 mt-0.5" />
            <span><strong className="text-[#172321]">In-Memory Artifact Isolation:</strong> Uploaded images are parsed strictly in volatile memory for pixel OCR and discarded without disk execution.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] text-[#172321]">
            <CheckCircle2 className="w-4 h-4 text-[#39805A] shrink-0 mt-0.5" />
            <span><strong className="text-[#172321]">Privacy Sanitization:</strong> Sensitive credential tokens are anonymized before logging to maintain user privacy.</span>
          </div>
        </div>
      </section>

      {/* Limitations & Future Roadmap */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Limitations */}
        <div className="rounded-xl bg-[#B77932]/10 border border-[#B77932]/25 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#B77932] font-sans font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#B77932]" />
            <span>Operational Limitations</span>
          </div>
          <p className="text-xs text-[#172321] leading-relaxed font-sans">
            PhishLens provides probabilistic risk-assessment and educational triage. AI models and static rules may produce false positives or false negatives. Users should independently verify critical institutional actions via verified direct phone channels.
          </p>
        </div>

        {/* Future Scope */}
        <div className="rounded-xl bg-[#F7F8F6] border border-[#E2E8E5] p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#172321] font-sans font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#087F75]" />
            <span>Future Scope</span>
          </div>
          <ul className="text-xs text-[#697773] space-y-1 font-sans">
            <li>• Browser extension for real-time link hover inspection</li>
            <li>• Enterprise SIEM and threat intelligence feed integration</li>
            <li>• Multilingual NLP tokenizers for regional fraud patterns</li>
            <li>• Mobile SMS spam filtering plugin architecture</li>
          </ul>
        </div>
      </section>
    </div>
  );
};