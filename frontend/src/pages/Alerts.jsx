import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Loader2 } from "lucide-react";
import AlertBanner from "../components/AlertBanner";

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real alerts from the database!
  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("/api/alerts/", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAlerts(data.alerts);
        }
      } catch (error) {
        console.error("Erreur de récupération des alertes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [navigate]);

  // Fonction pour supprimer une alerte (API + UI)
  const handleCloseAlert = async (idToRemove) => {
    // 1. Remove from screen instantly for a snappy UI
    setAlerts(alerts.filter(alert => alert.id !== idToRemove));

    // 2. Tell the database to dismiss it
    const token = localStorage.getItem("token");
    await fetch(`/api/alerts/${idToRemove}/dismiss`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    });
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
      
      {/* Liste des Alertes */}
      <div className="w-full max-w-2xl flex flex-col gap-2 mb-10">
        {isLoading ? (
           <div className="flex justify-center p-8 text-blue-500">
             <Loader2 className="animate-spin" size={32} />
           </div>
        ) : alerts.length === 0 ? (
          <div className="text-center p-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl">
            Aucune alerte active. Tous les systèmes sont nominaux.
          </div>
        ) : (
          alerts.map(alert => (
            <AlertBanner 
              key={alert.id} 
              type={alert.type} 
              message={`${alert.date} - ${alert.message}`} 
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
