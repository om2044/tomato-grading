// src/components/AlertBanner.jsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AlertBanner({ message, type = "warning", onClose }) {
  // Définition des couleurs industrielles selon la gravité
  const colors = {
    warning: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50"
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg shadow-sm mb-4 transition-all ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="shrink-0" />
        <span className="font-medium text-sm font-mono">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity p-1">
          <X size={18} />
        </button>
      )}
    </div>
  );
}