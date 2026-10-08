export const getScoreColor = (score) => {
  if (score >= 85) return 'emerald';
  if (score >= 70) return 'primary';
  if (score >= 50) return 'amber';
  return 'red';
};

export const getScoreLabel = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

export const getScoreGradient = (score) => {
  if (score >= 85) return ['#10b981', '#059669'];
  if (score >= 70) return ['#3b82f6', '#2563eb'];
  if (score >= 50) return ['#f59e0b', '#d97706'];
  return ['#ef4444', '#dc2626'];
};

export const getScoreBgClass = (score) => {
  if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 70) return 'bg-primary-50 text-primary-700 border-primary-200';
  if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

export const getScoreTextClass = (weight = 700) => {
  const map = {
    emerald: { 600: 'text-emerald-600', 700: 'text-emerald-700' },
    primary: { 600: 'text-primary-600', 700: 'text-primary-700' },
    amber: { 600: 'text-amber-600', 700: 'text-amber-700' },
    red: { 600: 'text-red-600', 700: 'text-red-700' },
  };
  return (score) => map[getScoreColor(score)][weight];
};

export const getProgressFillClass = (score) => {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-primary-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const extractInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (pw) => pw && pw.length >= 6;

export const CATEGORY_LABELS = {
  keywordMatch: 'Keyword Match',
  skillsMatch: 'Skills Match',
  experienceMatch: 'Experience Match',
  educationMatch: 'Education Match',
  projectRelevance: 'Projects',
  formatting: 'Formatting',
};
