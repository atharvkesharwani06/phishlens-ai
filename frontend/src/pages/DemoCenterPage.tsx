import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  MessageSquare, 
  FileText, 
  Globe, 
  Zap 
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { DemoCase } from '../types';
import { ThreatBadge } from '../components/ThreatBadge';

export const DemoCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoCases, setDemoCases] = useState<DemoCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemos = async () => {
      setIsLoading(true);
      try {
        const data = await AnalysisService.getDemoCases();
        setDemoCases(data);
      } catch (err) {
        console.error('Failed to load demo cases:', err);
      } finally {
        setIsLoading(false);
      }
    };

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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>HACKATHON LIVE DEMONSTRATION SUITE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          INTERACTIVE DEMO CENTER
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Test real-time explainable threat detection with pre-configured synthetic phishing, scam, and benign verification scenarios.
        </p>
      </div>

      {/* Grid of Demo Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demoCases.map((demo) => {
          const isRunning = executingId === demo.id;
          const isSafe = demo.expected_classification === 'SAFE';

          return (
            <div
              key={demo.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                      Category: {demo.category} • {demo.input_type.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-white font-mono mt-0.5">
                      {demo.title}
                    </h3>
                  </div>
                  <ThreatBadge classification={demo.expected_classification} size="sm" />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {demo.description}
                </p>

                {/* Sample Snippet Preview Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                  {demo.input_type === 'email' ? (
                    <div>
                      <div className="text-slate-500 text-[10px]">From: {demo.content.sender_name} &lt;{demo.content.sender_email}&gt;</div>
                      <div className="text-slate-400 text-[11px] font-bold">Subject: {demo.content.subject}</div>
                      <div className="text-slate-300 mt-1 line-clamp-2">{demo.content.body}</div>
                    </div>
                  ) : demo.input_type === 'url' ? (
                    <div className="truncate text-amber-300">{demo.content.url}</div>
                  ) : (
                    <div className="line-clamp-3 text-slate-200">{demo.content.text}</div>
                  )}
                </div>

                {/* Expected Threat Parameters */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>Threat Type: <strong className="text-slate-200">{demo.expected_threat_type.replace(/_/g, ' ')}</strong></span>
                  <span>Expected Risk: <strong className={isSafe ? 'text-emerald-400' : 'text-red-400'}>{demo.expected_risk_score}/100</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleRunDemo(demo)}
                  disabled={isRunning}
                  className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSafe
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {isRunning ? (
                    <span>Running Full AI Forensic Scan...</span>
                  ) : (
                    <>
                      <span>Execute Live Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
