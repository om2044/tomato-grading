import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import { Camera, RefreshCw, Upload, Loader2, Zap, CheckCircle, AlertTriangle, ScanLine, Play, Square, Clock, Activity } from 'lucide-react';

// Styles par decision
const DECISION_STYLE = {
  Export:  { border: 'border-green-500',  text: 'text-green-400',  bg: 'bg-green-900/80',  glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]' },
  Local:   { border: 'border-orange-500', text: 'text-orange-400', bg: 'bg-orange-900/80', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]' },
  Rejet:   { border: 'border-red-500',    text: 'text-red-400',    bg: 'bg-red-900/80',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' },
  Inconnu: { border: 'border-gray-500',   text: 'text-gray-400',   bg: 'bg-gray-900/80',   glow: '' },
};

const norm = (d) => (d === 'Rotten' ? 'Rejet' : d || 'Inconnu');
const ds   = (d) => DECISION_STYLE[norm(d)] || DECISION_STYLE.Rejet;

export default function ClassifierWidget({
  classifyImage, isClassifying, result, error, resetClassifier,
  activeModel = 'yolo', mode = 'image', conveyorMode = false,
}) {
  const [imagePreview, setImagePreview]     = useState(null);
  const [imageFile, setImageFile]           = useState(null);
  const [scanLine, setScanLine]             = useState(0);
  const [isCameraReady, setIsCameraReady]   = useState(false);
  const [cameraError, setCameraError]       = useState(null);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [scanIntervalSec, setScanIntervalSec] = useState(3);
  const [countdown, setCountdown]           = useState(null);
  const [overlayResult, setOverlayResult]   = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [scanProgress, setScanProgress]     = useState(0);

  const webcamRef          = useRef(null);
  const autoTimerRef       = useRef(null);
  const countdownTimerRef  = useRef(null);
  const progressTimerRef   = useRef(null);
  const lastScanRef        = useRef(null);
  const isClassifyingRef   = useRef(isClassifying);
  useEffect(() => { isClassifyingRef.current = isClassifying; }, [isClassifying]);

  // Scan laser
  useEffect(() => {
    const t = setInterval(() => setScanLine(s => (s + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);

  // When result arrives in conveyor mode → update overlay + history
  useEffect(() => {
    if (result && conveyorMode) {
      setOverlayResult(result);
      setSessionHistory(prev => [{
        ...result,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }, ...prev].slice(0, 7));
    }
  }, [result, conveyorMode]);

  const startProgressBar = useCallback(() => {
    lastScanRef.current = Date.now();
    setScanProgress(0);
    clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      const p = Math.min(((Date.now() - lastScanRef.current) / (scanIntervalSec * 1000)) * 100, 100);
      setScanProgress(p);
      if (p >= 100) clearInterval(progressTimerRef.current);
    }, 100);
  }, [scanIntervalSec]);

  const startCountdown = useCallback(() => {
    let r = scanIntervalSec;
    setCountdown(r);
    clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      r -= 1; setCountdown(r);
      if (r <= 0) clearInterval(countdownTimerRef.current);
    }, 1000);
  }, [scanIntervalSec]);

  // Image upload
  const handleImageUpload = (e) => {
    const f = e.target.files[0];
    if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
  };

  // Capture from webcam — in conveyor mode never freeze the feed
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const src = webcamRef.current.getScreenshot();
    if (!src) { alert("La caméra n'est pas prête."); return; }
    if (!conveyorMode) setImagePreview(src);
    try {
      const arr = src.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8 = new Uint8Array(n);
      while (n--) u8[n] = bstr.charCodeAt(n);
      const file = new File([u8], 'scan.jpg', { type: mime });
      if (!conveyorMode) setImageFile(file);
      classifyImage(file, activeModel);
    } catch (e) { console.error(e); }
  }, [webcamRef, classifyImage, activeModel, conveyorMode]);

  const doLoop = useCallback(() => {
    if (!isClassifyingRef.current) { capture(); startProgressBar(); }
    startCountdown();
  }, [capture, startProgressBar, startCountdown]);

  const startAutoScan = useCallback(() => {
    if (!isCameraReady) return;
    setIsAutoScanning(true);
    capture(); startCountdown(); startProgressBar();
    autoTimerRef.current = setInterval(doLoop, scanIntervalSec * 1000);
  }, [isCameraReady, capture, startCountdown, startProgressBar, doLoop, scanIntervalSec]);

  const stopAutoScan = useCallback(() => {
    setIsAutoScanning(false); setCountdown(null); setScanProgress(0);
    clearInterval(autoTimerRef.current);
    clearInterval(countdownTimerRef.current);
    clearInterval(progressTimerRef.current);
  }, []);

  useEffect(() => () => stopAutoScan(), [stopAutoScan]);

  const handleReset = () => {
    stopAutoScan(); setImagePreview(null); setImageFile(null);
    setOverlayResult(null); setSessionHistory([]); resetClassifier();
  };

  // Decide layout
  const showWebcam = conveyorMode || (!imagePreview && mode === 'webcam');

  const style = ds(overlayResult?.decision);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col min-h-[450px] shadow-sm dark:shadow-none">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-gray-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">
            {conveyorMode ? '🏭 Mode Chaîne de Production' : mode === 'webcam' ? 'Flux Vidéo — Caméra 1' : 'Upload Image'}
          </span>
          {isAutoScanning && (
            <span className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-[10px] font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {conveyorMode ? 'LIVE' : 'AUTO'} {countdown != null ? `· ${countdown}s` : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {(imagePreview || overlayResult) && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors text-gray-600 dark:text-gray-400">
              <RefreshCw size={12} /> RESET
            </button>
          )}
          <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-500">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAutoScanning ? 'bg-green-500' : 'bg-red-500'}`} />
            {isAutoScanning ? (conveyorMode ? 'CONVEYOR' : 'AUTO') : 'REC'}
          </span>
        </div>
      </div>

      {/* Video zone */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4ade80" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {isClassifying && (
          <div className="absolute left-0 right-0 h-px bg-green-400/60 pointer-events-none z-30"
            style={{ top: `${scanLine}%`, boxShadow: '0 0 12px rgba(74,222,128,0.6)', transition: 'top 0.03s linear' }} />
        )}

        {/* ══ LIVE WEBCAM (webcam + conveyor mode) ══ */}
        {showWebcam && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 z-10">
            <div className="relative w-full flex-1 flex items-center justify-center max-h-[65%]">
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
                onUserMedia={() => setIsCameraReady(true)}
                onUserMediaError={(e) => setCameraError(e.message || 'Erreur caméra')}
                className="max-w-full max-h-full object-contain rounded border border-gray-700"
              />

              {/* Overlay resultat sur le flux video en mode chaine */}
              {conveyorMode && overlayResult && (
                <div className={`absolute top-2 left-2 right-2 flex items-center justify-between px-4 py-2.5 rounded-lg border backdrop-blur-md ${style.border} ${style.bg} ${style.glow} z-40 transition-all duration-300`}>
                  <div className="flex items-center gap-3">
                    {norm(overlayResult.decision) === 'Export'
                      ? <CheckCircle size={22} className={style.text} />
                      : <AlertTriangle size={22} className={style.text} />}
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider">Décision IA</p>
                      <p className={`text-xl font-black ${style.text}`}>{norm(overlayResult.decision)}</p>
                      {overlayResult.decision === 'Inconnu' && (
                        <p className="text-[9px] text-gray-500">Confiance insuffisante</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Classe · Confiance</p>
                    <p className={`text-xl font-mono font-bold ${style.text}`}>
                      {overlayResult.classe} · {(overlayResult.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Subtle "analyzing" indicator in conveyor mode */}
              {isClassifying && conveyorMode && (
                <div className="absolute bottom-2 right-2 z-40 flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded">
                  <Loader2 size={11} className="text-green-500 animate-spin" />
                  <span className="text-green-400 text-[10px] font-bold uppercase">Analyse…</span>
                </div>
              )}
              {/* Full overlay in manual mode */}
              {isClassifying && !conveyorMode && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded">
                  <Loader2 size={40} className="text-green-500 animate-spin mb-3" />
                  <p className="text-green-400 font-bold uppercase tracking-widest animate-pulse">Traitement IA…</p>
                </div>
              )}
              {cameraError && (
                <div className="absolute top-3 left-3 right-3 p-2 bg-red-900/80 border border-red-500 rounded text-red-200 text-xs font-bold text-center z-50">
                  ⚠️ {cameraError}
                </div>
              )}
            </div>

            {/* Progress bar (conveyor only) */}
            {conveyorMode && isAutoScanning && (
              <div className="w-full mt-2">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span className="uppercase tracking-wider flex items-center gap-1"><Clock size={9} /> Prochain scan</span>
                  <span className="font-mono text-green-500">{countdown != null ? `${countdown}s` : '–'}</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}

            {/* Session history strip (conveyor only) */}
            {conveyorMode && sessionHistory.length > 0 && (
              <div className="w-full mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] text-gray-600 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
                  <Activity size={9}/> Historique :
                </span>
                {sessionHistory.map((h, i) => {
                  const hDs = ds(h.decision);
                  return (
                    <div key={i} className={`flex-shrink-0 flex flex-col items-center px-2 py-1 rounded border ${hDs.border} ${hDs.bg} transition-opacity ${i === 0 ? 'opacity-100' : 'opacity-50'}`}>
                      <span className={`text-[10px] font-black ${hDs.text}`}>{norm(h.decision)}</span>
                      <span className="text-[9px] text-gray-400">{(h.confidence * 100).toFixed(0)}%</span>
                      <span className="text-[9px] text-gray-600">{h.time}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Controls */}
            <div className="mt-3 flex flex-col items-center gap-2 w-full max-w-lg z-50">
              {/* Manual scan (hidden when conveyor auto-scanning) */}
              {!(conveyorMode && isAutoScanning) && (
                <button type="button" onClick={capture}
                  disabled={!isCameraReady || isClassifying || isAutoScanning}
                  className={`w-full text-white font-bold uppercase tracking-widest px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    isCameraReady && !isClassifying && !isAutoScanning
                      ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                      : 'bg-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isClassifying
                    ? <><Loader2 size={16} className="animate-spin" /> Analyse…</>
                    : <><ScanLine size={16}/> {isCameraReady ? (conveyorMode ? 'SCAN MANUEL' : 'CAPTURER & ANALYSER') : 'CAMÉRA EN CHARGEMENT…'}</>
                  }
                </button>
              )}

              {/* Auto-scan row */}
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-1.5 bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-400 flex-shrink-0">
                  <Clock size={11}/>
                  <select value={scanIntervalSec} onChange={(e) => setScanIntervalSec(+e.target.value)}
                    disabled={isAutoScanning}
                    className="bg-transparent border-none outline-none text-white font-bold cursor-pointer">
                    <option value={1}>1s</option>
                    <option value={2}>2s</option>
                    <option value={3}>3s</option>
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                  </select>
                </div>
                {!isAutoScanning ? (
                  <button onClick={startAutoScan} disabled={!isCameraReady}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                      isCameraReady ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}>
                    <Play size={14}/> {conveyorMode ? 'Démarrer Chaîne' : 'Auto-Scan'}
                  </button>
                ) : (
                  <button onClick={stopAutoScan}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold uppercase tracking-wide bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all">
                    <Square size={14}/> Arrêter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ UPLOAD MODE ══ */}
        {!imagePreview && mode === 'image' && !conveyorMode && (
          <label className="z-10 flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 transition-colors border-2 border-dashed border-gray-600 m-4 rounded-xl">
            <Upload size={48} className="text-gray-500 mb-4"/>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Charger une image</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload}/>
          </label>
        )}

        {/* ══ IMAGE PREVIEW (manual mode after capture) ══ */}
        {imagePreview && !conveyorMode && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 z-10">
            <div className="relative flex-1 flex items-center justify-center max-h-[70%] w-full">
              <img src={imagePreview} className="max-w-full max-h-full object-contain rounded border border-gray-700" alt="Preview"/>
              {isClassifying && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded">
                  <Loader2 size={40} className="text-green-500 animate-spin mb-3"/>
                  <p className="text-green-400 font-bold uppercase tracking-widest animate-pulse">Traitement IA…</p>
                </div>
              )}
            </div>
            {error && !isClassifying && (
              <div className="mt-4 px-4 py-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 font-bold flex items-center gap-2">
                <AlertTriangle size={16}/> {error}
              </div>
            )}
            {!isClassifying && !result && !error && mode === 'image' && (
              <button onClick={() => classifyImage(imageFile, activeModel)}
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest px-8 py-3 rounded-lg flex items-center gap-2 transition-all">
                <Zap size={16}/> Lancer l'analyse
              </button>
            )}
            {result && !isClassifying && (
              <div className="mt-4 w-full max-w-sm">
                <div className={`p-4 rounded-lg border-2 backdrop-blur-md flex items-center justify-between ${ds(result.decision).border} ${ds(result.decision).bg}`}>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Décision IA</p>
                    <div className="flex items-center gap-2 mt-1">
                      {norm(result.decision) === 'Export' ? <CheckCircle size={18} className={ds(result.decision).text}/> : <AlertTriangle size={18} className={ds(result.decision).text}/>}
                      <span className={`text-xl font-black ${ds(result.decision).text}`}>{norm(result.decision)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Confiance</p>
                    <span className={`text-xl font-mono font-bold ${ds(result.decision).text}`}>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KPI overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between z-30 pointer-events-none">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-black/70 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
              Modèle: <strong>{activeModel === 'yolo' ? 'YOLO v8' : 'CNN Custom'}</strong>
            </span>
            {isAutoScanning && conveyorMode && (
              <span className="text-xs bg-black/70 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20">
                🔄 Chaîne <strong>ACTIVE</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-5 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 flex items-center gap-6">
        {[
          { label: 'CPU', value: isClassifying ? '89%' : '34%', color: isClassifying ? 'bg-red-500' : 'bg-blue-500' },
          { label: 'GPU', value: isClassifying ? '95%' : '67%', color: 'bg-purple-500' },
          { label: 'Temp', value: '52°C', color: 'bg-orange-500' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase w-8">{item.label}</span>
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-800 rounded-full">
              <div className={`h-1 ${item.color} rounded-full transition-all duration-500`} style={{ width: item.value.includes('°') ? '52%' : item.value }}/>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-400 tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}