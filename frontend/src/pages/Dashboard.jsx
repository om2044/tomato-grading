import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Activity, AlertTriangle, TrendingUp, Package,
  Clock, BarChart2, Zap, Thermometer
} from "lucide-react";

import StatCard from "../components/StatCard";
import Navbar from "../components/Navbar";
import ClassifierWidget from "../components/ClassifierWidget";
import Sidebar from "../components/Sidebar";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl z-50">
      <p style={{ color: d.payload.color }} className="font-bold">{d.name}</p>
      {/* NOUVEAU : Affiche la quantité réelle au lieu d'un % statique */}
      <p className="text-gray-600 dark:text-gray-300 mt-0.5">{d.value} Tomates</p>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // NOUVEAU : États pour stocker les vraies données du backend
  const [stats, setStats] = useState({
    total: 0,
    export: 0,
    local: 0,
    rejet: 0,
    confidence: "0%"
  });
  const [rejectsLog, setRejectsLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Applique le thème
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // NOUVEAU : Récupération des données au chargement de la page
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Récupérer le token de sécurité
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirige si non connecté
        return;
      }

      try {
        // 2. Appeler l'API WIDGET STATISTIQUES
        const dashRes = await fetch("/api/dashboard/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          const breakdown = dashData.metrics.breakdown;
          
          setStats({
            total: dashData.metrics.total_scans,
            export: breakdown["Export"] || 0,
            local: breakdown["Local"] || 0,
            rejet:  breakdown["Rejet"] || 0, 
            confidence: dashData.metrics.average_confidence
          });
        }

        // 3. Appeler l'API HISTORIQUE (Pour le journal des rejets)
        const histRes = await fetch("/api/predictions/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (histRes.ok) {
          const histData = await histRes.json();
          // Filtrer seulement les rejets et prendre les 5 derniers
          const badTomatoes = histData.data
            .filter(item => item.decision === "Rejet")
            .slice(0, 5)
            .map(item => ({
              id: item.id,
              time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reason: "Tomate Non-Conforme", // On pourrait améliorer ça avec les sous-classes IA plus tard
              score: `${(item.confidence * 100).toFixed(0)}%`,
              icon: AlertTriangle
            }));
          setRejectsLog(badTomatoes);
        }
      } catch (error) {
        console.error("Erreur de connexion au backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // NOUVEAU : Formater les données pour le graphique (Recharts)
  const PIE_DATA = [
    { name: "Classe A — Export", value: stats.export, color: "#22c55e" },
    { name: "Classe B — Local",  value: stats.local, color: "#f97316" },
    { name: "Classe C — Rejet",  value: stats.rejet, color: "#ef4444" },
  ];

  // NOUVEAU : Calculs des pourcentages pour les cartes
  const exportRate = stats.total > 0 ? Math.round((stats.export / stats.total) * 100) : 0;
  const rejectRate = stats.total > 0 ? Math.round((stats.rejet / stats.total) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono overflow-hidden transition-colors duration-300"
         style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-5 overflow-y-auto">

          {/* KPI CARDS (Maintenant dynamiques !) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
            <StatCard title="Volume Total" value={isLoading ? "..." : `${stats.total}`} icon={Package} color="blue" progress={100} isDarkMode={isDarkMode} />
            <StatCard title="Taux d'Exportation" value={isLoading ? "..." : `${exportRate} %`} icon={TrendingUp} color="green" progress={exportRate} isDarkMode={isDarkMode} />
            <StatCard title="Pertes & Rejets" value={isLoading ? "..." : `${rejectRate} %`} icon={AlertTriangle} color="red" progress={rejectRate} isDarkMode={isDarkMode} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            
            <ClassifierWidget />

            <div className="flex flex-col gap-4">
              {/* DONUT CHART */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col h-[280px] shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={13} className="text-gray-400 dark:text-gray-500" />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Répartition</p>
                  </div>
                </div>
                <div className="relative flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">{exportRate}%</p>
                    <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Export</p>
                  </div>
                </div>
                
                {/* Légende du Pie Chart */}
                <div className="mt-2 flex flex-col gap-1.5">
                  {PIE_DATA.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: d.color, boxShadow: isDarkMode ? `0 0 6px ${d.color}` : 'none' }} /><span className="text-xs text-gray-600 dark:text-gray-400">{d.name}</span></div>
                      <span className="text-xs font-bold tabular-nums" style={{ color: d.color }}>{d.value} t</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* JOURNAL DES REJETS */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col flex-1 min-h-[250px] shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><Activity size={13} className="text-red-500" /><p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Journal des Rejets</p></div>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                  {rejectsLog.length === 0 && !isLoading ? (
                    <p className="text-xs text-gray-500 italic text-center mt-4">Aucun rejet récent.</p>
                  ) : (
                    rejectsLog.map((r) => {
                      const Icon = r.icon;
                      return (
                        <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-950/60 border border-gray-100 dark:border-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 transition-colors group cursor-default">
                          <div className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Icon size={12} className="text-red-500 dark:text-red-400" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug truncate">{r.reason}</p>
                            <div className="flex items-center gap-2 mt-1"><Clock size={9} className="text-gray-400 dark:text-gray-600" /><span className="text-xs text-gray-500 dark:text-gray-600 tabular-nums">{r.time}</span><span className="text-xs text-red-600 dark:text-red-500/70 font-bold">conf. {r.score}</span></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 flex-shrink-0 transition-colors duration-300">
          <div className="max-w-screen-2xl mx-auto px-6 py-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Zap size={12} className="text-yellow-500" />
                Modèle : <span className="text-gray-700 dark:text-gray-300 font-medium">YOLO</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Thermometer size={12} className="text-orange-500" />
                Uptime : <span className="text-gray-700 dark:text-gray-300 font-medium">6h 42min</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 font-semibold tracking-wider">Tomato-Grading OS</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-gray-400 dark:text-gray-500 font-mono">v0.4.0-beta</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
