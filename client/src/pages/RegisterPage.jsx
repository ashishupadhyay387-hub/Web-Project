import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, UserPlus, Eye, EyeOff, Mail, Lock, AlertCircle, User, CheckCircle2 } from 'lucide-react';
import { useAuth, getAuthError } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwStrength = (() => {
    const p = form.password || '';
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();
  const strengths = ['Too Short', 'Weak', 'Okay', 'Good', 'Strong', 'Excellent'];
  const strengthColors = [
    'bg-slate-200',
    'bg-red-400',
    'bg-amber-400',
    'bg-amber-500',
    'bg-primary-500',
    'bg-emerald-500',
  ];

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'Please enter your name';
    else if (form.name.length > 50) e.name = 'Name is too long';
    if (!form.email) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Please enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (!validatePassword(form.password)) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getAuthError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card p-8 md:p-10 shadow-card-hover">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white shadow-md mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm mt-2 text-center">
              Start optimizing your resumes for free
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="Jane Doe"
                  className={`input pl-11 ${errors.name ? 'input-error' : ''}`}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  placeholder="you@company.com"
                  className={`input pl-11 ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange('password')}
                  placeholder="At least 6 characters"
                  className={`input pl-11 pr-11 ${errors.password ? 'input-error' : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < pwStrength ? strengthColors[Math.max(1, pwStrength)] : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength:{' '}
                    <span className="font-semibold text-slate-700">{strengths[Math.max(0, Math.min(5, pwStrength))]}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                </p>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={onChange('confirmPassword')}
                  placeholder="Re-enter password"
                  className={`input pl-11 pr-11 ${errors.confirmPassword ? 'input-error' : ''}`}
                  autoComplete="new-password"
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Create Account
                </>
              )}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
