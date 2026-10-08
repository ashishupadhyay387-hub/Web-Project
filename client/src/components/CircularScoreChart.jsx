import { getScoreGradient } from '../utils/helpers';

export default function CircularScoreChart({
  score,
  size = 200,
  strokeWidth = 14,
  label = 'ATS SCORE',
  animate = true,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (clamped / 100) * circumference;
  const [start, end] = getScoreGradient(clamped);
  const gradId = `sc-grad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          strokeLinecap="round"
          style={{
            transition: animate ? 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
            animation: animate ? `fill-${gradId} 1.5s ease-out forwards` : 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.strokeDashoffset = offset)}
          ref={(el) => {
            if (el && animate) {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  el.style.strokeDashoffset = offset;
                }, 100);
              });
            }
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br"
          style={{ backgroundImage: `linear-gradient(135deg, ${start}, ${end})` }}>
          {clamped}
        </span>
        <span className="text-sm font-bold text-slate-400 mt-0.5">/ 100</span>
        <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-2">
          {label}
        </span>
      </div>
    </div>
  );
}
