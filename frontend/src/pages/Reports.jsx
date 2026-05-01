import { Link } from "react-router-dom";
import { BarChart2, ArrowLeft } from "lucide-react";

export default function Reports() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono transition-colors duration-300">
      
      {/* Icône et Titre */}
      <BarChart2 size={64} className="text-green-500 mb-6" />
      <h1 className="text-4xl font-black mb-2">Rapports & Statistiques</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
        Les graphiques de rendements et les bilans de production mensuels seront générés ici.
      </p>
      
      {/* Bouton de retour */}
      <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold shadow-sm dark:shadow-none">
        <ArrowLeft size={18} />
        Retour au Dashboard
      </Link>
    </div>
  );
}