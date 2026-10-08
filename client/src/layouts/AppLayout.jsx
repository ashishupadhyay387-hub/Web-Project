import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileSearch,
  History,
  LogOut,
  FileText,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractInitials } from '../utils/helpers';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyze', label: 'Analyze Resume', icon: FileSearch, primary: true },
  { to: '/history', label: 'History', icon: History },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">
              Resume<span className="text-primary-600">AI</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.primary
                      ? isActive
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gradient-to-r from-primary-50 to-white text-primary-700 border border-primary-100 hover:from-primary-100 hover:to-primary-50'
                      : isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.primary && <Sparkles className="w-4 h-4" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm">
                {extractInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-slate-900 hidden sm:block">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/analyze" className="btn-primary text-sm py-2 px-4">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Analyze Resume</span>
                <span className="sm:hidden">Analyze</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
