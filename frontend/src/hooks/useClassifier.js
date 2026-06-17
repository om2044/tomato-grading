import { useState } from 'react';
import { clearSession } from '../services/session';

export function useClassifier() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(null);

  const resetClassifier = () => {
    setResult(null);
    setError(null);
  };

  const classifyImage = async (imageFile, model = 'yolo') => {
    setIsClassifying(true);
    setResult(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous n'êtes pas connecté");

      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/predict/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Note: We DO NOT set "Content-Type" here. 
          // The browser automatically sets it for FormData with the correct boundaries!
        },
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          clearSession();
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        }
        throw new Error(errData.detail || "Erreur lors de la classification.");
      }

      const data = await response.json();

      setResult({
        recognized: data.recognized ?? true,
        classe: data.classe,
        confidence: data.confidence,
        decision: data.prediction || data.decision,
        allProbabilities: data.all_probabilities || {},
        modelUsed: data.model_used || model,
        scanId: data.id || null,
        message: data.message || null,
      });

      // On ne compte que les scans valides (confiance suffisante)
      if (data.recognized !== false) {
        setScanCount((prev) => prev + 1);
        setLastScanTime(new Date());
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsClassifying(false);
    }
  };

  return { classifyImage, resetClassifier, isClassifying, result, error, scanCount, lastScanTime };
}
