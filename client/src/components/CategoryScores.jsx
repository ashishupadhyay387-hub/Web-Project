import { CATEGORY_LABELS, getProgressFillClass } from '../utils/helpers';

export default function CategoryScores({ categoryScores, compact = false }) {
  if (!categoryScores) return null;
  return (
    <div className="space-y-4">
      {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
        const value = Math.round(categoryScores[key] || 0);
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-medium text-slate-700 ${compact ? 'text-xs' : 'text-sm'}`}>
                {label}
              </span>
              <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'} text-slate-900`}>
                {value}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressFillClass(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
