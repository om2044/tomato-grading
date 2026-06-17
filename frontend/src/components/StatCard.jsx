const styles = {
  blue: {
    accent: "text-sky-600 dark:text-sky-400",
    bar: "bg-sky-500",
    icon: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
  },
  green: {
    accent: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  red: {
    accent: "text-red-600 dark:text-red-400",
    bar: "bg-red-500",
    icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  },
};

export default function StatCard({ title, value, icon: Icon, color = "blue", progress = 0 }) {
  const current = styles[color] || styles.blue;
  const width = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <div className="surface p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`mt-2 text-3xl font-semibold tracking-tight tabular-nums ${current.accent}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${current.icon}`}>
          <Icon size={19} />
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${current.bar} transition-all duration-500`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
