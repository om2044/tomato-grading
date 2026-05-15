import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import { Camera, RefreshCw, Upload, Loader2, Zap, CheckCircle, AlertTriangle, ScanLine } from 'lucide-react';
import { useClassifier } from '../hooks/useClassifier'; // We are importing your real AI hook!

export default function ClassifierWidget({ mode = 'image' }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Keep the actual file to send to API
  const [scanLine, setScanLine] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const webcamRef = useRef(null);

  // Hook up your real AI connection!
  const { classifyImage, resetClassifier, isClassifying, result, error } = useClassifier();

  // Faux "laser" animation
  useEffect(() => {
    const t = setInterval(() => setScanLine(s => (s + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAnalyze = () => {
    if (imageFile) {
      // Send the real image to your Python backend!
      classifyImage(imageFile);
    }
  };

  const captureAndAnalyze = useCallback(() => {
    console.log("Capture button clicked");
    if (!webcamRef.current) {
      console.error("Webcam ref is null");
      return;
    }
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      console.log("Screenshot captured successfully");
      setImagePreview(imageSrc);
      
      try {
        // Robust base64 to File conversion
        const arr = imageSrc.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], "webcam_capture.jpg", { type: mime });
        
        setImageFile(file);
        classifyImage(file);
      } catch (err) {
        console.error("Failed to convert image and analyze", err);
      }
    } else {
      console.warn("Screenshot returned null - camera might not be ready");
      alert("La caméra n'est pas encore prête ou l'accès est refusé. Veuillez autoriser la caméra et réessayer.");
    }
  }, [webcamRef, classifyImage]);

  const handleReset = () => {
    setImagePreview(null);
    setImageFile(null);
    resetClassifier();
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col min-h-[450px] shadow-sm dark:shadow-none">
      
      {/* En-tête de la caméra */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">
            {mode === 'webcam' ? 'Flux Vidéo en Direct — Caméra 1' : 'Upload Image Scanner'}
          </span>
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

        {/* Laser Vert (Visible si en analyse) */}
        {isClassifying && (
          <div className="absolute left-0 right-0 h-px bg-green-400/60 dark:bg-green-400/40 pointer-events-none z-30" style={{ top: `${scanLine}%`, boxShadow: "0 0 12px rgba(74,222,128,0.6)", transition: "top 0.03s linear" }} />
        )}

        {/* Upload Zone / Webcam Feed */}
        {!imagePreview ? (
          mode === 'webcam' ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 z-10">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                onUserMedia={() => setIsCameraReady(true)}
                onUserMediaError={(err) => setCameraError(err.message || "Erreur d'accès à la caméra")}
                className="max-w-full max-h-[70%] object-contain rounded border border-gray-700 dark:border-gray-800"
              />
              
              {cameraError && (
                <div className="absolute top-4 left-4 right-4 p-3 bg-red-900/80 border border-red-500 rounded text-red-200 text-sm font-bold text-center z-50">
                  ⚠️ Impossible d'accéder à la caméra : {cameraError}
                </div>
              )}

              <button 
                type="button" 
                onClick={captureAndAnalyze} 
                disabled={!isCameraReady}
                className={`mt-6 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-lg flex items-center gap-3 transition-all cursor-pointer z-50 pointer-events-auto ${isCameraReady ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'bg-gray-600 opacity-50 cursor-not-allowed'}`}
              >
                <ScanLine size={18} /> {isCameraReady ? "CAPTURER & ANALYSER" : "CAMÉRA EN CHARGEMENT..."}
              </button>
            </div>
          ) : (
            <label className="z-10 flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 dark:hover:bg-gray-900/30 transition-colors border-2 border-dashed border-gray-600 dark:border-gray-800 m-4 rounded-xl">
              <Upload size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
              <span className="text-gray-300 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">Charger une image test</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 z-10">
            
            {/* The Image */}
            <div className="relative flex-1 flex items-center justify-center max-h-[70%] w-full">
              <img src={imagePreview} className="max-w-full max-h-full object-contain rounded border border-gray-700 dark:border-gray-800" alt="Preview" />
              
              {/* API Loading Overlay */}
              {isClassifying && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded">
                  <Loader2 size={40} className="text-green-500 animate-spin mb-4" />
                  <p className="text-green-400 font-bold uppercase tracking-widest animate-pulse">Traitement IA en cours...</p>
                </div>
              )}
            </div>

            {/* Error Message from Backend */}
            {error && !isClassifying && (
               <div className="mt-4 px-6 py-3 bg-red-500/20 border border-red-500 rounded-lg backdrop-blur text-red-400 font-bold flex items-center gap-2">
                 <AlertTriangle size={18} /> {error}
               </div>
            )}

            {/* The Analyze Button (Only for Upload Mode) */}
            {!isClassifying && !result && !error && mode === 'image' && (
              <button onClick={handleAnalyze} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-3 transition-all cursor-pointer">
                <Zap size={18} /> Lancer l'analyse
              </button>
            )}

            {/* The Real Result from Database! */}
            {result && !isClassifying && (
              <div className="mt-6 w-full max-w-sm">
                <div className={`p-4 rounded-lg border-2 backdrop-blur-md flex items-center justify-between ${
                  result.decision === 'Rotten' || result.decision === 'Rejet' 
                    ? 'bg-red-900/30 border-red-500 text-red-400' 
                    : 'bg-green-900/30 border-green-500 text-green-400'
                }`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Décision IA</span>
                    <div className="flex items-center gap-2 mt-1">
                      {result.decision === 'Rotten' || result.decision === 'Rejet' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                      <span className="text-xl font-black">{result.decision === 'Rotten' ? 'Rejet' : result.decision}</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confiance</span>
                    <span className="text-xl font-mono font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Petit overlay KPIs Vidéo */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between z-30 pointer-events-none">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-black/70 text-blue-400 px-2 py-1 rounded border border-blue-500/20">Modèle: <strong>YOLO v1.0</strong></span>
            {result && <span className="text-xs bg-black/70 text-green-400 px-2 py-1 rounded border border-green-500/20">Statut: <strong>Scan Terminé</strong></span>}
          </div>
        </div>
      </div>

      {/* Barre de Status Système */}
      <div className="px-5 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 flex items-center gap-6">
        {[
          { label: "CPU", value: isClassifying ? "89%" : "34%",  color: isClassifying ? "bg-red-500" : "bg-blue-500" },
          { label: "GPU", value: isClassifying ? "95%" : "67%",  color: "bg-purple-500" },
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