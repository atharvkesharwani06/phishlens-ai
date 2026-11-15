import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AlertOctagon, 
  RotateCcw, 
  FileText, 
  Globe, 
  Cpu, 
  ChevronLeft, 
  Printer, 
  Eye, 
  Activity,
  CheckCircle2,
  FileSearch
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
      <div className="py-20 text-center font-sans">
        <div className="w-10 h-10 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mx-auto animate-spin mb-3">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#172321] font-sans">Loading Threat Report...</h3>
        <p className="text-xs text-[#697773] font-sans mt-0.5">Retrieving forensic indicators and risk telemetry...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center font-sans">
        <div className="p-4 rounded-lg bg-[#C74747]/8 border border-[#C74747]/25 text-[#C74747] text-xs font-sans mb-4">
          {error || 'Threat report not found.'}
        </div>
        <Link
          to="/analyze"
          className="px-5 py-2 rounded-lg bg-[#087F75] hover:bg-[#076c64] text-white font-sans text-xs font-semibold transition-colors shadow-xs"
        >
          &larr; Return to Analyze Console
        </Link>
      </div>
    );
  }

  const isPhishing = result.classification === 'PHISHING';

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 space-y-6 font-sans animate-page-enter">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8E5]">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-1 text-xs font-sans text-[#697773] hover:text-[#087F75] font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Analysis Console</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F7F8F6] active:scale-[0.98] border border-[#E2E8E5] text-[#172321] text-xs font-sans flex items-center gap-1.5 transition-all duration-150 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#697773]" />
            <span>Print Report</span>
          </button>

          <Link
            to="/analyze"
            className="px-3.5 py-1.5 rounded-md bg-[#087F75] hover:bg-[#076c64] active:scale-[0.98] text-white text-xs font-sans font-semibold flex items-center gap-1.5 transition-all duration-150 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Hero Threat Assessment Header */}
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-[#E2E8E5]">
          {/* Left Column: Classification & Executive Summary */}
          <div className="space-y-3.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <ThreatBadge classification={result.classification} size="lg" />
              <ThreatBadge severity={result.risk_level} size="lg" />
              <span className="text-xs font-mono text-[#697773] bg-[#F7F8F6] px-2.5 py-0.5 rounded border border-[#E2E8E5]">
                Modality: {result.input_type}
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172321] font-sans tracking-tight">
                {result.threat_type.replace(/_/g, ' ')}
              </h1>
              <p className="text-xs text-[#697773] font-mono mt-0.5">
                Case Reference: <span className="text-[#172321] font-semibold">{result.id.slice(0, 13)}</span> • Recorded on {new Date(result.created_at).toLocaleString()}
              </p>
            </div>

            {/* Natural Explanation Summary */}
            <div className="p-4 rounded-lg bg-[#E6F4F1]/60 border border-[#087F75]/20 text-xs text-[#172321] leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 mb-1 text-xs font-sans text-[#087F75] font-semibold">
                <FileSearch className="w-3.5 h-3.5 text-[#087F75]" />
                <span>Executive Threat Explanation:</span>
              </div>
              <p>{result.summary}</p>
            </div>
          </div>

          {/* Right Column: Risk Gauge */}
          <div className="shrink-0 bg-[#F7F8F6] p-3 rounded-xl border border-[#E2E8E5]">
            <RiskGauge
              score={result.risk_score}
              riskLevel={result.risk_level}
              confidence={result.confidence}
              size={170}
            />
          </div>
        </div>

        {/* Score Breakdown Bar */}
        {result.score_breakdown && (
          <div className="px-6 py-2.5 bg-[#F7F8F6] border-t border-[#E2E8E5] flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#697773]">
            <span className="text-[#697773] font-medium">Scoring Weights:</span>
            <div className="flex items-center gap-5 text-xs font-sans">
              <span>Linguistic NLP: <strong className="font-mono text-[#172321]">{result.score_breakdown.ai_score}%</strong></span>
              <span>Heuristic Rules: <strong className="font-mono text-[#172321]">{result.score_breakdown.rule_score}%</strong></span>
              <span>Static URL: <strong className="font-mono text-[#172321]">{result.score_breakdown.url_score}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Evidence Highlighting on Message */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#087F75]" />
          <span>Interactive Evidence Inspector</span>
        </h3>
        <InteractiveEvidenceViewer
          originalText={result.original_text || result.input_preview || ''}
          highlights={result.highlights || []}
        />
      </section>

      {/* Detected Indicators */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-[#087F75]" />
            <span>Detected Forensic Indicators ({result.indicators.length})</span>
          </h3>
          <span className="text-xs font-sans text-[#697773]">
            Linguistic and Behavioral Evidence
          </span>
        </div>

        {result.indicators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {result.indicators.map((indicator, idx) => (
              <IndicatorCard key={idx} indicator={indicator} />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[#39805A]/8 border border-[#39805A]/25 text-[#39805A] text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#39805A]" />
            <span>No malicious deception indicators or manipulative tokens identified in this input.</span>
          </div>
        )}
      </section>

      {/* Static URL Forensic Analysis */}
      {result.url_details && (
        <section className="space-y-2.5">
          <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#087F75]" />
            <span>Static URL Security Analysis</span>
          </h3>
          <UrlAnalysisCard urlDetails={result.url_details} />
        </section>
      )}

      {/* Extracted OCR Information (if image upload) */}
      {result.ocr_details && (
        <section className="space-y-2.5">
          <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#087F75]" />
            <span>Optical Character Recognition (OCR) Telemetry</span>
          </h3>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 space-y-3 shadow-xs">
            <div>
              <span className="text-[11px] font-sans font-medium text-[#697773] uppercase block mb-1">
                Extracted Text from Image Payload
              </span>
              <div className="p-3 rounded-md bg-[#F7F8F6] font-mono text-xs text-[#172321] border border-[#E2E8E5] leading-relaxed">
                {result.ocr_details.extracted_text || 'No textual content recognized.'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-sans">
              <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5]">
                <span className="text-[#697773] block text-[11px]">Detected URLs:</span>
                <span className="text-[#172321] font-mono font-bold">{result.ocr_details.detected_urls.length}</span>
              </div>
              <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5]">
                <span className="text-[#697773] block text-[11px]">Detected Brands:</span>
                <span className="text-[#172321] font-sans font-semibold">{result.ocr_details.detected_brands.join(', ') || 'None'}</span>
              </div>
              <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5]">
                <span className="text-[#697773] block text-[11px]">Phone Numbers:</span>
                <span className="text-[#172321] font-mono font-bold">{result.ocr_details.detected_phones.length}</span>
              </div>
              <div className="p-2.5 rounded-md bg-[#F7F8F6] border border-[#E2E8E5]">
                <span className="text-[#697773] block text-[11px]">Email Addresses:</span>
                <span className="text-[#172321] font-mono font-bold">{result.ocr_details.detected_emails.length}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Non-Technical Actions */}
      <section className="space-y-2.5">
        <DosAndDontsCard dosAndDonts={result.dos_and_donts} isPhishing={isPhishing} />
      </section>

      {/* Technical Forensic Breakdown (Toggleable) */}
      <section className="pt-2">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs font-sans font-medium text-[#697773] hover:text-[#087F75] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-[#697773]" />
          <span>{showTechnicalDetails ? 'Hide' : 'Show'} Raw JSON Telemetry &amp; Parameters</span>
        </button>

        {showTechnicalDetails && (
          <div className="mt-2.5 p-4 rounded-xl bg-[#F7F8F6] border border-[#E2E8E5] overflow-x-auto shadow-xs animate-fade-in">
            <pre className="text-[11px] font-mono text-[#172321] leading-snug">
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
