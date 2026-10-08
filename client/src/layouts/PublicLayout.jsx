import { Outlet, Link, NavLink } from 'react-router-dom';
import { FileText, LogIn, UserPlus } from 'lucide-react';

const navLinks = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/#faq', label: 'FAQ' },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Resume<span className="text-primary-600">AI</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.to}
                  href={l.to}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm py-2 px-3">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                <UserPlus className="w-4 h-4" /> Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  Resume<span className="text-primary-600">AI</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-md">
                AI-powered ATS resume checker that helps you optimize your resume
                for Applicant Tracking Systems and land more interviews.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="/#features" className="hover:text-primary-600">Features</a></li>
                <li><a href="/#how-it-works" className="hover:text-primary-600">How It Works</a></li>
                <li><a href="/#faq" className="hover:text-primary-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/login" className="hover:text-primary-600">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-primary-600">Create Account</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} ResumeAI. This tool provides AI-based ATS-style estimates.
          </div>
        </div>
      </footer>
    </div>
  );
}
