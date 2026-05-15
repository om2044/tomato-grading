import { useState } from 'react';

export function useClassifier() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const resetClassifier = () => {
    setResult(null);
    setError(null);
  };

  const classifyImage = async (imageFile) => {
    setIsClassifying(true);
    setResult(null);
    setError(null);

    try {
      // 1. Get the security token so the backend lets us in
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous n'êtes pas connecté");
      }

      // 2. Package the image file into a format the API can read
      const formData = new FormData();
      formData.append("file", imageFile);

      // 3. Send the image to your FastAPI Python AI!
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Note: We DO NOT set "Content-Type" here. 
          // The browser automatically sets it for FormData with the correct boundaries!
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("L'IA a rencontré un problème avec cette image.");
      }

      // 4. Read the real prediction from the backend
      const data = await response.json();
      
      // 5. Update our UI with the real results
      setResult({
        classe: data.classe,
        confidence: data.confidence,
        decision: data.prediction // "Export", "Local", or "Rotten"
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsClassifying(false);
    }
  };

  // We expose the state and the function so your UI components can use them
  return { classifyImage, resetClassifier, isClassifying, result, error };
}