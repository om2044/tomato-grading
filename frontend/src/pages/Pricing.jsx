import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, Zap } from "lucide-react";

export default function Pricing() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-12 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* En-tête */}
      <div className="text-center max-w-2xl mb-12 mt-8">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight">Licences & Abonnements</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Choisissez la puissance d'analyse adaptée au volume de votre centre de conditionnement. Sans engagement, annulez à tout moment.
        </p>
      </div>

      {/* Grille des Prix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
        
        {/* Plan 1 : Coopérative */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Coopérative</h2>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Pour les petites exploitations.</p>
          <div className="text-4xl font-black mb-6">499€ <span className="text-lg text-gray-500 font-normal">/mois</span></div>
          
          <ul className="flex flex-col gap-4 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> 1 Caméra de tri</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Modèle CNN Standard</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> 10 000 analyses / jour</li>
            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><X size={16} /> Historique Cloud (Local uniquement)</li>
            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><X size={16} /> Support 24/7</li>
          </ul>
          
          <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Démarrer l'essai
          </button>
        </div>

        {/* Plan 2 : Industriel (Recommandé) */}
        <div className="bg-white dark:bg-gray-900 border-2 border-green-500 dark:border-green-500 rounded-2xl p-8 flex flex-col shadow-xl relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1">
            <Zap size={12} /> Recommandé
          </div>
          <h2 className="text-xl font-bold text-green-600 dark:text-green-500 mb-2">Industriel</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Pour les lignes à haut débit.</p>
          <div className="text-4xl font-black mb-6">1 299€ <span className="text-lg text-gray-500 font-normal">/mois</span></div>
          
          <ul className="flex flex-col gap-4 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Jusqu'à 5 Caméras</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Modèle CNN Fine-Tuning (Personnalisé)</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Analyses illimitées</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Synchronisation Cloud</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Support Prioritaire 5j/7</li>
          </ul>
          
          <button className="w-full py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
            Déployer ce plan
          </button>
        </div>

        {/* Plan 3 : Entreprise */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Entreprise</h2>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Pour les groupes agroalimentaires.</p>
          <div className="text-4xl font-black mb-6">Sur Mesure</div>
          
          <ul className="flex flex-col gap-4 mb-8 flex-1 text-sm">
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Caméras illimitées (Multi-sites)</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Architecture Edge + Cloud</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Intégration ERP (SAP, Oracle)</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> Ingénieur Data dédié</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-green-500" /> SLA 99.9% & Support 24/7</li>
          </ul>
          
          <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Contacter les ventes
          </button>
        </div>

      </div>

      {/* Bouton de retour */}
      <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold mt-auto">
        <ArrowLeft size={18} />
        Retour au Dashboard
      </Link>
    </div>
  );
}
