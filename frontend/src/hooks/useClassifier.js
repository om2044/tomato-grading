// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // En attendant la vraie route API, on simule des statistiques :
        setStats({
          totalScans: 14250,
          rejets: 342,
          precisionIA: 98.5
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur chargement dashboard :", error);
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, isLoading };
}