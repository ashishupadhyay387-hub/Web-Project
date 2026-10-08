export default function LoadingSpinner({ size = 'md', label, className = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-14 h-14 border-4',
    xl: 'w-20 h-20 border-4',
  };
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizes[size]} border-slate-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {label && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">{label}</p>
      )}
    </div>
  );
}
