import { AlertTriangle, X } from 'lucide-react';

export default function AlertBanner({ message, type = "warning", onClose }) {
  const colors = {
    warning: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
    error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
    info: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20"
  };

  return (
    <div className={`mb-3 flex items-center justify-between rounded-lg border p-4 shadow-sm transition ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="rounded-md p-1 transition hover:bg-black/5 dark:hover:bg-white/10">
          <X size={18} />
        </button>
      )}
    </div>
  );
}
