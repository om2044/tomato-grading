import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  // Fonction déclenchée quand on clique sur le bouton
  const handleLogin = (e) => {
    e.preventDefault(); // Empêche la page de recharger
    // Ici, plus tard, on vérifiera le mot de passe avec une vraie base de données.
    // Pour l'instant, on simule une connexion réussie et on envoie direct au dashboard !
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors duration-300 font-mono">
      
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xl dark:shadow-none">
        
        {/* Logo et Titre */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] mb-4">
            <span className="text-white dark:text-gray-950 font-black text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Tomato-Grading <span className="text-red-500">OS</span></h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Portail Opérateur</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Email industriel</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="identifiant@usine.com" 
                className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-500 transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-4 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-green-500/30"
          >
            Authentification <ArrowRight size={18} />
          </button>

        </form>

      </div>
    </div>
  );
}