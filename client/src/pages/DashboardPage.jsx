import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Trophy,
  BarChart3,
  FileText,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Sparkles,
  Eye,
} from 'lucide-react';
import { getAllAnalyses, getScoreHistory } from '../services/analysisService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate, getScoreBgClass, getScoreTextClass } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const STAT_CARDS = [
  {
    key: 'totalAnalyses',
    label: 'Total Analyses',
    icon: FileText,
    color: 'from-primary-500 to-primary-700',
    bg: 'bg-primary-50',
  },
  {
    key: 'bestScore',
    label: 'Best ATS Score',
    icon: Trophy,
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
  },
  {
    key: 'averageScore',
    label: 'Average Score',
    icon: BarChart3,
    color: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalAnalyses: 0, bestScore: 0, averageScore: 0 });
  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [res, hist] = await Promise.all([
          getAllAnalyses({ limit: 5 }),
          getScoreHistory().catch(() => ({ data: [] })),
        ]);
        setStats(res.stats);
        setRecent(res.data || []);
        setChartData(
          (hist.data || []).map((d, i) => ({
            ...d,
            label: formatDate(d.date),
            idx: i + 1,
          }))
        );
      } catch (e) {
        toast.error(extractErrorMessage(e, 'Failed to load dashboard'));
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your resume optimization progress</p>
        </div>
        <Link to="/analyze" className="btn-primary">
          <Sparkles className="w-4 h-4" /> Analyze New Resume
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-5">
          <LoadingSkeleton className="h-36" count={3} />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {STAT_CARDS.map((s) => {
            const Icon = s.icon;
            const value = stats[s.key] || 0;
            return (
              <div key={s.key} className="card-hover p-6 animate-slide-up">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{s.label}</p>
                    <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {s.key === 'totalAnalyses' ? value : value + (s.key.includes('Score') ? '' : '')}
                      {s.key.includes('Score') ? <span className="text-lg text-slate-400 ml-1">/100</span> : null}
                    </p>
                    {s.key === 'averageScore' && value > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" /> Keep improving!
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Score Progress</h3>
              <p className="text-sm text-slate-500">Your ATS scores over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          {loading ? (
            <LoadingSkeleton className="h-64" />
          ) : chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreLine" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
                      fontSize: 13,
                    }}
                    labelStyle={{ fontWeight: 600 }}
                    formatter={(v) => [`${v}/100`, 'ATS Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <LineChart className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 mb-1">No data yet</p>
              <p className="text-sm text-slate-500 mb-4 max-w-xs">
                Run your first analysis and your progress will show up here.
              </p>
              <button onClick={() => navigate('/analyze')} className="btn-secondary text-sm py-2 px-4">
                <FileSearch className="w-4 h-4" /> Start First Analysis
              </button>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Recent Analyses</h3>
              <p className="text-sm text-slate-500">Latest resume reports</p>
            </div>
            {recent.length > 0 && (
              <Link to="/history" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
          {loading ? (
            <div className="space-y-3">
              <LoadingSkeleton className="h-14" count={3} />
            </div>
          ) : recent.length > 0 ? (
            <div className="space-y-3">
              {recent.map((a) => (
                <button
                  key={a._id}
                  onClick={() => navigate(`/report/${a._id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/40 transition-all group text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${getScoreBgClass(a.overallScore)}`}>
                    <span className={`text-sm font-extrabold ${getScoreTextClass(700)(a.overallScore)}`}>
                      {a.overallScore}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary-700 transition-colors">
                      {a.resumeFileName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{a.jobTitle}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(a.createdAt)}
                    </span>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 mb-1">No analyses yet</p>
              <p className="text-sm text-slate-500 mb-4">Get started by analyzing your first resume.</p>
              <button onClick={() => navigate('/analyze')} className="btn-primary text-sm py-2 px-4">
                <FileSearch className="w-4 h-4" /> Analyze Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
