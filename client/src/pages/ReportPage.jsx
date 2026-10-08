import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  FileText,
  Calendar,
  Trash2,
  RefreshCw,
  BookOpen,
  Briefcase,
  Award,
  GraduationCap,
  FolderKanban,
  ListChecks,
} from 'lucide-react';
import { getAnalysisById, deleteAnalysis } from '../services/analysisService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  formatDateTime,
  getScoreBgClass,
  getScoreColor,
  getScoreLabel,
  getScoreTextClass,
} from '../utils/helpers';
import CircularScoreChart from '../components/CircularScoreChart';
import CategoryScores from '../components/CategoryScores';
import SectionImprover from '../components/SectionImprover';
import LoadingSpinner from '../components/LoadingSpinner';

const SECTION_TABS = [
  { key: 'summary', label: 'Summary', icon: BookOpen },
  { key: 'skills', label: 'Skills', icon: ListChecks },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'education', label: 'Education', icon: GraduationCap },
];

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [data, setData] = useState(null);
  const [activeSec, setActiveSec] = useState('summary');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getAnalysisById(id);
        setData(res.data);
      } catch (e) {
        toast.error(extractErrorMessage(e, 'Failed to load report'));
        navigate('/history', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, toast]);

  const onDelete = async () => {
    if (!data) return;
    if (!window.confirm('Delete this analysis report permanently?')) return;
    setDeleting(true);
    try {
      await deleteAnalysis(data._id);
      toast.success('Report deleted');
      navigate('/history', { replace: true });
    } catch (e) {
      toast.error(extractErrorMessage(e, 'Delete failed'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" label="Loading report…" />
      </div>
    );
  }
  if (!data) return null;

  const scoreLabel = getScoreLabel(data.overallScore);

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost text-sm py-2 px-3 self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/analyze')}
            className="btn-secondary text-sm py-2 px-4"
          >
            <RefreshCw className="w-4 h-4" /> Re-analyze
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="btn-danger text-sm py-2 px-4"
          >
            <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="card overflow-hidden">
        <div className="grid md:grid-cols-[auto,1fr] items-center gap-8 p-6 md:p-8 bg-gradient-to-br from-white via-white to-slate-50">
          <div className="flex justify-center">
            <CircularScoreChart score={data.overallScore} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`badge border ${getScoreBgClass(data.overallScore)}`}>
                <Award className="w-3.5 h-3.5" /> {scoreLabel}
              </span>
              <span className="badge bg-slate-50 text-slate-600 border border-slate-200">
                AI-based ATS-style estimate
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 break-words">
              {data.jobTitle || 'Untitled Job'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary-500" />
                <span className="font-medium text-slate-700">{data.resumeFileName}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formatDateTime(data.createdAt)}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Your resume scored <span className={`font-bold ${getScoreTextClass(600)(data.overallScore)}`}>{data.overallScore}/100</span> against this job description.
              Review the sections below to see matched keywords, areas of improvement, and actionable suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - category scores */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" /> Category Breakdown
            </h3>
            <CategoryScores categoryScores={data.categoryScores} />
          </div>

          <div className="card p-6 border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/30">
            <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Matched Keywords
            </h3>
            {data.matchedKeywords && data.matchedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.matchedKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="badge bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <CheckCircle2 className="w-3 h-3" /> {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No matched keywords identified.</p>
            )}
          </div>

          <div className="card p-6 border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/30">
            <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Missing Keywords
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Only add keywords that genuinely reflect your skills and experience.
            </p>
            {data.missingKeywords && data.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.missingKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="badge bg-amber-50 text-amber-700 border border-amber-200"
                  >
                    <AlertTriangle className="w-3 h-3" /> {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No obvious missing keywords — nice!</p>
            )}
          </div>
        </div>

        {/* Middle column - strengths/weaknesses */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Strengths
              </h3>
              {data.strengths && data.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">—</p>
              )}
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" /> Weaknesses
              </h3>
              {data.weaknesses && data.weaknesses.length > 0 ? (
                <ul className="space-y-3">
                  {data.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{w}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">—</p>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="card p-6 border-primary-100 bg-gradient-to-br from-white via-white to-primary-50/30">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> How to Improve Your Resume
            </h3>
            {data.suggestions && data.suggestions.length > 0 ? (
              <ol className="space-y-3">
                {data.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{s}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">No suggestions provided.</p>
            )}
          </div>

          {/* Section analysis tabs */}
          <div className="card p-0 overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" /> Resume Section Analysis
              </h3>
              <div className="flex flex-wrap gap-1 border-b border-slate-100 -mx-2 px-2">
                {SECTION_TABS.map((t) => {
                  const Icon = t.icon;
                  const active = activeSec === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveSec(t.key)}
                      className={`px-3 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 -mb-px ${
                        active
                          ? 'bg-white border border-slate-200 border-b-white text-primary-700'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6">
              {data.sectionAnalysis?.[activeSec] ? (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {data.sectionAnalysis[activeSec]}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No AI analysis available for this section.
                </div>
              )}
            </div>
          </div>

          {/* Section improver */}
          <SectionImprover
            resumeContext={`Job title: ${data.jobTitle || ''}. Score: ${data.overallScore}. Keywords: ${(data.matchedKeywords || []).join(', ')}`}
            jobDescription={data.jobTitle || ''}
          />
        </div>
      </div>
    </div>
  );
}
