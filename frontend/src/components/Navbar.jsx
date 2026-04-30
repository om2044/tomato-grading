import React, { useState, useEffect } from 'react';
import { Sun, Moon, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);
  const [online, setOnline] = useState(true);

  // Gestion de l'horloge
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Gestion du clignotement "Ligne Active"
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 800);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" });

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm flex-shrink-0 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Titre Gauche */}
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-widest leading-none">Système de vision</p>
            <h1 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Tomato‑Grading <span className="text-red-500">OS</span>
            </h1>
          </div>
        </div>

        {/* Centre : Statut de la ligne */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" style={{ opacity: blink ? 1 : 0.2, boxShadow: blink ? "0 0 8px #22c55e" : "none", transition: "opacity .2s, box-shadow .2s" }} />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wider">
              LIGNE A : <span className="text-green-600 dark:text-green-400">ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Droite : Actions & Horloge */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            title="Basculer le thème"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={() => setOnline(o => !o)} className={`flex items-center gap-1.5 text-xs ${online ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {online ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span className="hidden sm:inline">{online ? "EN LIGNE" : "HORS LIGNE"}</span>
          </button>
          
          <div className="text-right hidden sm:block">
            <p className="text-lg font-black tabular-nums tracking-widest text-gray-900 dark:text-white leading-none">{timeStr}</p>
            <p className="text-xs text-gray-500 capitalize leading-none mt-0.5">{dateStr}</p>
          </div>
        </div>

      </div>
    </header>
  );
}