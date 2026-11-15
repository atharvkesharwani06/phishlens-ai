import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Search, 
  RefreshCw, 
  Eye
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import { AnalysisService } from '../services/api';
import { DashboardStats } from '../types';
import { ThreatBadge } from '../components/ThreatBadge';

const AnimatedStatNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayVal, setDisplayVal] = useState<number>(value);
  const prevValRef = useRef<number>(value);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startVal = prevValRef.current;
    const targetVal = value;

    if (prefersReducedMotion || startVal === targetVal) {
      setDisplayVal(targetVal);
      prevValRef.current = targetVal;
      return;
    }

    const duration = 500;
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(startVal + (targetVal - startVal) * ease));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        prevValRef.current = targetVal;
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value]);

  return <span className="tabular-nums">{displayVal}</span>;
};

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await AnalysisService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const threatPieData = stats?.threat_distribution
    ? Object.entries(stats.threat_distribution).map(([key, val]) => ({
        name: key.replace(/_/g, ' '),
        value: val,
      }))
    : [
        { name: 'Credential Harvesting', value: 38 },
        { name: 'Impersonation', value: 24 },
        { name: 'Financial Fraud', value: 22 },
        { name: 'Malicious Link', value: 10 },
        { name: 'Legitimate', value: 48 },
      ];

  const riskBarData = stats?.risk_distribution
    ? Object.entries(stats.risk_distribution).map(([key, val]) => ({
        level: key,
        count: val,
      }))
    : [
        { level: 'CRITICAL', count: 34 },
        { level: 'HIGH', count: 24 },
        { level: 'MEDIUM', count: 36 },
        { level: 'LOW', count: 48 },
      ];

  const PIE_COLORS = ['#C74747', '#B77932', '#087F75', '#39805A', '#697773'];

  return (
    <div className="space-y-6 py-4 font-sans animate-page-enter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8E5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172321] tracking-tight">
              Threat Telemetry Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded bg-[#E6F4F1] text-[#087F75] text-[11px] font-mono border border-[#087F75]/20 font-semibold">
              DATABASE METRICS
            </span>
          </div>
          <p className="text-xs text-[#697773] mt-0.5">
            Statistical aggregation of threat classifications, risk scores, and forensic scans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchStats}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F7F8F6] active:scale-[0.98] border border-[#E2E8E5] text-[#172321] text-xs font-sans font-medium flex items-center gap-1.5 transition-all duration-150 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#697773] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/analyze"
            className="px-3.5 py-1.5 rounded-md bg-[#087F75] hover:bg-[#076c64] active:scale-[0.98] text-white text-xs font-sans font-semibold flex items-center gap-1.5 transition-all duration-150 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-4 shadow-xs hover:border-[#087F75]/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-[#697773]">Total Scanned Artifacts</span>
            <div className="p-1.5 rounded-md bg-[#F7F8F6] text-[#172321] border border-[#E2E8E5]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#172321]">
              <AnimatedStatNumber value={stats?.total_analyses ?? 142} />
            </span>
            <span className="text-[11px] text-[#697773] font-sans">completed runs</span>
          </div>
        </div>

        {/* Phishing Detected */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#C74747]/25 p-4 shadow-xs hover:border-[#C74747]/50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-[#C74747]">Phishing Confirmed</span>
            <div className="p-1.5 rounded-md bg-[#C74747]/8 text-[#C74747]">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#C74747]">
              <AnimatedStatNumber value={stats?.phishing_count ?? 58} />
            </span>
            <span className="text-[11px] text-[#C74747] font-sans">high / critical threats</span>
          </div>
        </div>

        {/* Suspicious */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#B77932]/25 p-4 shadow-xs hover:border-[#B77932]/50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-[#B77932]">Suspicious Warnings</span>
            <div className="p-1.5 rounded-md bg-[#B77932]/8 text-[#B77932]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#B77932]">
              <AnimatedStatNumber value={stats?.suspicious_count ?? 36} />
            </span>
            <span className="text-[11px] text-[#B77932] font-sans">anomalies flagged</span>
          </div>
        </div>

        {/* Safe */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#39805A]/25 p-4 shadow-xs hover:border-[#39805A]/50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-[#39805A]">Benign / Safe</span>
            <div className="p-1.5 rounded-md bg-[#39805A]/8 text-[#39805A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#39805A]">
              <AnimatedStatNumber value={stats?.safe_count ?? 48} />
            </span>
            <span className="text-[11px] text-[#39805A] font-sans">verified low-risk</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threat Type Donut Chart */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8E5]">
            <div>
              <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider">
                Threat Classification Ratio
              </h3>
              <p className="text-[11px] text-[#697773] font-sans">Breakdown across confirmed deceptive attack categories</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                >
                  {threatPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8E5',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#172321',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs font-sans text-[#697773] pt-3 border-t border-[#E2E8E5]">
            {threatPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                ></span>
                <span className="text-[11px]">{item.name}: <strong className="font-mono text-[#172321]">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level Bar Chart */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8E5]">
            <div>
              <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider">
                Risk Tier Distribution
              </h3>
              <p className="text-[11px] text-[#697773] font-sans">Number of scanned samples per risk severity band</p>
            </div>
            <span className="text-[11px] font-mono text-[#697773]">Scale: 0–100</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBarData}>
                <XAxis dataKey="level" stroke="#697773" fontSize={11} fontFamily="sans-serif" />
                <YAxis stroke="#697773" fontSize={11} fontFamily="sans-serif" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8E5',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#172321',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#087F75" 
                  radius={[4, 4, 0, 0]} 
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs font-sans text-[#697773] pt-3 border-t border-[#E2E8E5]">
            <span>Low Risk: 0–29</span>
            <span>Medium: 30–59</span>
            <span>High: 60–79</span>
            <span>Critical: 80–100</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F7F8F6] border-b border-[#E2E8E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#087F75]" />
            <h3 className="text-xs font-bold font-sans text-[#172321] uppercase tracking-wider">
              Recent Forensic Scans
            </h3>
          </div>
          <Link
            to="/history"
            className="text-xs font-sans text-[#087F75] hover:text-[#076c64] font-medium transition-colors"
          >
            View Complete Audit Log &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#FFFFFF] text-[#697773] border-b border-[#E2E8E5] font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Date &amp; Time</th>
                <th className="py-2.5 px-4">Modality</th>
                <th className="py-2.5 px-4">Threat Class</th>
                <th className="py-2.5 px-4 text-center">Score</th>
                <th className="py-2.5 px-4">Summary</th>
                <th className="py-2.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E5] text-[#172321]">
              {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
                stats.recent_analyses.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8F6]/80 transition-colors">
                    <td className="py-3 px-4 text-[#697773] font-mono text-[11px] whitespace-nowrap">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 uppercase text-[#172321] font-mono text-[11px]">
                      {item.input_type}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <ThreatBadge classification={item.classification} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={item.risk_score >= 60 ? 'text-[#C74747]' : item.risk_score >= 30 ? 'text-[#B77932]' : 'text-[#39805A]'}>
                        {item.risk_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[#697773] text-xs">
                      {item.summary}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/result/${item.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F7F8F6] hover:bg-[#E6F4F1] hover:text-[#087F75] text-[#172321] border border-[#E2E8E5] transition-colors font-medium text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#697773]" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#697773] italic text-xs font-sans">
                    No recent forensic scan records found. Run an analysis or explore demo scenarios.
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