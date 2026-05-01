import React from 'react';

export default function ConfidenceBar({ label, score, color = "green" }) {
  // Dictionnaire pour gérer les couleurs de la barre Tailwind
  const colors = {
    green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
    orange: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]",
    red: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
    blue: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
  };

  const bgClass = colors[color] || colors.green;

  return (
    <div className="flex flex-col gap-1.5 w-full mb-3">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">{label}</span>
        <span className="font-bold tabular-nums text-gray-900 dark:text-white">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}