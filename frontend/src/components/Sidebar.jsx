import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  BarChart2,
  Bell,
  Camera,
  Database,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Vue générale", icon: LayoutDashboard },
  { to: "/classifier", label: "Scanner IA", icon: Camera },
  { to: "/history", label: "Historique", icon: Database },
  { to: "/reports", label: "Rapports", icon: BarChart2 },
  { to: "/alerts", label: "Alertes", icon: Bell },
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const itemClass = (path) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
    }`;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
      <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white shadow-sm">
          T
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-950 dark:text-white">Tomato Grading</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Vision quality control</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={itemClass(to)}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link to="/settings" className={itemClass("/settings")}>
          <Settings size={18} />
          <span>Paramètres</span>
        </Link>
        <Link
          to="/login"
          onClick={() => {
            localStorage.removeItem("token");
            logout();
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
