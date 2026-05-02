// src/hooks/useClassifier.js
import { useState } from 'react';

export function useClassifier() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);

  const classifyImage = async (imageFile) => {
    setIsClassifying(true);
    // Ici, on enverra l'image à l'API IA plus tard.
    // Simulation du temps de calcul du modèle (1.5s) :
    setTimeout(() => {
      setResult({ classe: 'A', confidence: 0.98, decision: 'Export' });
      setIsClassifying(false);
    }, 1500);
  };

  return { classifyImage, isClassifying, result };
}