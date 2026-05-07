import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; 
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth(); // Extract the hook tools
  
  // State to hold what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    // Call the backend via our hook
    const success = await login(email, password);
    
    // If it worked, send them to the dashboard!
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors duration-300 font-mono">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xl dark:shadow-none">
        
        {/* ... (Your existing Logo and Title code remains exactly the same) ... */}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {/* Show error message if login fails */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Email industriel</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update state
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
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state
                placeholder="••••••••" 
                className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-500 transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} // Prevent double clicking
            className="mt-4 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-green-500/30"
          >
            {isLoading ? "Connexion..." : "Authentification"} <ArrowRight size={18} />
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-green-500 hover:text-green-400 font-bold transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}