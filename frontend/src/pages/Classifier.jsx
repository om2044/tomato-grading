import React, { useState, useEffect } from 'react';
import { Brain, Activity, Settings2, Scan, Layers, Factory, Hand } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ClassifierWidget from '../components/ClassifierWidget';
import ConfidenceBar from '../components/ConfidenceBar';
import { useClassifier } from '../hooks/useClassifier';

const DEFAULT_BARS = [
  { key: 'Export', label: 'Qualité Export  (Classe A)', color: 'green'  },
  { key: 'Local',  label: 'Marché Local    (Classe B)', color: 'orange' },
  { key: 'Rejet',  label: 'Défaut / Rejet  (Classe C)', color: 'red'   },
];

export default function Classifier() {
  const [isDarkMode, setIsDarkMode]       = useState(true);
  const [activeModel, setActiveModel]     = useState('yolo');
  const [conveyorMode, setConveyorMode]   = useState(false);

  // Statistiques de la session courante
  const [sessionStats, setSessionStats] = useState({
    Export: 0, Local: 0, Rejet: 0, Inconnu: 0, total: 0
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const { classifyImage, resetClassifier, isClassifying, result, error, scanCount, lastScanTime } = useClassifier();

  // Mise a jour des stats apres chaque resultat
  useEffect(() => {
    if (!result) return;
    const key = result.decision === 'Rotten' ? 'Rejet' : (result.decision || 'Inconnu');
    setSessionStats(prev => ({
      ...prev,
      [key]: (prev[key] ?? 0) + 1,
      total: prev.total + 1,
    }));
  }, [result]);

  // Build confidence bars from real API result
  const confidenceBars = DEFAULT_BARS.map((bar) => ({
    ...bar,
    score: result?.allProbabilities?.[bar.key] ?? 0,
    color: result
      ? (result.decision === bar.key || (result.decision === 'Rotten' && bar.key === 'Rejet') ? bar.color : 'blue')
      : bar.color,
  }));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono overflow-hidden transition-colors duration-300"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-5 overflow-y-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="text-green-500" /> Scanner IA Hautes Performances
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Analyse densimétrique et colorimétrique en temps réel
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
              {/* Compteur de scans */}
              {scanCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-lg">
                  <Scan size={13} className="text-green-500"/>
                  <span><strong className="text-gray-900 dark:text-white">{scanCount}</strong> scan(s)</span>
                  {lastScanTime && <span className="text-gray-400">· {lastScanTime.toLocaleTimeString('fr-FR')}</span>}
                </div>
              )}

              {/* Stats de session : Export / Local / Rejet / Inconnu */}
              {sessionStats.total > 0 && (
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-lg text-xs">
                  <Layers size={13} className="text-gray-400 flex-shrink-0"/>
                  {/* Export count */}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ● {sessionStats.Export} Export
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  {/* Local count */}
                  <span className="font-bold text-orange-500">
                    ● {sessionStats.Local} Local
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  {/* Rejet count */}
                  <span className="font-bold text-red-500">
                    ● {sessionStats.Rejet} Rejet
                  </span>
                  {/* Inconnu - affiché uniquement si au moins 1 occurrence */}
                  {sessionStats.Inconnu > 0 && (
                    <>
                      <span className="text-gray-300 dark:text-gray-700">|</span>
                      <span className="font-bold text-gray-400">
                        ● {sessionStats.Inconnu} Inconnu
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* ── Mode toggle ── */}
              <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700">
                <button
                  onClick={() => setConveyorMode(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    !conveyorMode
                      ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Hand size={13}/> Mode Manuel
                </button>
                <button
                  onClick={() => setConveyorMode(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    conveyorMode
                      ? 'bg-white dark:bg-gray-700 shadow text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Factory size={13}/> 🏭 Chaîne de Production
                </button>
              </div>
            </div>
          </div>

          {/* Mode description banner */}
          {conveyorMode && (
            <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400 text-sm">
              <Factory size={18}/>
              <span>
                <strong>Mode Chaîne de Production activé</strong> — La webcam reste active en permanence.
                Le résultat s'affiche en superposition sur le flux vidéo. Lancez la chaîne pour classifier automatiquement.
              </span>
            </div>
          )}

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 flex-1 min-h-0">

            {/* LEFT: Camera widget */}
            <div className="xl:col-span-2 flex flex-col min-h-[500px]">
              <ClassifierWidget
                mode="webcam"
                conveyorMode={conveyorMode}
                activeModel={activeModel}
                classifyImage={classifyImage}
                isClassifying={isClassifying}
                result={result}
                error={error}
                resetClassifier={resetClassifier}
              />
            </div>

            {/* RIGHT: Diagnostic panel */}
            <div className="flex flex-col gap-4">

              {/* Confidence bars */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-blue-500"/>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Analyse de la trame</h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    isClassifying ? 'bg-green-500/10 border-green-500/30 text-green-500 animate-pulse' : result ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                  }`}>
                    {isClassifying ? 'Analyse…' : result ? 'Terminé' : 'En attente'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {confidenceBars.map(bar => (
                    <ConfidenceBar key={bar.key} label={bar.label} score={bar.score} color={bar.color}/>
                  ))}
                </div>
                {!result && !isClassifying && (
                  <p className="text-center text-xs text-gray-400 mt-4">
                    {conveyorMode ? 'Démarrez la chaîne pour voir les probabilités' : 'Lancez un scan pour voir les probabilités réelles'}
                  </p>
                )}
              </div>

              {/* Model params */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <Settings2 size={15} className="text-gray-500"/>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Paramètres Modèle</h3>
                </div>
                <div className="space-y-3">
                  {[
                    ['Architecture', activeModel === 'yolo' ? 'YOLOv8 Classify' : 'MobileNet V2'],
                    ['Fonction de perte', 'Categorical Crossentropy'],
                    ['Seuil de Confiance', '85.0 %'],
                    ['Vitesse d\'inférence', '18 ms/frame'],
                    ...(result ? [['Dernier scan', `Classe ${result.classe} · ${(result.confidence * 100).toFixed(1)}%`]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                      <span className={`text-xs font-bold ${label === 'Vitesse d\'inférence' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{value}</span>
                    </div>
                  ))}

                  {/* Model selector */}
                  <div className="pt-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Mode d'inférence</p>
                    <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                      <button onClick={() => setActiveModel('yolo')}
                        className={`flex-1 px-2 py-1.5 rounded-md text-xs font-bold transition-all ${activeModel === 'yolo' ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Production (YOLO)
                      </button>
                      <button onClick={() => setActiveModel('cnn')} title="CNN — bientôt disponible"
                        className={`flex-1 px-2 py-1.5 rounded-md text-xs font-bold transition-all ${activeModel === 'cnn' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Labo (CNN)
                      </button>
                    </div>
                    {activeModel === 'cnn' && (
                      <p className="text-[10px] text-yellow-500 mt-1 text-center">⚠️ CNN en cours d'intégration — YOLO utilisé</p>
                    )}
                  </div>

                  {/* Classes legend */}
                  <div className="pt-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Classes</p>
                    {[
                      { label: 'Classe A — Export', color: 'text-green-500', dot: 'bg-green-500' },
                      { label: 'Classe B — Local',  color: 'text-orange-500', dot: 'bg-orange-500' },
                      { label: 'Classe C — Rejet',  color: 'text-red-500',    dot: 'bg-red-500' },
                    ].map(c => (
                      <div key={c.label} className="flex items-center gap-2 text-xs py-0.5">
                        <span className={`w-2 h-2 rounded-full ${c.dot}`}/>
                        <span className={`font-bold ${c.color}`}>{c.label}</span>
                      </div>
                    ))}
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