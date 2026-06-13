import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Sliders, Shield, BellRing, Save, Database, Camera, Cpu, RefreshCw, CheckCircle2 } from "lucide-react";

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('model');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Configuration States
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [selectedModel, setSelectedModel] = useState('yolo_best');
  const [bgRemoval, setBgRemoval] = useState(true);
  const [activeCamera, setActiveCamera] = useState('/dev/video0');
  const [resolution, setResolution] = useState('1080p');
  const [fpsLimit, setFpsLimit] = useState(30);
  const [maxRejectionRate, setMaxRejectionRate] = useState(25);
  const [alertSound, setAlertSound] = useState(true);
  const [alertEmail, setAlertEmail] = useState('superviseur@tomato-grading.com');

  // Gestion du thème
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load saved settings from localStorage if they exist
  useEffect(() => {
    const savedConf = localStorage.getItem('cfg_conf');
    if (savedConf) setConfidenceThreshold(parseInt(savedConf));

    const savedModel = localStorage.getItem('cfg_model');
    if (savedModel) setSelectedModel(savedModel);

    const savedBg = localStorage.getItem('cfg_bg');
    if (savedBg) setBgRemoval(savedBg === 'true');

    const savedCam = localStorage.getItem('cfg_cam');
    if (savedCam) setActiveCamera(savedCam);

    const savedRes = localStorage.getItem('cfg_res');
    if (savedRes) setResolution(savedRes);

    const savedFps = localStorage.getItem('cfg_fps');
    if (savedFps) setFpsLimit(parseInt(savedFps));

    const savedReject = localStorage.getItem('cfg_reject');
    if (savedReject) setMaxRejectionRate(parseInt(savedReject));

    const savedSound = localStorage.getItem('cfg_sound');
    if (savedSound) setAlertSound(savedSound === 'true');

    const savedEmail = localStorage.getItem('cfg_email');
    if (savedEmail) setAlertEmail(savedEmail);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('cfg_conf', confidenceThreshold.toString());
    localStorage.setItem('cfg_model', selectedModel);
    localStorage.setItem('cfg_bg', bgRemoval.toString());
    localStorage.setItem('cfg_cam', activeCamera);
    localStorage.setItem('cfg_res', resolution);
    localStorage.setItem('cfg_fps', fpsLimit.toString());
    localStorage.setItem('cfg_reject', maxRejectionRate.toString());
    localStorage.setItem('cfg_sound', alertSound.toString());
    localStorage.setItem('cfg_email', alertEmail);

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono overflow-hidden transition-colors duration-300"
         style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                <SettingsIcon className="text-gray-500" /> Réglages Système
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configurez l'intelligence artificielle, les trames de caméras et les règles de supervision industrielle
              </p>
            </div>
            
            <button 
              onClick={handleSave} 
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-500/20"
            >
              <Save size={16} /> Enregistrer
            </button>
          </div>

          {/* Alert Save Notification */}
          {showSavedToast && (
            <div className="bg-green-100 border border-green-300 text-green-800 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-bold">Paramètres sauvegardés avec succès ! Les modifications sont appliquées en direct.</span>
            </div>
          )}

          {/* Container principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            
            {/* Sidebar interne de navigation */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab('model')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'model' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <Cpu size={18} /> Intelligence Artificielle
              </button>
              
              <button 
                onClick={() => setActiveTab('camera')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'camera' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <Camera size={18} /> Caméras & Flux Vidéo
              </button>
              
              <button 
                onClick={() => setActiveTab('alerts')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'alerts' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <BellRing size={18} /> Seuils & Notification
              </button>
              
              <button 
                onClick={() => setActiveTab('database')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all text-left ${activeTab === 'database' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
              >
                <Database size={18} /> Base de données Neon
              </button>
            </div>

            {/* Contenu de la configuration */}
            <div className="md:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm dark:shadow-none">
              
              {/* Tab: Intelligence Artificielle */}
              {activeTab === 'model' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      <Sliders size={20} className="text-green-500" /> Configuration YOLO & CNN
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ajustez la précision requise et changez le modèle neuronal en cours d'exécution.
                    </p>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-800" />

                  <div className="space-y-4">
                    {/* Seuil de confiance */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Seuil de Confiance Global</label>
                        <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-black">{confidenceThreshold} %</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="99" 
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                        Toute prédiction dont l'indice de confiance est inférieur à ce seuil lèvera une alerte automatique.
                      </span>
                    </div>

                    {/* Sélection du modèle */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Modèle Actif</label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="yolo_best">Tomato_grading_YOLO_BEST.pt (Production v2.4)</option>
                        <option value="cnn_custom">MobileNet V2 - Customized Lab (Recherche v1.8)</option>
                        <option value="resnet_experimental">ResNet50 Tomato Experimental (v0.9)</option>
                      </select>
                    </div>

                    {/* Background Removal toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Suppression de l'arrière-plan (`rembg`)</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Retire le fond pour maximiser le focus sur le fruit avant l'évaluation.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={bgRemoval} 
                          onChange={(e) => setBgRemoval(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab: Caméras */}
              {activeTab === 'camera' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      <Camera size={20} className="text-green-500" /> Flux de Caméra Industriel
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Configurez l'acquisition vidéo de la ligne de tri optique.
                    </p>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-800" />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Source d'acquisition</label>
                      <select 
                        value={activeCamera}
                        onChange={(e) => setActiveCamera(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="/dev/video0">Caméra intégrée principale (/dev/video0)</option>
                        <option value="/dev/video1">Capteur InfraRouge Ligne A (/dev/video1)</option>
                        <option value="rtsp://192.168.1.150:8554/live">Caméra IP Réseau (RTSP protocol)</option>
                        <option value="test_feed">Flux de simulation - Vidéos pré-enregistrées</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Résolution</label>
                        <select 
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                        >
                          <option value="480p">640x480 (Low quality - Fast)</option>
                          <option value="720p">1280x720 (Standard HD)</option>
                          <option value="1080p">1920x1080 (Full HD - Optimized YOLO)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Fréquence d'analyse (FPS)</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="60" 
                          value={fpsLimit}
                          onChange={(e) => setFpsLimit(parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Alertes */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      <BellRing size={20} className="text-green-500" /> Règles de Supervision & Alertes
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Définissez à quel moment le système doit lever une alerte de production.
                    </p>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-800" />

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Taux de Rejet Max Toléré (Ligne A)</label>
                        <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded text-xs font-black">{maxRejectionRate} %</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="50" 
                        value={maxRejectionRate}
                        onChange={(e) => setMaxRejectionRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                        Si le pourcentage cumulé de tomates classées en "Rejet" dépasse ce seuil sur 100 scans glissants, une alerte critique est déclenchée.
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Alerte Sonore Industrielle</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Bipe sur le terminal de tri lors d'une détection "Rejet".</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={alertSound} 
                          onChange={(e) => setAlertSound(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Destinataire des alertes emails</label>
                      <input 
                        type="email" 
                        value={alertEmail}
                        onChange={(e) => setAlertEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Database */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      <Database size={20} className="text-green-500" /> Intégration Base de Données
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supervisez la liaison avec votre base Neon PostgreSQL.
                    </p>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-800" />

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">État de la liaison</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Instance Cloud active sur Neon.tech</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        OPÉRATIONNEL
                      </span>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Maintenance & Nettoyage</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Supprime l'historique de prédictions datant de plus de 90 jours pour optimiser le stockage.</p>
                      </div>
                      <button className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                        <RefreshCw size={14} /> Purger la DB
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}