import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";

export default function Alerts() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono transition-colors duration-300">
      
      {/* Icône et Titre */}
      <Bell size={64} className="text-red-500 mb-6 animate-pulse" />
      <h1 className="text-4xl font-black mb-2">Journal d'Alertes</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
        L'historique des pannes machines, arrêts de ligne ou baisses de qualité sévères apparaîtra ici.
      </p>
      
      {/* Bouton de retour */}
      <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold shadow-sm dark:shadow-none">
        <ArrowLeft size={18} />
        Retour au Dashboard
      </Link>
    </div>
  );
}