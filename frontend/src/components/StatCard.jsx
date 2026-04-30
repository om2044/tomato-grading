import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, progress, isDarkMode }) {
  // Dictionnaire de couleurs pour Tailwind
  const styles = {
    blue: {
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500",
      border: "hover:border-blue-300 dark:hover:border-gray-600 border-gray-200 dark:border-gray-800",
      iconBox: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
      glow: "none"
    },
    green: {
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-500",
      border: "hover:border-green-400 dark:hover:border-green-500/60 border-gray-200 dark:border-green-500/30",
      iconBox: "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/30",
      glow: isDarkMode ? "0 0 8px #22c55e" : "none"
    },
    red: {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-500",
      border: "hover:border-red-400 dark:hover:border-red-500/60 border-gray-200 dark:border-red-500/30",
      iconBox: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/30",
      glow: isDarkMode ? "0 0 8px #ef4444" : "none"
    }
  };

  const currentStyle = styles[color] || styles.blue;

  return (
    <div className={`bg-white dark:bg-gray-900 border ${currentStyle.border} rounded-xl p-5 relative overflow-hidden group transition-colors shadow-sm dark:shadow-none`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 dark:from-${color}-500/8 to-transparent pointer-events-none`} />
      
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs uppercase tracking-widest ${color === 'blue' ? 'text-gray-500' : currentStyle.text + ' opacity-80'}`}>
          {title}
        </p>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${currentStyle.iconBox}`}>
          <Icon size={14} className={currentStyle.text} />
        </div>
      </div>
      
      <p className={`text-3xl font-black tabular-nums ${color === 'blue' ? 'text-gray-900 dark:text-white' : currentStyle.text}`}>
        {value.split(' ').map((part, i, arr) => (
          <span key={i} className={i === arr.length - 1 && color === 'blue' ? currentStyle.text : ''}>
            {part} {i !== arr.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
      
      <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-800 rounded-full">
        <div 
          className={`h-1 ${currentStyle.bg} rounded-full transition-all`} 
          style={{ width: `${progress}%`, boxShadow: currentStyle.glow }} 
        />
      </div>
    </div>
  );
}