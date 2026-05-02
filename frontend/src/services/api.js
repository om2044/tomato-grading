// src/services/api.js
// On récupère l'URL depuis ton .env (ou on met le port 8000 par défaut)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return response.json();
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return response.json();
  }
};