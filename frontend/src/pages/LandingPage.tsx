import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MessageSquare, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  AlertOctagon, 
  FlaskConical,
  ShieldCheck
} from 'lucide-react';
import { ThreatBadge } from '../components/ThreatBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 py-4 font-sans animate-page-enter">
      {/* Hero Section */}
      <section className="pt-6 pb-8 text-center max-w-4xl mx-auto px-4">
        {/* Research Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75] text-xs font-medium mb-4 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#087F75]" />
          <span>Explainable Cybersecurity System</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172321]">
          PHISH<span className="text-[#087F75]">LENS</span> AI
        </h1>

        <p className="mt-3 text-base sm:text-lg font-medium text-[#172321]">
          Explainable, multi-modal threat assessment and user defense protocol.
        </p>

        <p className="mt-2.5 text-xs sm:text-sm text-[#697773] max-w-2xl mx-auto leading-relaxed">
          PhishLens decomposes digital threats across text messages, links, email headers, and screenshots.
          Rather than returning an opaque binary verdict, it isolates exact indicators and explains why an artifact is dangerous.
        </p>

        {/* Hero CTAs */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/analyze"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#087F75] hover:bg-[#076c64] active:scale-[0.98] text-white shadow-xs transition-all duration-150 flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Launch Analysis Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/demo"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-medium bg-[#FFFFFF] hover:bg-[#F7F8F6] active:scale-[0.98] text-[#172321] border border-[#E2E8E5] shadow-xs transition-all duration-150 flex items-center justify-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#087F75]" />
            <span>Interactive Demo Scenarios</span>
          </Link>
        </div>

        {/* Technical Specification Grid */}
        <div className="mt-10 pt-6 border-t border-[#E2E8E5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs hover:border-[#087F75]/30 hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-xs font-bold text-[#172321]">4 Input Modalities</div>
            <div className="text-[11px] text-[#697773] mt-0.5">Text, URL, Email, Screenshot OCR</div>
          </div>
          <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs hover:border-[#087F75]/30 hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-xs font-bold text-[#172321]">Static URL Protocol</div>
            <div className="text-[11px] text-[#697773] mt-0.5">Zero live connection or detonation</div>
          </div>
          <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs hover:border-[#087F75]/30 hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-xs font-bold text-[#172321]">Deterministic Engine</div>
            <div className="text-[11px] text-[#697773] mt-0.5">Heuristics + TF-IDF classification</div>
          </div>
          <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs hover:border-[#087F75]/30 hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-xs font-bold text-[#172321]">Explainable Output</div>
            <div className="text-[11px] text-[#697773] mt-0.5">Span highlighting &amp; action guides</div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Threat Report Card Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-[#087F75] uppercase tracking-wider font-mono">
            Forensic Inspection Preview
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#172321] mt-0.5">
            Transparent Threat Breakdown
          </p>
        </div>

        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs overflow-hidden">
          <div className="p-5 bg-[#F7F8F6] border-b border-[#E2E8E5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C74747]/8 border border-[#C74747]/20 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5 text-[#C74747]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold font-mono text-[#172321]">91</span>
                  <span className="text-[#697773] font-mono text-xs">/100</span>
                  <ThreatBadge classification="PHISHING" size="sm" />
                </div>
                <h3 className="text-sm font-semibold text-[#172321] mt-0.5">
                  Critical Risk: Credential Harvesting Scam
                </h3>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] font-sans text-[#697773] block">Assessment Metric</span>
              <span className="text-xs font-mono font-semibold text-[#172321]">High Convergence (94%)</span>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Highlighted text & reasoning */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#697773] uppercase tracking-wider block">
                Flagged Sample SMS Content
              </span>
              <div className="p-3.5 rounded-lg bg-[#F7F8F6] font-mono text-xs leading-relaxed border border-[#E2E8E5] text-[#172321]">
                "URGENT! Your Chase bank account will be{' '}
                <span className="bg-[#C74747]/10 text-[#C74747] border border-[#C74747]/30 px-1 py-0.5 rounded font-semibold">
                  BLOCKED TODAY
                </span>
                . Verify your{' '}
                <span className="bg-[#C74747]/10 text-[#C74747] border border-[#C74747]/30 px-1 py-0.5 rounded font-semibold">
                  PASSWORD
                </span>{' '}
                immediately at{' '}
                <span className="bg-[#B77932]/10 text-[#B77932] border border-[#B77932]/30 px-1 py-0.5 rounded font-semibold">
                  https://chase-auth-security.xyz
                </span>
                "
              </div>

              <div className="p-3 rounded-lg bg-[#E6F4F1]/60 border border-[#087F75]/20 text-xs text-[#172321]">
                <strong className="text-[#087F75] font-sans font-semibold block mb-0.5">Automated Threat Summary:</strong>
                Identified artificial urgency cues, direct solicitation of confidential authentication credentials, and an unverified `.xyz` target domain impersonating financial infrastructure.
              </div>
            </div>

            {/* Right: Detected Indicators */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono text-[#697773] uppercase tracking-wider block">
                Key Detected Indicators
              </span>

              <div className="space-y-2">
                <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5] flex items-start gap-2.5">
                  <span className="text-[#C74747] font-bold text-xs shrink-0 mt-0.5">●</span>
                  <div>
                    <div className="text-xs font-semibold text-[#172321]">Urgency Pressure</div>
                    <div className="text-[11px] text-[#697773]">Forces immediate compliance through arbitrary deadlines.</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5] flex items-start gap-2.5">
                  <span className="text-[#C74747] font-bold text-xs shrink-0 mt-0.5">●</span>
                  <div>
                    <div className="text-xs font-semibold text-[#172321]">Credential Solicitation</div>
                    <div className="text-[11px] text-[#697773]">Demands authentication credentials over an unverified hyperlink.</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5] flex items-start gap-2.5">
                  <span className="text-[#B77932] font-bold text-xs shrink-0 mt-0.5">●</span>
                  <div>
                    <div className="text-xs font-semibold text-[#172321]">Brand Impersonation &amp; Suspicious TLD</div>
                    <div className="text-[11px] text-[#697773]">Impersonates Chase bank on an untrusted `.xyz` apex domain.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/analyze"
                  className="w-full py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F7F8F6] text-[#172321] text-xs font-medium flex items-center justify-center gap-1.5 border border-[#E2E8E5] transition-colors"
                >
                  <span>Analyze Custom Input</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual 4-Stage Detection Pipeline */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-[#087F75] uppercase tracking-wider font-mono">
            Analytical Architecture
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#172321] mt-0.5">
            4-Stage Multi-Modal Detection Pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-2.5 text-xs font-bold font-mono">
                01
              </div>
              <h4 className="text-xs font-bold text-[#172321]">Input Ingestion</h4>
              <p className="text-[11px] text-[#697773] mt-1 leading-relaxed">
                Accepts raw text messages, URLs, structured email headers, or screenshot pixels in-memory.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E2E8E5] text-[10px] font-mono text-[#087F75]">
              Safe In-Memory Buffer
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-2.5 text-xs font-bold font-mono">
                02
              </div>
              <h4 className="text-xs font-bold text-[#172321]">Feature Extraction</h4>
              <p className="text-[11px] text-[#697773] mt-1 leading-relaxed">
                Computes Shannon entropy, subdomain nesting, urgency keywords, and brand typosquatting.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E2E8E5] text-[10px] font-mono text-[#087F75]">
              Lexical &amp; Heuristic
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-2.5 text-xs font-bold font-mono">
                03
              </div>
              <h4 className="text-xs font-bold text-[#172321]">Weighted Scoring</h4>
              <p className="text-[11px] text-[#697773] mt-1 leading-relaxed">
                Integrates AI Bayesian classification (40%), rule engine (35%), and URL metrics (25%).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E2E8E5] text-[10px] font-mono text-[#087F75]">
              Convergent Risk Index
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-2.5 text-xs font-bold font-mono">
                04
              </div>
              <h4 className="text-xs font-bold text-[#172321]">Forensic Advisory</h4>
              <p className="text-[11px] text-[#697773] mt-1 leading-relaxed">
                Highlights malicious token spans and generates deterministic Do's &amp; Don'ts protocols.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E2E8E5] text-[10px] font-mono text-[#087F75]">
              Explainable Guidance
            </div>
          </div>
        </div>
      </section>

      {/* Four Capability Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-[#087F75] uppercase tracking-wider font-mono">
            Supported Modalities
          </h2>
          <h3 className="text-base sm:text-lg font-bold text-[#172321] mt-0.5">
            Forensic Inspection Capabilities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Text */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 flex flex-col justify-between shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-3 group-hover:scale-105 transition-transform duration-200">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172321] font-sans">Message Analysis</h4>
              <p className="text-xs text-[#697773] mt-1.5 leading-relaxed">
                Evaluates SMS, chat messages, and social DMs for behavioral manipulation, fear tactics, and artificial urgency.
              </p>
            </div>
            <Link to="/analyze?tab=text" className="mt-4 text-xs font-medium text-[#087F75] hover:text-[#076c64] flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Inspect Text</span> &rarr;
            </Link>
          </div>

          {/* Card 2: URL */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 flex flex-col justify-between shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-3 group-hover:scale-105 transition-transform duration-200">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172321] font-sans">Static URL Analysis</h4>
              <p className="text-xs text-[#697773] mt-1.5 leading-relaxed">
                Calculates Shannon entropy, subdomain nesting, and brand typosquatting without connecting to target hosts.
              </p>
            </div>
            <Link to="/analyze?tab=url" className="mt-4 text-xs font-medium text-[#087F75] hover:text-[#076c64] flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Inspect URL</span> &rarr;
            </Link>
          </div>

          {/* Card 3: Email */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 flex flex-col justify-between shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-3 group-hover:scale-105 transition-transform duration-200">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172321] font-sans">Email Inspection</h4>
              <p className="text-xs text-[#697773] mt-1.5 leading-relaxed">
                Identifies sender display name mismatches, reply-to anomalies, deceptive subjects, and body trap links.
              </p>
            </div>
            <Link to="/analyze?tab=email" className="mt-4 text-xs font-medium text-[#087F75] hover:text-[#076c64] flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Inspect Email</span> &rarr;
            </Link>
          </div>

          {/* Card 4: Screenshot OCR */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 flex flex-col justify-between shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-3 group-hover:scale-105 transition-transform duration-200">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#172321] font-sans">Screenshot OCR</h4>
              <p className="text-xs text-[#697773] mt-1.5 leading-relaxed">
                Parses in-memory image pixels to extract textual content and suspicious URLs from mobile screenshots.
              </p>
            </div>
            <Link to="/analyze?tab=screenshot" className="mt-4 text-xs font-medium text-[#087F75] hover:text-[#076c64] flex items-center gap-1 group-hover:gap-1.5 transition-all">
              <span>Upload Image</span> &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Educational CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#172321] font-sans">
              Interactive Cybersecurity Training Academy
            </h3>
            <p className="text-xs text-[#697773] max-w-xl">
              Test threat-spotting reflexes through curated real-world attack scenarios and immediate forensic explanations.
            </p>
          </div>
          <Link
            to="/learn"
            className="shrink-0 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#087F75] hover:bg-[#076c64] active:scale-[0.98] text-white transition-all duration-150 flex items-center gap-2 shadow-xs"
          >
            <span>Start Practice Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
