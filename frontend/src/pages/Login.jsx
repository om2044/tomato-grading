import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between border-r border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.20),transparent_34%),linear-gradient(135deg,#0f172a,#020617)] p-10 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950">
              T
            </div>
            <div>
              <p className="text-sm font-semibold">Tomato Grading</p>
              <p className="text-xs text-slate-400">Industrial vision platform</p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              <ShieldCheck size={14} />
              Contrôle qualité assisté par IA
            </div>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Pilotage clair des décisions de tri.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Suivez les volumes, analysez les rejets et déclenchez les scans depuis une interface pensée pour les lignes de production.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            {["Export", "Local", "Rejet"].map((label) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Classe</p>
                <p className="mt-1 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <main className="flex items-center justify-center bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white">
                T
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Tomato Grading</h1>
            </div>

            <div className="surface p-7">
              <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-tight">Connexion</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Accédez au tableau de supervision qualité.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="operateur@usine.com"
                      className="field-with-icon"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mot de passe"
                      className="field-with-icon"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                  {isLoading ? "Connexion..." : "Se connecter"}
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Pas encore de compte ?{" "}
                <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  Créer un accès
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
