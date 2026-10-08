import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  File,
  AlignLeft,
  Sparkles,
  AlertTriangle,
  Wand2,
  Eraser,
} from 'lucide-react';
import { uploadResume, analyzeResume } from '../services/resumeService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EXAMPLE_JD = `Senior Full-Stack Developer (MERN)

We're looking for a Senior MERN Developer to join our team and help build scalable web applications.

Requirements:
- 3+ years building production apps with React, Node.js, Express, and MongoDB
- Strong experience with REST APIs, authentication (JWT, OAuth), and authorization patterns
- Familiarity with AWS or similar cloud platforms (EC2, S3, Lambda)
- Experience with Docker, CI/CD pipelines (GitHub Actions, Jenkins)
- Knowledge of TypeScript and modern testing frameworks
- Familiarity with microservice architecture and message queues (Redis, Kafka)

Responsibilities:
- Design and implement scalable backend services in Node.js / Express
- Build responsive, accessible React UIs with reusable components
- Collaborate with product and design to ship features end-to-end
- Mentor junior developers and review PRs
- Improve observability, logging, and monitoring`;

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const jdCount = jobDescription.length;
  const jdValid = jdCount >= 30;

  const onFileChosen = async (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const extOk = /\.(pdf|docx)$/i.test(f.name);
    if (!allowed.includes(f.type) && !extOk) {
      toast.error('Only PDF and DOCX files are supported');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB');
      return;
    }
    setFile(f);
    setFileInfo({
      name: f.name,
      size: f.size,
      type: (f.name.split('.').pop() || '').toUpperCase(),
      sizeFormatted: (f.size / 1024).toFixed(1) + ' KB',
    });
    setUploadProgress(0);
    setIsUploading(true);
    setExtractedText('');
    try {
      const fd = new FormData();
      fd.append('resume', f);
      const res = await uploadResume(fd, (p) => setUploadProgress(p));
      setExtractedText(res.data.extractedText);
      setUploadProgress(100);
      toast.success('Resume uploaded and parsed successfully');
    } catch (e) {
      toast.error(extractErrorMessage(e, 'Failed to upload resume'));
      setFile(null);
      setFileInfo(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    onFileChosen(f);
  }, []);

  const removeFile = () => {
    setFile(null);
    setFileInfo(null);
    setExtractedText('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canAnalyze = extractedText.trim().length >= 50 && jdValid && !isAnalyzing && !isUploading;

  const onAnalyze = async () => {
    if (!canAnalyze) return;
    setIsAnalyzing(true);
    setAnalyzeStep(1);
    try {
      const steps = [
        'Preparing resume text…',
        'Extracting keywords from job description…',
        'Running ATS scoring analysis…',
        'Generating actionable suggestions…',
        'Finalizing your report…',
      ];
      for (let i = 1; i <= steps.length; i++) {
        setAnalyzeStep(i);
        if (i === 3) break;
        await new Promise((r) => setTimeout(r, 900));
      }
      const res = await analyzeResume({
        resumeText: extractedText,
        jobDescription,
        fileName: fileInfo?.name || 'resume.pdf',
      });
      for (let i = 3; i <= steps.length; i++) {
        setAnalyzeStep(i);
        await new Promise((r) => setTimeout(r, 450));
      }
      toast.success('Analysis complete!');
      navigate(`/report/${res.data._id}`);
    } catch (e) {
      toast.error(extractErrorMessage(e, 'Failed to analyze resume'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysisLabels = [
    'Preparing resume text…',
    'Extracting keywords from job description…',
    'Running ATS scoring analysis…',
    'Generating actionable suggestions…',
    'Finalizing your report…',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Analyze Resume</h1>
        <p className="text-slate-500 mt-1">
          Upload your resume and paste a job description to receive a full AI-powered ATS report.
        </p>
      </div>

      {isAnalyzing && (
        <div className="card p-8 border-primary-200 animate-fade-in">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-primary-200 blur-xl opacity-30 animate-pulse" />
              <LoadingSpinner size="xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">AI is analyzing your resume…</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              This usually takes 10–30 seconds. Please do not close this page.
            </p>
            <div className="w-full max-w-md space-y-2">
              {analysisLabels.map((lbl, i) => {
                const done = i + 1 < analyzeStep;
                const active = i + 1 === analyzeStep;
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : active ? (
                        <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-200" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${done ? 'text-emerald-700' : active ? 'text-primary-700' : 'text-slate-400'}`}>
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!isAnalyzing && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Resume Upload */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">1. Upload Resume</h2>
                  <p className="text-xs text-slate-500">PDF or DOCX • Max 5 MB</p>
                </div>
              </div>
              {extractedText && (
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                  dragOver
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:bg-primary-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => onFileChosen(e.target.files?.[0])}
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Upload className="w-8 h-8 text-primary-500" />
                </div>
                <p className="font-semibold text-slate-800 mb-1">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  or click to browse files
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="badge bg-white text-slate-600 border border-slate-200">
                    <File className="w-3 h-3" /> PDF
                  </span>
                  <span className="badge bg-white text-slate-600 border border-slate-200">
                    <File className="w-3 h-3" /> DOCX
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileText className="w-7 h-7 text-primary-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{fileInfo?.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{fileInfo?.sizeFormatted}</span>
                      <span className="badge bg-white text-slate-600 border border-slate-200 py-0">
                        {fileInfo?.type}
                      </span>
                    </div>
                    {isUploading ? (
                      <div className="mt-3 space-y-1">
                        <div className="progress-bar">
                          <div
                            className="progress-fill bg-primary-500"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs font-medium text-primary-600">
                          {uploadProgress < 100 ? 'Extracting text…' : 'Parsing complete'}
                        </p>
                      </div>
                    ) : (
                      extractedText && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {extractedText.split(/\s+/).length.toLocaleString()} words extracted
                        </div>
                      )
                    )}
                  </div>
                  <button
                    onClick={removeFile}
                    disabled={isUploading}
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {extractedText && (
                  <div className="mt-4">
                    <details className="group">
                      <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-primary-600 select-none flex items-center gap-1">
                        <AlignLeft className="w-3.5 h-3.5" /> View extracted text
                      </summary>
                      <div className="mt-3 rounded-xl bg-white border border-slate-200 p-4 text-xs leading-relaxed text-slate-600 max-h-52 overflow-y-auto whitespace-pre-wrap">
                        {extractedText}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">2. Job Description</h2>
                  <p className="text-xs text-slate-500">
                    Paste the JD for the role you're targeting
                  </p>
                </div>
              </div>
              {jdValid ? (
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="badge bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Minimum 30 chars
                </span>
              )}
            </div>

            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here. Include role title, required skills, experience, responsibilities, etc."
                rows={15}
                className={`input resize-none font-mono text-xs leading-relaxed ${
                  !jdValid && jobDescription.length > 0 ? 'input-error' : ''
                }`}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  jdValid ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {jdCount.toLocaleString()} / 30+ chars
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setJobDescription(EXAMPLE_JD)}
                className="btn-ghost text-xs py-2 px-3 text-primary-600 hover:bg-primary-50"
              >
                <Wand2 className="w-3.5 h-3.5" /> Use Example JD
              </button>
              {jobDescription && (
                <button
                  onClick={() => setJobDescription('')}
                  className="btn-ghost text-xs py-2 px-3 text-slate-500 hover:bg-slate-100"
                >
                  <Eraser className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!isAnalyzing && (
        <div className="card p-6 bg-gradient-to-br from-white via-white to-primary-50/30 border-primary-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Ready to run the analysis?</h3>
                <p className="text-sm text-slate-500">
                  The AI will compare your resume against the job description and produce a full ATS report.
                </p>
              </div>
            </div>
            <button
              onClick={onAnalyze}
              disabled={!canAnalyze}
              className="btn-primary btn-lg bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5" /> Run ATS Analysis
            </button>
          </div>
          {!canAnalyze && (
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                extractedText.trim().length >= 50 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200'
              }`}>
                {extractedText.trim().length >= 50 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                Resume uploaded & parsed
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                jdValid ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200'
              }`}>
                {jdValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                Valid job description provided
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
