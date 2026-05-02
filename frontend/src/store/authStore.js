// src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,             // Stocke les infos de l'utilisateur (nom, rôle)
  isAuthenticated: false, // Vrai si connecté
  
  // Fonction pour se connecter
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  
  // Fonction pour se déconnecter
  logout: () => set({ user: null, isAuthenticated: false }),
}));