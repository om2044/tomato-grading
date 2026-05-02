import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import AlertBanner from "../components/AlertBanner"; // Importation de ton nouveau composant

export default function Alerts() {
  // Simulation des alertes provenant de ton backend
  const [alerts, setAlerts] = useState([
    { id: 1, type: "error", message: "LIGNE A : Caméra de tri déconnectée (Timeout 5000ms)" },
    { id: 2, type: "warning", message: "LIGNE B : Baisse de qualité détectée (Taux de rejet > 15%)" },
    { id: 3, type: "info", message: "SYSTÈME : Mise à jour du modèle IA prévue à 02h00" }
  ]);

  // Fonction pour supprimer une alerte quand on clique sur la croix
  const handleCloseAlert = (idToRemove) => {
    setAlerts(alerts.filter(alert => alert.id !== idToRemove));
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono transition-colors duration-300 p-8 overflow-y-auto">
      
      {/* En-tête */}
      <div className="flex flex-col items-center mb-10 mt-8">
        <Bell size={64} className="text-red-500 mb-4 animate-pulse" />
        <h1 className="text-4xl font-black mb-2">Journal d'Alertes</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
          Supervision en temps réel des incidents sur les lignes de production.
        </p>
      </div>
      
      {/* Liste des Alertes (Utilisation de ton composant) */}
      <div className="w-full max-w-2xl flex flex-col gap-2 mb-10">
        {alerts.length === 0 ? (
          <div className="text-center p-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl">
            Aucune alerte active. Tous les systèmes sont nominaux.
          </div>
        ) : (
          alerts.map(alert => (
            <AlertBanner 
              key={alert.id} 
              type={alert.type} 
              message={alert.message} 
              onClose={() => handleCloseAlert(alert.id)} 
            />
          ))
        )}
      </div>
      
      {/* Bouton de retour */}
      <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold shadow-sm dark:shadow-none mt-auto">
        <ArrowLeft size={18} />
        Retour au Dashboard
      </Link>
    </div>
  );
}