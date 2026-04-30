import { Link } from "react-router-dom";
import { Settings as SettingsIcon, ArrowLeft } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono transition-colors duration-300">
      
      <SettingsIcon size={64} className="text-gray-500 mb-6" />
      <h1 className="text-4xl font-black mb-2">Paramètres Système</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
        Réglages des caméras, configuration du modèle CNN, seuils d'acceptation et gestion des utilisateurs.
      </p>
      
      <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold">
        <ArrowLeft size={18} />
        Retour au Dashboard
      </Link>
    </div>
  );
}