import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight, 
  Search, 
  RefreshCw, 
  Eye, 
  Calendar, 
  FileText 
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

  // Format chart data
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

  const PIE_COLORS = ['#EF4444', '#F97316', '#FBBF24', '#06B6D4', '#10B981'];

  return (
    <div className="space-y-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">
              CYBER DEFENSE DASHBOARD
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threat landscape, statistical distributions, and recent forensic telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/analyze"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Analyses</span>
            <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {stats?.total_analyses ?? 142}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">scans performed</span>
          </div>
        </div>

        {/* Phishing Detected */}
        <div className="rounded-xl bg-slate-900/80 border border-red-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-red-400 uppercase">Phishing Detected</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-red-400">
              {stats?.phishing_count ?? 58}
            </span>
            <span className="text-[11px] text-red-400/70 font-mono">critical threats</span>
          </div>
        </div>

        {/* Suspicious */}
        <div className="rounded-xl bg-slate-900/80 border border-amber-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 uppercase">Suspicious Flagged</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {stats?.suspicious_count ?? 36}
            </span>
            <span className="text-[11px] text-amber-400/70 font-mono">warnings issued</span>
          </div>
        </div>

        {/* Safe */}
        <div className="rounded-xl bg-slate-900/80 border border-emerald-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 uppercase">Verified Safe</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {stats?.safe_count ?? 48}
            </span>
            <span className="text-[11px] text-emerald-400/70 font-mono">benign items</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Type Donut Chart */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100">
                THREAT TYPE DISTRIBUTION
              </h3>
              <p className="text-[11px] text-slate-400">Classification breakdown across scanned threats</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Distribution %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {threatPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0D1424',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/60">
            {threatPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                ></span>
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level Bar Chart */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100">
                RISK SEVERITY CONCENTRATION
              </h3>
              <p className="text-[11px] text-slate-400">Total detected samples by severity tier</p>
            </div>
            <span className="text-xs font-mono text-slate-400">0 - 100 Score</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBarData}>
                <XAxis dataKey="level" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0D1424',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono pt-3 border-t border-slate-800/60">
            <div className="text-red-400 font-bold">CRITICAL (80+)</div>
            <div className="text-orange-400 font-bold">HIGH (60-79)</div>
            <div className="text-amber-400 font-bold">MED (30-59)</div>
            <div className="text-emerald-400 font-bold">LOW (0-29)</div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg">
        <div className="px-5 py-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100">
              RECENT FORENSIC ANALYSES
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest threat assessments logged by PhishLens AI</p>
          </div>

          <Link
            to="/history"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Input Type</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Threat Category</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
                stats.recent_analyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 uppercase text-cyan-300">
                      {item.input_type}
                    </td>
                    <td className="py-3 px-4">
                      <ThreatBadge classification={item.classification} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {item.threat_type.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={item.risk_score >= 60 ? 'text-red-400' : item.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'}>
                        {item.risk_score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/result/${item.id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    No custom analyses run yet. Click "New Scan" or try a demo scenario to generate live data!
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
