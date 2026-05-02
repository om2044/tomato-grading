// src/hooks/useAuth.js
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Plus tard, on décommentera ça pour appeler FastAPI :
      // const data = await api.post('/api/auth/login', credentials);
      
      // En attendant, on simule une connexion réussie après 1 seconde :
      setTimeout(() => {
        login({ name: 'Operateur_1', role: 'Admin' });
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return { user, isAuthenticated, isLoading, error, login: performLogin, logout };
}