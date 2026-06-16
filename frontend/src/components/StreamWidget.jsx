import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import { Camera, Play, Square, Loader2, AlertTriangle, CheckCircle, Factory, Zap, List, Clock } from 'lucide-react';

export default function StreamWidget({ 
  classifyImage, 
  isClassifying, 
  result, 
  error, 
  activeModel 
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanLine, setScanLine] = useState(0);
  
  // NOUVEAU : État pour stocker l'historique des scans
  const [scanHistory, setScanHistory] = useState([]);
  
  const webcamRef = useRef(null);

  // Animation du laser
  useEffect(() => {
    let t;
    if (isRunning) {
      t = setInterval(() => setScanLine(s => (s + 2) % 100), 30);
    }
    return () => clearInterval(t);
  }, [isRunning]);

 
  useEffect(() => {
    if (result) {
      setScanHistory(prev => {
       
        const newEntry = { 
          ...result, 
          id: Date.now(), 
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit', second:'2-digit' }) 
        };
       
        return [newEntry, ...prev].slice(0, 10);
      });
    }
  }, [result]);

  // Capture silencieuse
  const captureFrame = useCallback(() => {
    if (!webcamRef.current || isClassifying) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const arr = imageSrc.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], `stream_frame_${Date.now()}.jpg`, { type: mime });
        
        classifyImage(file);
      } catch (err) {
        console.error("Erreur de conversion du flux", err);
      }
    }
  }, [classifyImage, isClassifying]);

  
  useEffect(() => {
    let interval;
    if (isRunning && isCameraReady) {
      captureFrame();
      interval = setInterval(captureFrame, 2000); 
    }
    return () => clearInterval(interval);
  }, [isRunning, isCameraReady, captureFrame]);

  const toggleStream = () => setIsRunning(!isRunning);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border-2 border-orange-500/50 rounded-xl overflow-hidden flex flex-col min-h-[500px] shadow-lg shadow-orange-500/10">
      
      {/* En-tête industriel */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-orange-500/30 bg-orange-50 dark:bg-orange-950/20 z-10">
        <div className="flex items-center gap-2">
          <Factory size={16} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
            Flux Continu — {activeModel === 'yolo' ? 'YOLO Production' : 'Mode Labo'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
            {isRunning ? 'EN LIGNE' : 'HORS LIGNE'}
          </span>
        </div>
      </div>

      {/* Zone Principale Divisée (Caméra + Historique) */}
      <div className="flex-1 flex overflow-hidden bg-black relative">
        
        {/* --- PARTIE GAUCHE : CAMERA --- */}
        <div className="relative flex-1 flex items-center justify-center border-r border-gray-800/50">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            onUserMedia={() => setIsCameraReady(true)}
            onUserMediaError={(err) => setCameraError(err.message || "Erreur caméra")}
            className="w-full h-full object-cover opacity-90"
          />

          {isRunning && (
            <div className="absolute left-0 right-0 h-[2px] bg-green-500 pointer-events-none z-30" 
                 style={{ top: `${scanLine}%`, boxShadow: "0 0 15px 2px rgba(34,197,94,0.6)" }} />
          )}

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
               <div className="p-4 bg-red-900/80 border border-red-500 rounded text-red-200 text-sm font-bold flex items-center gap-2">
                <AlertTriangle size={20} /> Impossible d'accéder à la caméra : {cameraError}
              </div>
            </div>
          )}

          {/* Badge d'état superposé sur la vidéo */}
          {isRunning && (
            <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 pointer-events-none">
              {isClassifying ? (
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur border border-gray-700 text-white text-xs px-3 py-1.5 rounded-full">
                  <Loader2 size={12} className="animate-spin text-blue-400" /> Analyse de la trame...
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur border border-gray-700 text-white text-xs px-3 py-1.5 rounded-full">
                  <Zap size={12} className="text-yellow-400" /> Attente de la trame suivante
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- PARTIE DROITE : HISTORIQUE (LOGS) --- */}
        <div className="w-64 bg-gray-950 flex flex-col z-20">
          <div className="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800/50 flex items-center gap-2 bg-gray-900/50">
            <List size={14} /> Journal des scans
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {scanHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
                <Clock size={24} className="opacity-20" />
                <span className="text-xs text-center px-4">Aucun scan enregistré. Démarrez la chaîne.</span>
              </div>
            ) : (
              
              scanHistory.map((item) => {
                // On définit les 3 états possibles
                const isRejet = item.decision === 'Rotten' || item.decision === 'Rejet';
                const isLocal = item.decision === 'Local';
                
                return (
                  <div key={item.id} className={`p-2 rounded border animate-in fade-in slide-in-from-right-4 duration-300 ${
                    isRejet ? 'bg-red-950/40 border-red-900/50' : 
                    isLocal ? 'bg-orange-950/40 border-orange-900/50' : 
                    'bg-green-950/20 border-green-900/30'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {item.time}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 rounded-sm ${
                        isRejet ? 'bg-red-900 text-red-200' : 
                        isLocal ? 'bg-orange-900 text-orange-200' : 
                        'bg-green-900 text-green-200'
                      }`}>
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isRejet ? <AlertTriangle size={14} className="text-red-500" /> : 
                       isLocal ? <CheckCircle size={14} className="text-orange-500" /> : 
                       <CheckCircle size={14} className="text-green-500" />}
                       
                      <span className={`font-bold text-sm ${
                        isRejet ? 'text-red-400' : 
                        isLocal ? 'text-orange-400' : 
                        'text-green-400'
                      }`}>
                        {item.decision === 'Rotten' ? 'Rejet' : item.decision}
                      </span>
                    </div>
                  </div>
                );
              })
                )}
            
          </div>
        </div>
      </div>

      {/* Barre de Contrôle Inférieure */}
      <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between z-10">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Contrôle de la bande</span>
          <span className="text-xs text-gray-500">Capture et journalisation automatiques</span>
        </div>

        <div className="flex items-center gap-3">
          {scanHistory.length > 0 && (
            <button 
              onClick={() => setScanHistory([])}
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider px-3 py-2"
            >
              Vider le journal
            </button>
          )}
          <button 
            onClick={toggleStream}
            disabled={!isCameraReady}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-md ${
              !isCameraReady ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800' :
              isRunning 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30' 
                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/30'
            }`}
          >
            {isRunning ? (
              <><Square size={16} fill="currentColor" /> ARRÊTER LA CHAÎNE</>
            ) : (
              <><Play size={16} fill="currentColor" /> DÉMARRER LA CHAÎNE</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}