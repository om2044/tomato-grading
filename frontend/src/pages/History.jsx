import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Download, MoreHorizontal, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// Composants globaux
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// --- FAUSSES DONNÉES (Pour simuler ta future base de données Oracle/NoSQL) ---
const MOCK_DATA = [
  { id: "TOM-8492", time: "14:32:01", lot: "L-104", classe: "Export", conf: "98.5%", status: "success" },
  { id: "TOM-8491", time: "14:31:58", lot: "L-104", classe: "Export", conf: "97.2%", status: "success" },
  { id: "TOM-8490", time: "14:31:45", lot: "L-104", classe: "Local",  conf: "88.0%", status: "warning" },
  { id: "TOM-8489", time: "14:31:30", lot: "L-104", classe: "Rejet",  conf: "99.1%", status: "error", reason: "Moisissure" },
  { id: "TOM-8488", time: "14:31:22", lot: "L-104", classe: "Export", conf: "95.4%", status: "success" },
  { id: "TOM-8487", time: "14:30:15", lot: "L-103", classe: "Rejet",  conf: "92.0%", status: "error", reason: "Taille non conforme" },
  { id: "TOM-8486", time: "14:30:05", lot: "L-103", classe: "Local",  conf: "84.3%", status: "warning" },
  { id: "TOM-8485", time: "14:29:50", lot: "L-103", classe: "Export", conf: "96.7%", status: "success" },
];

export default function History() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Petit dictionnaire pour afficher les bons badges selon le statut
  const getBadgeStyle = (status) => {
    switch(status) {
      case 'success': return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case 'warning': return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
      case 'error':   return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle size={14} className="text-green-600 dark:text-green-400" />;
      case 'warning': return <AlertTriangle size={14} className="text-orange-600 dark:text-orange-400" />;
      case 'error':   return <XCircle size={14} className="text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono overflow-hidden transition-colors duration-300" 
         style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          
          {/* En-tête de la page */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                <Database className="text-blue-500" /> Historique des Scans
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Base de données centrale · 14 250 enregistrements aujourd'hui
              </p>
            </div>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm w-fit">
              <Download size={16} /> Exporter CSV
            </button>
          </div>

          {/* Tableau de bord blanc/sombre */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-none flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Barre d'outils (Recherche + Filtres) */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-gray-950/30">
              
              <div className="relative w-full sm:w-96">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un ID ou un Lot..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex-1 sm:flex-none justify-center">
                  <Filter size={16} className="text-gray-500" /> Filtres
                </button>
              </div>
            </div>

            {/* Le Tableau */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-950/60 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4">ID Tomate</th>
                    <th className="px-6 py-4">Heure</th>
                    <th className="px-6 py-4">Numéro Lot</th>
                    <th className="px-6 py-4">Classification</th>
                    <th className="px-6 py-4">Score IA</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {MOCK_DATA.filter(item => item.id.includes(searchTerm) || item.lot.includes(searchTerm)).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{row.id}</td>
                      <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{row.time}</td>
                      <td className="px-6 py-3 text-gray-500 dark:text-gray-400"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">{row.lot}</span></td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(row.status)}
                          <span className={`px-2 py-0.5 rounded border text-xs font-bold ${getBadgeStyle(row.status)}`}>
                            {row.classe}
                          </span>
                          {row.reason && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({row.reason})</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">{row.conf}</td>
                      <td className="px-6 py-3 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-950/30 mt-auto">
              <span>Affichage de 1 à 8 sur 14 250</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50" disabled>Préc.</button>
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 font-bold">1</button>
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">2</button>
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">3</button>
                <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">Suiv.</button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}