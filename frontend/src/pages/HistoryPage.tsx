import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Eye, 
  RefreshCw, 
  Search
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { AnalysisHistoryItem } from '../types';
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
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 space-y-6 font-sans animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172321] tracking-tight font-sans">
              Analysis Audit Log
            </h1>
            <span className="px-2 py-0.5 rounded bg-[#E6F4F1] text-[#087F75] text-[11px] font-mono border border-[#087F75]/20 font-medium">
              LOCAL DATABASE
            </span>
          </div>
          <p className="text-xs text-[#697773] mt-1 font-sans">
            Review past forensic evaluations, risk ratings, and extracted threat indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchHistory}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F7F8F6] border border-[#E2E8E5] text-[#172321] text-xs font-sans font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#697773] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-md bg-[#C74747]/10 hover:bg-[#C74747]/20 border border-[#C74747]/30 text-[#C74747] text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#C74747]" />
              <span>Clear Log</span>
            </button>
          )}

          <Link
            to="/analyze"
            className="px-3.5 py-1.5 rounded-md bg-[#087F75] hover:bg-[#076c64] text-white text-xs font-sans font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#697773] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by keyword, threat type, or preview..."
            className="w-full rounded-md bg-[#F7F8F6] border border-[#E2E8E5] pl-8 pr-3 py-1.5 text-xs font-sans text-[#172321] placeholder-[#697773] focus:outline-none focus:border-[#087F75] focus:bg-[#FFFFFF] transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PHISHING', 'SUSPICIOUS', 'SAFE', 'TEXT', 'URL', 'EMAIL', 'IMAGE'].map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-colors cursor-pointer ${
                filterType === filter
                  ? 'bg-[#087F75] text-white font-medium shadow-xs'
                  : 'text-[#697773] hover:text-[#172321] bg-[#F7F8F6] border border-[#E2E8E5] hover:bg-[#FFFFFF]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F7F8F6] text-[#697773] border-b border-[#E2E8E5] font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Date &amp; Time</th>
                <th className="py-2.5 px-4">Modality</th>
                <th className="py-2.5 px-4">Classification</th>
                <th className="py-2.5 px-4">Threat Type</th>
                <th className="py-2.5 px-4 text-center">Risk Score</th>
                <th className="py-2.5 px-4">Executive Rationale</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E5] text-[#172321]">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8F6]/80 transition-colors">
                    <td className="py-3 px-4 text-[#697773] font-mono text-[11px] whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 uppercase text-[#172321] font-mono text-[11px] whitespace-nowrap">
                      {item.input_type}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <ThreatBadge classification={item.classification} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-[#172321] font-medium whitespace-nowrap">
                      {item.threat_type.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold whitespace-nowrap">
                      <span className={item.risk_score >= 60 ? 'text-[#C74747]' : item.risk_score >= 30 ? 'text-[#B77932]' : 'text-[#39805A]'}>
                        {item.risk_score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[#697773] text-xs">
                      {item.summary}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/result/${item.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F7F8F6] hover:bg-[#E6F4F1] hover:text-[#087F75] text-[#172321] border border-[#E2E8E5] transition-colors font-medium text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#697773]" />
                          <span>Report</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded text-[#697773] hover:text-[#C74747] hover:bg-[#C74747]/10 transition-colors cursor-pointer"
                          title="Delete entry"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#697773] italic text-xs font-sans">
                    No threat logs match the selected filter criteria.
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