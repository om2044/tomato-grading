import { useState } from 'react';
import { useAuthStore } from '../store/authStore'; // Assuming this is your Zustand/Redux store

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Send the email & password to FastAPI
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // 2. Check if the backend rejected the login
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Email ou mot de passe incorrect");
      }

      // 3. Success! Get the token and user data
      const data = await response.json();
      
      // 4. Save the VIP pass (token) to the browser's memory so they stay logged in
      localStorage.setItem("token", data.access_token);
      
      // 5. Tell the global store that the user is officially logged in
      login(data.user); 
      
      return true; // Tell the login page it worked

    } catch (err) {
      setError(err.message);
      return false; // Tell the login page it failed
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isAuthenticated, isLoading, error, login: performLogin, logout };
}
