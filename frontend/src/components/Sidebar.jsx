import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Camera, Database, BarChart2, Bell, Settings, LogOut
} from "lucide-react";

export default function Sidebar() {
  // useLocation permet de savoir sur quelle URL on est actuellement
  const location = useLocation();
  
  // Petite fonction pour vérifier si l'onglet est actif
  const isActive = (path) => location.pathname === path;

  // Style de base pour les boutons
  const baseStyle = "p-2.5 rounded-xl transition-all group relative cursor-pointer block";
  const inactiveStyle = "text-gray-400 dark:text-gray-500/70 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900";
  const activeStyle = "bg-gray-100 dark:bg-gray-900 text-green-600 dark:text-green-400";

  return (
    <aside className="w-16 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 gap-8 z-50 flex-shrink-0 transition-colors duration-300">
      
      {/* Logo */}
      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer">
        <span className="text-white dark:text-gray-950 font-black text-xl">T</span>
      </div>

      {/* Navigation Principale */}
      <nav className="flex flex-col gap-5 w-full items-center">
        
        <Link to="/dashboard" className={`${baseStyle} ${isActive('/dashboard') ? activeStyle : inactiveStyle}`}>
          <LayoutDashboard size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Vue Générale</div>
        </Link>

        <Link to="/classifier" className={`${baseStyle} ${isActive('/classifier') ? activeStyle : inactiveStyle}`}>
          <Camera size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Scanner IA</div>
        </Link>

        <Link to="/history" className={`${baseStyle} ${isActive('/history') ? activeStyle : inactiveStyle}`}>
          <Database size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Historique</div>
        </Link>

        <Link to="/reports" className={`${baseStyle} ${isActive('/reports') ? activeStyle : inactiveStyle}`}>
          <BarChart2 size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Rapports</div>
        </Link>

        <Link to="/alerts" className={`${baseStyle} ${isActive('/alerts') ? activeStyle : inactiveStyle}`}>
          <Bell size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Alertes</div>
        </Link>
      </nav>

      {/* Actions du bas */}
      <div className="mt-auto mb-2 flex flex-col gap-2">
        <Link to="/settings" className={`${baseStyle} ${isActive('/settings') ? activeStyle : inactiveStyle}`}>
          <Settings size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Paramètres</div>
        </Link>

        <Link to="/" className="p-2.5 text-gray-400 dark:text-gray-500/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all group relative cursor-pointer block">
          <LogOut size={20} />
          <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 border border-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">Déconnexion</div>
        </Link>
      </div>
    </aside>
  );
}