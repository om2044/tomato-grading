import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Bell, Loader2 } from "lucide-react";
import AlertBanner from "../components/AlertBanner";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { requireValidResponse } from "../services/session";

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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

        await requireValidResponse(response, navigate);
        const data = await response.json();
        setAlerts(data.alerts);
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
    const response = await fetch(`/api/alerts/${idToRemove}/dismiss`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    });
    await requireValidResponse(response, navigate);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <main className="app-main mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <Bell className="text-red-500" /> Journal d'alertes
              </h1>
              <p className="page-subtitle">Incidents actifs et seuils franchis sur la ligne de production.</p>
            </div>
          </div>

          <div className="surface p-5">
            {isLoading ? (
              <div className="flex justify-center p-10 text-sky-500">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : alerts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
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
        </main>
      </div>
    </div>
  );
}
