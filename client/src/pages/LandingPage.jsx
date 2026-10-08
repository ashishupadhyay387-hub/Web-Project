import {
  Sparkles,
  Shield,
  Target,
  Zap,
  BarChart3,
  BrainCircuit,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  LineChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Target,
    title: 'ATS Score Analysis',
    desc: 'Get an AI-powered ATS-style estimate (0–100) across keywords, skills, experience, formatting and more.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: BarChart3,
    title: 'Keyword Matching',
    desc: 'See exactly which keywords from the job description your resume hits — and which ones it misses.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: BrainCircuit,
    title: 'AI Suggestions',
    desc: 'Actionable, specific suggestions to improve every section of your resume, generated with AI.',
    color: 'from-violet-500 to-violet-700',
  },
  {
    icon: Sparkles,
    title: 'Section Improvement',
    desc: 'Instantly rewrite bullets and summaries with stronger action verbs and measurable language.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Strengths & Weaknesses',
    desc: 'Clear, balanced feedback on what you already do well and where to focus your improvement efforts.',
    color: 'from-rose-500 to-rose-700',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Powered by Groq for ultra-fast AI analysis. Get a full report in seconds, not minutes.',
    color: 'from-cyan-500 to-cyan-700',
  },
];

const HOW = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Resume',
    desc: 'Drop in a PDF or DOCX file. We extract the text securely on our server.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Paste the Job Description',
    desc: 'Add the JD for the role you want. The AI compares your resume directly against it.',
  },
  {
    icon: LineChart,
    step: '03',
    title: 'Get Your ATS Report',
    desc: 'See your score, matched keywords, suggestions, and per-section analysis in seconds.',
  },
];

const FAQ = [
  {
    q: 'Is this a real Applicant Tracking System?',
    a: 'ResumeAI provides an AI-based ATS-style estimate of how your resume compares to a job description. It is designed to mirror the kinds of checks and scoring many ATS systems perform, but it is not affiliated with or replicating any specific vendor.',
  },
  {
    q: 'Does ResumeAI invent skills or experience?',
    a: 'No. The AI is strictly instructed to only reflect information that actually appears in your resume. Suggestions tell you what to improve, but never invent qualifications.',
  },
  {
    q: 'What file formats can I upload?',
    a: 'We support PDF and DOCX files up to 5 MB. For best results, use text-based PDFs (not scanned images).',
  },
  {
    q: 'Is my resume stored?',
    a: 'Files are only processed long enough to extract text and are then deleted. Analysis reports (scores, keywords, etc.) are saved in your account history so you can review them later.',
  },
  {
    q: 'How do I improve a low score?',
    a: 'Start with the missing keywords and suggestions tabs in your report. Focus on items that are true for you — never add skills you do not actually have.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-violet-50 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">
                Powered by Groq AI · Lightning Fast
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 animate-slide-up" style={{ animationDelay: '50ms' }}>
              Make Your Resume
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-violet-600 mt-1">
                ATS Ready
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Analyze your resume against any job description with AI-powered resume insights.
              See your score, match keywords, and get actionable suggestions — in seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <Link to="/register" className="btn-primary btn-lg w-full sm:w-auto">
                Check My Resume <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="btn-secondary btn-lg w-full sm:w-auto">
                How It Works
              </a>
            </div>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {['PDF & DOCX Support', 'JWT Auth', 'MongoDB Backed', 'Saves Full History'].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '350ms' }}>
            <div className="card p-6 md:p-8 shadow-card-hover">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Sample Report</p>
                  <h3 className="text-xl font-bold text-slate-900">Senior MERN Developer</h3>
                </div>
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Good Match
                </span>
              </div>
              <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
                <div className="flex justify-center">
                  <svg width="180" height="180" className="-rotate-90">
                    <defs>
                      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    <circle cx="90" cy="90" r="76" fill="transparent" stroke="#e2e8f0" strokeWidth="14" />
                    <circle
                      cx="90"
                      cy="90"
                      r="76"
                      fill="transparent"
                      stroke="url(#g1)"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 76}
                      strokeDashoffset={2 * Math.PI * 76 * 0.22}
                    />
                  </svg>
                  <div className="absolute mt-[52px] ml-[52px] flex flex-col items-center w-[76px]">
                    <span className="text-4xl font-extrabold text-primary-600">78</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Score</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['Keyword Match', 75, 'bg-primary-500'],
                    ['Skills Match', 88, 'bg-emerald-500'],
                    ['Experience Match', 80, 'bg-primary-500'],
                    ['Formatting', 85, 'bg-violet-500'],
                  ].map(([l, v, c]) => (
                    <div key={l}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{l}</span>
                        <span className="font-bold text-slate-900">{v}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${c}`} style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript'].map((k) => (
                  <span key={k} className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-3 h-3" /> {k}
                  </span>
                ))}
                {['Docker', 'AWS', 'TypeScript'].map((k) => (
                  <span key={k} className="badge bg-amber-50 text-amber-700 border border-amber-200">
                    <ChevronUp className="w-3 h-3" /> {k} missing
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
              Everything you need
            </p>
            <h2 className="section-title text-center">Powerful ATS Resume Analysis</h2>
            <p className="section-subtitle text-center mx-auto">
              Everything from keyword matching to AI-written section improvements — all in one place.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card-hover p-6 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
              Simple process
            </p>
            <h2 className="section-title text-center">3 Steps to ATS-Ready</h2>
            <p className="section-subtitle text-center mx-auto">
              From upload to insights in under a minute. No credit card required to start.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative">
                  <div className="card-hover p-7 h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-extrabold text-slate-100">{s.step}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                  {i < HOW.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" className="py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative card overflow-hidden p-8 md:p-12 text-center bg-gradient-to-br from-primary-600 via-primary-600 to-violet-700 text-white border-0">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                Ready to ace your next application?
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Create a free account and run your first ATS analysis in seconds. Start building the resume that gets interviews.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white btn-lg"
                >
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 border border-white/20 btn-lg"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
              FAQ
            </p>
            <h2 className="section-title text-center">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className={`card transition-all duration-200 ${
                    open ? 'ring-2 ring-primary-200' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-slate-900">{item.q}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      open ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 animate-slide-down">
                      <p className="text-slate-500 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
