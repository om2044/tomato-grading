import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Download, MoreHorizontal, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

// Composants globaux
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function History() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Nouveaux états pour gérer la vraie base de données
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gestion du thème sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Récupération des données depuis FastAPI
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/predictions');
        const result = await response.json();
        // On stocke les vraies données dans l'état (result.data vient de notre format FastAPI)
        setPredictions(result.data || []);
      } catch (error) {
        console.error("Erreur de connexion à la base de données :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Adaptation des badges pour tes vraies "decisions" (Export, Local, Rejet)
  const getBadgeStyle = (decision) => {
    switch(decision) {
      case 'Export': return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case 'Local':  return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
      case 'Rejet':  return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:       return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getStatusIcon = (decision) => {
    switch(decision) {
      case 'Export': return <CheckCircle size={14} className="text-green-600 dark:text-green-400" />;
      case 'Local':  return <AlertTriangle size={14} className="text-orange-600 dark:text-orange-400" />;
      case 'Rejet':  return <XCircle size={14} className="text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  // Formatage de la date PostgreSQL en heure lisible
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Filtrage des vraies données
  const filteredData = predictions.filter(item => 
    (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (item.classe && item.classe.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.decision && item.decision.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono overflow-hidden transition-colors duration-300" 
         style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                <Database className="text-blue-500" /> Historique des Scans
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Base de données centrale · {predictions.length} enregistrements récupérés
              </p>
            </div>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm w-fit">
              <Download size={16} /> Exporter CSV
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-none flex-1 flex flex-col min-h-0 overflow-hidden">
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-gray-950/30">
              <div className="relative w-full sm:w-96">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un ID, Classe ou Décision..." 
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

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-950/60 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4">ID Scan</th>
                    <th className="px-6 py-4">Heure</th>
                    <th className="px-6 py-4">Classe Qualité</th>
                    <th className="px-6 py-4">Décision IA</th>
                    <th className="px-6 py-4">Confiance</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin text-blue-500" size={20} />
                          Chargement des données depuis Neon...
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        Aucune donnée trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                        {/* On coupe l'UUID pour qu'il soit propre visuellement (8 premiers caractères) */}
                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white" title={row.id}>
                          {row.id ? row.id.substring(0, 8) : 'N/A'}...
                        </td>
                        <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{formatTime(row.created_at)}</td>
                        <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-bold">
                            Classe {row.classe}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(row.decision)}
                            <span className={`px-2 py-0.5 rounded border text-xs font-bold ${getBadgeStyle(row.decision)}`}>
                              {row.decision}
                            </span>
                          </div>
                        </td>
                        {/* Transformation du float (0.95) en pourcentage (95.0%) */}
                        <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">
                          {row.confidence ? (row.confidence * 100).toFixed(1) : 0}%
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-950/30 mt-auto">
              <span>Affichage de {filteredData.length} enregistrement(s)</span>
              {/* Pagination simplifiée pour la maquette */}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}