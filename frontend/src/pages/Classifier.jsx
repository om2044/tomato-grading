import React, { useState, useEffect } from 'react';
import { Brain, Activity, Settings2 } from 'lucide-react';

// On importe nos magnifiques composants réutilisables !
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ClassifierWidget from '../components/ClassifierWidget';
import ConfidenceBar from '../components/ConfidenceBar';

export default function Classifier() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeModel, setActiveModel] = useState('yolo'); // 'yolo' ou 'cnn'

  // Gestion du thème
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono overflow-hidden transition-colors duration-300" 
         style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* 1. LA BARRE LATÉRALE */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
        {/* 2. LA BARRE DE NAVIGATION */}
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        {/* 3. LE CORPS DE LA PAGE */}
        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          
          {/* En-tête de la page */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="text-green-500" /> Scanner IA Hautes Performances
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Analyse densimétrique et colorimétrique en temps réel
              </p>
            </div>
          </div>

          {/* Grille principale */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 flex-1 min-h-0">
            
            {/* GAUCHE : Widget Caméra (prend 2 colonnes sur grand écran) */}
            <div className="xl:col-span-2 flex flex-col min-h-[500px]">
              <ClassifierWidget />
            </div>

            {/* DROITE : Panneau de Diagnostic IA */}
            <div className="flex flex-col gap-4">
              
              {/* Bloc 1: Probabilités actuelles */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-6">
                  <Activity size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Analyse de la trame</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <ConfidenceBar label="Qualité Export (Classe A)" score={94} color="green" />
                  <ConfidenceBar label="Marché Local (Classe B)" score={4} color="orange" />
                  <ConfidenceBar label="Défaut - Pourriture" score={1} color="red" />
                  <ConfidenceBar label="Défaut - Tache" score={1} color="red" />
                </div>
              </div>

              {/* Bloc 2: Paramètres du modèle de Deep Learning */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-none flex-1">
                 <div className="flex items-center gap-2 mb-6">
                  <Settings2 size={16} className="text-gray-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Paramètres Modèle</h3>
                </div>
                
                <div className="space-y-3">
                   <div className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
                     <span className="text-xs text-gray-500 dark:text-gray-400">Architecture CNN</span>
                     <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MobileNet V2</span>
                   </div>
                   <div className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
                     <span className="text-xs text-gray-500 dark:text-gray-400">Fonction de perte</span>
                     <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Categorical Crossentropy</span>
                   </div>
                   <div className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
                     <span className="text-xs text-gray-500 dark:text-gray-400">Seuil de Confiance</span>
                     <span className="text-xs font-bold text-gray-700 dark:text-gray-300">85.0 %</span>
                   </div>
                   <div className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
                     <span className="text-xs text-gray-500 dark:text-gray-400">Vitesse d'inférence</span>
                     <span className="text-xs font-bold text-green-600 dark:text-green-400">18 ms/frame</span>
                   </div>
                   {/* SÉLECTEUR DE MODÈLE */}
<div className="flex p-1 bg-gray-200 dark:bg-gray-800/80 rounded-lg w-fit border border-gray-300 dark:border-gray-700">
  <button 
    onClick={() => setActiveModel('yolo')}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeModel === 'yolo' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
  >
    Mode Production (YOLO)
  </button>
  <button 
    onClick={() => setActiveModel('cnn')}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeModel === 'cnn' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
  >
    Mode Laboratoire (CNN Custom)
  </button>
</div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
    
  );
}