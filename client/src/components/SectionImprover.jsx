import { useState } from 'react';
import { Wand2, Copy, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { improveSection } from '../services/resumeService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

const SECTIONS = [
  { value: 'summary', label: 'Professional Summary' },
  { value: 'experience', label: 'Experience / Work History' },
  { value: 'projects', label: 'Project Descriptions' },
  { value: 'skills', label: 'Skills Section' },
  { value: 'education', label: 'Education Section' },
];

export default function SectionImprover({ resumeContext = '', jobDescription = '' }) {
  const toast = useToast();
  const [sectionType, setSectionType] = useState('summary');
  const [currentText, setCurrentText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onImprove = async () => {
    if (currentText.trim().length < 10) {
      toast.warning('Please enter at least 10 characters of text to improve');
      return;
    }
    setLoading(true);
    setImprovedText('');
    try {
      const res = await improveSection({
        sectionType,
        currentText: currentText.trim(),
        resumeContext,
        jobDescription,
      });
      setImprovedText(res.data.improvedText);
      toast.success('Improved version generated!');
    } catch (e) {
      toast.error(extractErrorMessage(e, 'Failed to improve section'));
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!improvedText) return;
    try {
      await navigator.clipboard.writeText(improvedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Unable to copy to clipboard');
    }
  };

  return (
    <div className="card p-6 border-violet-100 bg-gradient-to-br from-white via-white to-violet-50/30">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <Wand2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900">AI Resume Section Improver</h3>
          <p className="text-sm text-slate-500">
            Paste a section from your resume — the AI will rewrite it with stronger, ATS-friendly language.
            (Nothing is ever invented.)
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Section Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSectionType(s.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                sectionType === s.value
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-200 hover:text-violet-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label flex items-center justify-between">
            <span>Current Text</span>
            <span className="text-xs text-slate-400 font-normal">{currentText.length} chars</span>
          </label>
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            rows={8}
            placeholder={`Paste the current ${SECTIONS.find((s) => s.value === sectionType)?.label || 'section'} from your resume...`}
            className="input resize-none font-mono text-xs leading-relaxed"
          />
        </div>
        <div>
          <label className="label flex items-center justify-between">
            <span>AI-Improved Version</span>
            {improvedText && (
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                {copied ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            )}
          </label>
          <div className="relative rounded-xl border border-slate-200 bg-white">
            {loading ? (
              <div className="h-[200px] flex flex-col items-center justify-center">
                <LoadingSpinner size="md" label="Improving your text…" />
              </div>
            ) : improvedText ? (
              <textarea
                readOnly
                value={improvedText}
                rows={8}
                className="w-full rounded-xl bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-800 outline-none resize-none"
              />
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <Wand2 className="w-8 h-8 mb-2 opacity-60" />
                <p className="text-sm font-medium">Improved text will appear here</p>
                <p className="text-xs mt-0.5 max-w-xs">
                  Tip: Try a single bullet or a few sentences at a time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 max-w-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>AI never adds skills or achievements you didn't already include. It only rewords.</span>
        </div>
        <button
          onClick={onImprove}
          disabled={loading || currentText.trim().length < 10}
          className="btn bg-gradient-to-r from-violet-600 to-primary-600 text-white hover:from-violet-700 hover:to-primary-700 focus:ring-violet-400"
        >
          <Sparkles className="w-4 h-4" /> {loading ? 'Improving…' : 'Improve with AI'}
        </button>
      </div>
    </div>
  );
}
