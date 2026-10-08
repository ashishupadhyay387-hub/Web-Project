import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  FileText,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { getAllAnalyses, deleteAnalysis } from '../services/analysisService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate, getScoreBgClass, getScoreColor, getScoreLabel, getScoreTextClass } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function HistoryPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res = await getAllAnalyses({ page: p, limit: 10 });
      setItems(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      toast.error(extractErrorMessage(e, 'Failed to load history'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page > 1) fetchData(page);
  }, [page]); // eslint-disable-line

  const onDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    setDeletingId(id);
    try {
      await deleteAnalysis(id);
      toast.success('Analysis deleted');
      fetchData(page > totalPages - 1 && items.length === 1 ? Math.max(1, page - 1) : page);
    } catch (e) {
      toast.error(extractErrorMessage(e, 'Failed to delete'));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = items.filter((a) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.resumeFileName?.toLowerCase().includes(q) ||
      a.jobTitle?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <History className="w-8 h-8 text-primary-600" /> Analysis History
          </h1>
          <p className="text-slate-500 mt-1">
            View, compare, and manage all your past resume analyses
          </p>
        </div>
        <Link to="/analyze" className="btn-primary">
          <RefreshCw className="w-4 h-4" /> New Analysis
        </Link>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by resume or job…"
            className="input pl-10 py-2 text-sm"
          />
        </div>
        <p className="text-sm text-slate-500 px-1">
          Showing <span className="font-bold text-slate-800">{total}</span> total analyses
        </p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <LoadingSkeleton className="h-20" count={5} />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-4">Resume / Job</div>
              <div className="col-span-2 text-center">ATS Score</div>
              <div className="col-span-2">Keyword / Skills</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <ul className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <li
                  key={a._id}
                  className="px-6 py-4 grid md:grid-cols-12 gap-4 items-center hover:bg-slate-50/60 transition-colors group"
                >
                  <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate group-hover:text-primary-700 transition-colors">
                        {a.resumeFileName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{a.jobTitle}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex md:justify-center">
                    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border ${getScoreBgClass(a.overallScore)}`}>
                      <span className={`text-xl font-extrabold ${getScoreTextClass(700)(a.overallScore)}`}>
                        {a.overallScore}
                      </span>
                      <div className="hidden sm:flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                          {getScoreLabel(a.overallScore)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {[a.categoryScores?.keywordMatch || 0, a.categoryScores?.skillsMatch || 0]
                        .map((v, i) => (
                          <span key={i} className="badge bg-slate-50 text-slate-600 border border-slate-200 py-0">
                            {i === 0 ? 'KW' : 'Skill'}: <span className="font-bold ml-1">{v}%</span>
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(a.createdAt)}
                  </div>

                  <div className="md:col-span-2 flex md:justify-end gap-1.5">
                    <button
                      onClick={() => navigate(`/report/${a._id}`)}
                      className="btn-ghost py-1.5 px-2.5 text-xs text-primary-700 hover:bg-primary-50"
                      title="View report"
                    >
                      <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => navigate('/analyze')}
                      className="btn-ghost py-1.5 px-2.5 text-xs text-slate-600 hover:bg-slate-100"
                      title="Re-analyze"
                    >
                      <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Re-run</span>
                    </button>
                    <button
                      onClick={() => onDelete(a._id)}
                      disabled={deletingId === a._id}
                      className="btn-ghost py-1.5 px-2.5 text-xs text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      {deletingId === a._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page <span className="font-bold text-slate-800">{page}</span> of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="btn-ghost py-1.5 px-2.5 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="btn-ghost py-1.5 px-2.5 text-sm"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
              <FolderOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {total === 0 ? 'No analyses yet' : 'No matching analyses'}
            </h3>
            <p className="text-slate-500 mb-5 max-w-md">
              {total === 0
                ? 'Run your first resume analysis — it takes less than a minute.'
                : 'Try a different search keyword.'}
            </p>
            <Link to="/analyze" className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Analyze a Resume
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
