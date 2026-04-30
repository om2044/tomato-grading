import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Loader2, Zap } from 'lucide-react';

// Les fausses détections (Bounding Boxes)
const BBOXES = [
  {
    label: "Export",  confidence: "98%",
    color: "#22c55e", border: "border-green-500",  text: "text-green-700 dark:text-green-400",
    bg: "bg-green-500/20 dark:bg-green-500/10",
    style: { top: "14%", left: "8%",  width: "28%", height: "38%" },
  },
  {
    label: "Local",   confidence: "85%",
    color: "#f97316", border: "border-orange-500", text: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-500/20 dark:bg-orange-500/10",
    style: { top: "22%", left: "38%", width: "26%", height: "35%" },
  },
  {
    label: "Défaut",  confidence: "99%",
    color: "#ef4444", border: "border-red-500",    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-500/20 dark:bg-red-500/10",
    style: { top: "30%", left: "66%", width: "24%", height: "33%" },
  },
];

export default function ClassifierWidget() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  // Animation du faux "laser" de scan
  useEffect(() => {
    const t = setInterval(() => setScanLine(s => (s + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setAnalysisComplete(false);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const handleReset = () => {
    setImagePreview(null);
    setAnalysisComplete(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col min-h-[450px] shadow-sm dark:shadow-none">
      
      {/* En-tête de la caméra */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Flux Vidéo en Direct — Caméra 1</span>
        </div>
        <div className="flex items-center gap-3">
          {imagePreview && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded cursor-pointer z-50 transition-colors">
              <RefreshCw size={12} /> INITIALISER
            </button>
          )}
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </span>
        </div>
      </div>

      {/* Zone Noire (Le Flux Vidéo / Upload) */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {/* Grille de fond en SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4ade80" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Laser Vert (Visible si en analyse ou si terminé) */}
        {(isAnalyzing || analysisComplete) && (
          <div className="absolute left-0 right-0 h-px bg-green-400/60 dark:bg-green-400/40 pointer-events-none z-30" style={{ top: `${scanLine}%`, boxShadow: "0 0 12px rgba(74,222,128,0.6)", transition: "top 0.03s linear" }} />
        )}

        {/* Gestion de l'affichage Image vs Upload */}
        {!imagePreview ? (
          <label className="z-10 flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 dark:hover:bg-gray-900/30 transition-colors border-2 border-dashed border-gray-600 dark:border-gray-800 m-4 rounded-xl">
            <Upload size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
            <span className="text-gray-300 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Charger une image test</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-4 z-10">
            <img src={imagePreview} className="max-w-full max-h-full object-contain relative z-10 rounded border border-gray-700 dark:border-gray-800" alt="Preview" />
            
            {isAnalyzing && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                <Loader2 size={40} className="text-green-500 animate-spin mb-4" />
                <p className="text-green-400 font-bold uppercase tracking-widest animate-pulse">Analyse en cours...</p>
              </div>
            )}

            {!isAnalyzing && !analysisComplete && (
              <div className="absolute z-20">
                <button onClick={handleAnalyze} className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-3 transition-all cursor-pointer">
                  <Zap size={18} /> Lancer l'analyse
                </button>
              </div>
            )}

            {/* Bounding Boxes après analyse */}
            {analysisComplete && BBOXES.map((box, i) => (
              <div key={i} className={`absolute border-2 ${box.border} bg-black/40 rounded-sm z-20`} style={{ ...box.style, transition: "opacity 0.3s" }}>
                <div className={`absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-bold text-white`} style={{ background: "rgba(0,0,0,0.85)", border: `1px solid ${box.color}`, whiteSpace: "nowrap" }}>
                  <span>{box.label}</span><span className="opacity-70">·</span><span>{box.confidence}</span>
                </div>
                <span className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${box.border}`} /><span className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${box.border}`} /><span className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${box.border}`} /><span className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${box.border}`} />
              </div>
            ))}
          </div>
        )}

        {/* Petit overlay KPIs Vidéo */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between z-30 pointer-events-none">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-black/70 text-green-400 px-2 py-1 rounded border border-green-500/20">Objets détectés : <strong>{analysisComplete ? "3" : "0"}</strong></span>
            <span className="text-xs bg-black/70 text-gray-300 px-2 py-1 rounded border border-gray-700">Latence IA : <strong>{analysisComplete ? "18 ms" : "--"}</strong></span>
          </div>
        </div>
      </div>

      {/* Barre de Status Système (CPU/GPU) */}
      <div className="px-5 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 flex items-center gap-6">
        {[
          { label: "CPU", value: isAnalyzing ? "89%" : "34%",  color: isAnalyzing ? "bg-red-500" : "bg-blue-500" },
          { label: "GPU", value: isAnalyzing ? "95%" : "67%",  color: "bg-purple-500" },
          { label: "Temp", value: "52°C", color: "bg-orange-500" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-600 uppercase w-8">{item.label}</span>
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"><div className={`h-1 ${item.color} rounded-full transition-all duration-500`} style={{ width: item.value.includes("°") ? "52%" : item.value }} /></div>
            <span className="text-xs text-gray-700 dark:text-gray-400 tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}