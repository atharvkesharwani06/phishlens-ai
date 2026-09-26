import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertOctagon, 
  CheckCircle2, 
  Share2, 
  Download, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  Globe, 
  Cpu, 
  Info, 
  ChevronLeft, 
  Printer, 
  Eye, 
  Activity 
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { AnalysisResult } from '../types';
import { ThreatBadge } from '../components/ThreatBadge';
import { RiskGauge } from '../components/RiskGauge';
import { InteractiveEvidenceViewer } from '../components/InteractiveEvidenceViewer';
import { IndicatorCard } from '../components/IndicatorCard';
import { UrlAnalysisCard } from '../components/UrlAnalysisCard';
import { DosAndDontsCard } from '../components/DosAndDontsCard';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await AnalysisService.getAnalysisById(id);
        setResult(data);
      } catch (err: any) {
        console.error('Failed to load analysis result:', err);
        setError('Could not locate this threat report in local database.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto animate-spin mb-4">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-base font-mono font-bold text-white">Loading Threat Report...</h3>
        <p className="text-xs font-mono text-slate-400 mt-1">Retrieving forensic indicators & neural scoring...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono mb-6">
          {error || 'Threat report not found.'}
        </div>
        <Link
          to="/analyze"
          className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all"
        >
          &larr; Return to Analyze Console
        </Link>
      </div>
    );
  }

  const isPhishing = result.classification === 'PHISHING';
  const isSuspicious = result.classification === 'SUSPICIOUS';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <Link
            to="/analyze"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </Link>
        </div>
      </div>

      {/* Hero Threat Assessment Header */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-slate-800">
          {/* Left Column: Classification & Executive Summary */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <ThreatBadge classification={result.classification} size="lg" />
              <ThreatBadge severity={result.risk_level} size="lg" />
              <span className="text-xs font-mono text-slate-400 uppercase bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                Type: {result.input_type}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {result.threat_type.replace(/_/g, ' ')}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Forensic Case Reference: <span className="text-cyan-400">{result.id.slice(0, 13)}...</span> • Logged on {new Date(result.created_at).toLocaleString()}
              </p>
            </div>

            {/* AI Natural Explanation Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 text-sm text-slate-200 leading-relaxed font-sans">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-cyan-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPLAINABLE THREAT SUMMARY:</span>
              </div>
              <p>{result.summary}</p>
            </div>
          </div>

          {/* Right Column: Circular Risk Speedometer Gauge */}
          <div className="shrink-0 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <RiskGauge
              score={result.risk_score}
              riskLevel={result.risk_level}
              confidence={result.confidence}
              size={180}
            />
          </div>
        </div>

        {/* Score Breakdown Bar (Transparency in AI) */}
        {result.score_breakdown && (
          <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <span className="text-slate-500">SCORING COMPONENT WEIGHTS:</span>
            <div className="flex items-center gap-6">
              <span>NLP Machine Learning: <strong className="text-cyan-400">{result.score_breakdown.ai_score}%</strong></span>
              <span>Security Rule Weight: <strong className="text-amber-400">{result.score_breakdown.rule_score}%</strong></span>
              <span>URL / Context Risk: <strong className="text-red-400">{result.score_breakdown.url_score}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Evidence Highlighting on Message */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Interactive Evidence Inspector</span>
        </h3>
        <InteractiveEvidenceViewer
          originalText={result.original_text || result.input_preview || ''}
          highlights={result.highlights || []}
        />
      </section>

      {/* WHY PHISHLENS FLAGGED THIS (Indicator Cards) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-cyan-400" />
            <span>Why PhishLens Flagged This ({result.indicators.length} Indicators)</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Linguistic, Behavioral & Heuristic Telemetry
          </span>
        </div>

        {result.indicators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.indicators.map((indicator, idx) => (
              <IndicatorCard key={idx} indicator={indicator} />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>No malicious threat indicators or deceptive triggers were found in this content.</span>
          </div>
        )}
      </section>

      {/* Static URL Forensic Analysis */}
      {result.url_details && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Static URL Security Analysis</span>
          </h3>
          <UrlAnalysisCard urlDetails={result.url_details} />
        </section>
      )}

      {/* Extracted OCR Information (if image upload) */}
      {result.ocr_details && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>OCR Extraction Findings</span>
          </h3>

          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block mb-1">
                Extracted Text from Screenshot
              </span>
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800">
                {result.ocr_details.extracted_text}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Detected URLs:</span>
                <span className="text-cyan-300 font-bold">{result.ocr_details.detected_urls.length}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Detected Brands:</span>
                <span className="text-cyan-300 font-bold">{result.ocr_details.detected_brands.join(', ') || 'None'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Phone Numbers:</span>
                <span className="text-cyan-300 font-bold">{result.ocr_details.detected_phones.length}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Email Addresses:</span>
                <span className="text-cyan-300 font-bold">{result.ocr_details.detected_emails.length}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Non-Technical Actions (DOs and DO NOTs) */}
      <section className="space-y-3">
        <DosAndDontsCard dosAndDonts={result.dos_and_donts} isPhishing={isPhishing} />
      </section>

      {/* Technical Forensic Breakdown (Toggleable for Judges / Analysts) */}
      <section className="pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{showTechnicalDetails ? 'Hide' : 'Show'} Technical JSON Metadata & Parameters</span>
        </button>

        {showTechnicalDetails && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <pre className="text-[11px] font-mono text-cyan-300">
              {JSON.stringify(
                {
                  id: result.id,
                  classification: result.classification,
                  threat_type: result.threat_type,
                  risk_score: result.risk_score,
                  confidence: result.confidence,
                  score_breakdown: result.score_breakdown,
                  technical_details: result.technical_details,
                  indicators_count: result.indicators.length,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};
