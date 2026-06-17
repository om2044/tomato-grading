import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Wifi, WifiOff } from "lucide-react";

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const [time, setTime] = useState(new Date());
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = time.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="btn-secondary h-9 w-9 p-0 lg:hidden" title="Navigation">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Système de supervision</p>
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnline((value) => !value)}
            className={`badge ${online ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"}`}
          >
            {online ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="hidden sm:inline">{online ? "Ligne active" : "Hors ligne"}</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn-secondary h-9 w-9 p-0"
            title="Basculer le thème"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="hidden border-l border-slate-200 pl-4 text-right dark:border-slate-800 sm:block">
            <p className="text-sm font-semibold tabular-nums text-slate-950 dark:text-white">{timeStr}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Horloge locale</p>
          </div>
        </div>
      </div>
    </header>
  );
}
