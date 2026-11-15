import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  FlaskConical,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { DemoCase } from '../types';
import { ThreatBadge } from '../components/ThreatBadge';

export const DemoCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoCases, setDemoCases] = useState<DemoCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const fetchDemos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AnalysisService.getDemoCases();
      setDemoCases(data || []);
    } catch (err) {
      console.error('Failed to load demo cases:', err);
      setError('Unable to load demonstration scenarios from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleRunDemo = async (demo: DemoCase) => {
    setExecutingId(demo.id);
    try {
      let result;
      if (demo.input_type === 'text') {
        result = await AnalysisService.analyzeText(demo.content.text || '', demo.content.source || 'direct');
      } else if (demo.input_type === 'url') {
        result = await AnalysisService.analyzeUrl(demo.content.url || '');
      } else if (demo.input_type === 'email') {
        result = await AnalysisService.analyzeEmail({
          sender_name: demo.content.sender_name,
          sender_email: demo.content.sender_email,
          subject: demo.content.subject,
          body: demo.content.body || '',
          links: demo.content.links || [],
        });
      }

      if (result?.id) {
        navigate(`/result/${result.id}`);
      }
    } catch (err) {
      console.error('Failed to execute demo case:', err);
      setExecutingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 space-y-6 font-sans animate-page-enter">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] border border-[#087F75]/20 text-[#087F75] text-xs font-medium mb-3 shadow-xs">
          <FlaskConical className="w-3.5 h-3.5 text-[#087F75]" />
          <span>Interactive Evaluation Scenarios</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172321] tracking-tight font-sans">
          Interactive Demonstration Suite
        </h1>
        <p className="text-xs sm:text-sm text-[#697773] mt-1 leading-relaxed">
          Evaluate real-time explainable threat detection with pre-configured synthetic phishing, scam, and verified benign test scenarios.
        </p>
      </div>

      {/* Grid of Demo Scenarios */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-[#697773] space-y-2 font-sans">
          <Loader2 className="w-5 h-5 animate-spin text-[#087F75]" />
          <span className="text-xs">Loading demonstration scenarios...</span>
        </div>
      ) : error && demoCases.length === 0 ? (
        <div className="p-6 rounded-lg bg-[#C74747]/8 border border-[#C74747]/25 text-center space-y-3 font-sans">
          <p className="text-xs text-[#C74747]">{error}</p>
          <button
            type="button"
            onClick={fetchDemos}
            className="px-4 py-1.5 rounded-md bg-[#087F75] hover:bg-[#076c64] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoCases.map((demo) => {
            const isRunning = executingId === demo.id;
            const isSafe = demo.expected_classification === 'SAFE';

            return (
              <div
                key={demo.id}
                className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 flex flex-col justify-between shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#087F75] font-semibold uppercase tracking-wider block">
                        Category: {demo.category} • {demo.input_type.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-[#172321] font-sans mt-0.5">
                        {demo.title}
                      </h3>
                    </div>
                    <ThreatBadge classification={demo.expected_classification} size="sm" />
                  </div>

                  <p className="text-xs text-[#697773] leading-relaxed font-sans">
                    {demo.description}
                  </p>

                  {/* Sample Snippet Preview Box */}
                  <div className="p-3 rounded-lg bg-[#F7F8F6] border border-[#E2E8E5] font-mono text-xs text-[#172321] space-y-1">
                    {demo.input_type === 'email' ? (
                      <div>
                        <div className="text-[#697773] text-[10px]">From: {demo.content.sender_name} &lt;{demo.content.sender_email}&gt;</div>
                        <div className="text-[#172321] text-[11px] font-bold">Subject: {demo.content.subject}</div>
                        <div className="text-[#172321] mt-1 line-clamp-2">{demo.content.body}</div>
                      </div>
                    ) : demo.input_type === 'url' ? (
                      <div className="truncate text-[#172321] font-semibold">{demo.content.url}</div>
                    ) : (
                      <div className="line-clamp-3 text-[#172321]">{demo.content.text}</div>
                    )}
                  </div>

                  {/* Expected Threat Parameters */}
                  <div className="flex items-center justify-between text-[11px] font-sans text-[#697773] pt-1">
                    <span>Category: <strong className="font-mono text-[#172321]">{demo.expected_threat_type.replace(/_/g, ' ')}</strong></span>
                    <span>Expected Score: <strong className={`font-mono ${isSafe ? 'text-[#39805A]' : 'text-[#C74747]'}`}>{demo.expected_risk_score}/100</strong></span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-3 border-t border-[#E2E8E5]">
                  <button
                    type="button"
                    onClick={() => handleRunDemo(demo)}
                    disabled={isRunning}
                    className="w-full py-2 rounded-lg text-xs font-sans font-semibold bg-[#F7F8F6] hover:bg-[#E2E8E5] active:scale-[0.99] text-[#172321] border border-[#E2E8E5] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isRunning ? (
                      <span className="flex items-center gap-1.5 text-[#087F75]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Executing Pipeline...
                      </span>
                    ) : (
                      <>
                        <span>Run Scenario Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
