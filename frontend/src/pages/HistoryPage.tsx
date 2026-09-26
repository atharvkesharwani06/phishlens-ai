import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Search, 
  Filter, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { AnalysisHistoryItem, ThreatClassification } from '../types';
import { ThreatBadge } from '../components/ThreatBadge';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await AnalysisService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this threat analysis record?')) {
      try {
        await AnalysisService.deleteAnalysis(id);
        setHistory(history.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Failed to delete analysis:', err);
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all analysis history records?')) {
      try {
        await AnalysisService.clearAllHistory();
        setHistory([]);
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filterType === 'ALL' || item.classification === filterType || item.input_type === filterType.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.threat_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.input_preview && item.input_preview.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">
              ANALYSIS AUDIT HISTORY
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse and review past explainable threat reports and security verdicts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <Link
            to="/analyze"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, threats, or summary..."
            className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PHISHING', 'SUSPICIOUS', 'SAFE', 'TEXT', 'URL', 'EMAIL', 'IMAGE'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filterType === filter
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Input Type</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Threat Type</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4">Summary Preview</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-cyan-300 whitespace-nowrap font-bold">
                      {item.input_type}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <ThreatBadge classification={item.classification} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 whitespace-nowrap">
                      {item.threat_type.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold whitespace-nowrap">
                      <span className={item.risk_score >= 60 ? 'text-red-400' : item.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'}>
                        {item.risk_score}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-400">
                      {item.summary}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/result/${item.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 italic">
                    No threat logs match your filters. Run a scan from the Analyze Console to record entries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
