import React, { useState, useEffect, useCallback } from 'react';
import { BarChart2, ArrowLeft, Clock3, Layers, TrendingUp, Loader2, AlertCircle, Download, Filter, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- CHANGEMENT 1 : Import direct

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { requireValidResponse } from '../services/session';

const getBadgeStyle = (decision) => {
  switch (decision) {
    case 'Export':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
    case 'Local':
      return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
    case 'Rejet':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
  }
};

export default function Reports() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchReports = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      let url = '/api/reports/';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      await requireValidResponse(response, navigate);
      const data = await response.json();

      setReport(data.report);
    } catch (err) {
      console.error('Erreur de rapport :', err);
      setError(err.message || 'Erreur lors du chargement des rapports');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Fonction pour générer le PDF façon LaTeX
  const handleDownloadPDF = () => {
    if (!report) return; // Sécurité : ne rien faire si pas de données

    const doc = new jsPDF();

    // Configuration de base : Police type LaTeX (Times), texte noir
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);

    // Titre du document
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("Rapport de Production", 105, 20, { align: "center" });

    // Période
    doc.setFontSize(12);
    doc.setFont("times", "italic");
    const dateText = (startDate && endDate) 
      ? `Période : Du ${startDate} au ${endDate}` 
      : `Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`;
    doc.text(dateText, 105, 28, { align: "center" });

    // Section 1 : Statistiques Globales
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("1. Statistiques Globales", 14, 45);

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Total des scans effectués : ${report?.total_scans?.toLocaleString() || 0}`, 20, 55);
    doc.text(`Indice de confiance moyen du modèle : ${report?.average_confidence || "0%"}`, 20, 62);

    doc.text("Répartition des décisions :", 20, 72);
    const bd = report?.decision_breakdown || {};
    doc.text(`• Export : ${bd.Export || 0}`, 30, 80);
    doc.text(`• Local : ${bd.Local || 0}`, 30, 87);
    doc.text(`• Rejet : ${bd.Rejet || 0}`, 30, 94);

    // Section 2 : Production Mensuelle (Tableau style LaTeX booktabs)
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("2. Détail de la Production Mensuelle", 14, 110);

    const tableData = report?.monthly_production?.map(m => [
      m.month, 
      m.total.toLocaleString(), 
      m.export.toLocaleString(), 
      m.local.toLocaleString(), 
      m.rejet.toLocaleString()
    ]) || [];

    // <-- CHANGEMENT 2 : Utilisation de la fonction autoTable directement
    autoTable(doc, {
      startY: 115,
      head: [['Mois', 'Total Scans', 'Export', 'Local', 'Rejet']],
      body: tableData,
      theme: 'plain', 
      styles: { 
        font: 'times', 
        fontSize: 11, 
        textColor: [0, 0, 0],
        halign: 'center' 
      },
      headStyles: { 
        fontStyle: 'bold', 
        lineWidth: { top: 0.5, bottom: 0.5 }, 
        lineColor: [0, 0, 0]
      },
      footStyles: {
        lineWidth: { bottom: 0.5 }, 
        lineColor: [0, 0, 0]
      },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(`Page ${pageCount}`, pageSize.width / 2, pageHeight - 10, { align: 'center' });
      }
    });

    // Dessine la dernière ligne du tableau (bottomrule)
    const finalY = doc.lastAutoTable.finalY;
    doc.setLineWidth(0.5);
    doc.line(14, finalY, 196, finalY);

    // Téléchargement du fichier
    doc.save(`Rapport_Production_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Loader2 size={48} className="animate-spin text-green-500 mb-4" />
        <p className="text-lg font-semibold animate-pulse">Chargement des données...</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Erreur</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">{error}</p>
        <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 rounded-lg transition-colors font-bold">
          <ArrowLeft size={18} /> Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell">
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <main className="app-main">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
              <div>
                <h1 className="page-title text-2xl">
                  <BarChart2 className="text-emerald-500" size={28} />
                  Rapports de production
                </h1>
                <p className="page-subtitle">
                  Vue d'ensemble des rendements et bilans mensuels.
                  {startDate && endDate && (
                    <span className="ml-2 font-semibold">
                       (Du {startDate} au {endDate})
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 shadow-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent border-none text-sm outline-none text-gray-700 dark:text-gray-300 cursor-pointer"
                  />
                  <span className="text-gray-400 font-bold px-1">→</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent border-none text-sm outline-none text-gray-700 dark:text-gray-300 cursor-pointer"
                  />
                </div>

                <button 
                  onClick={fetchReports}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white rounded-lg transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Filter size={16} />}
                  Filtrer
                </button>

                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-bold shadow-sm"
                >
                  <Download size={16} />
                  Générer PDF
                </button>

                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-bold shadow-sm ml-auto xl:ml-2">
                  <ArrowLeft size={16} />
                  Retour
                </Link>
              </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="surface flex flex-col p-6">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-4">
                  <Layers size={20} />
                  <h3 className="font-semibold text-sm uppercase tracking-wider">Total Scans</h3>
                </div>
                <span className="text-4xl font-semibold tracking-tight">{report?.total_scans?.toLocaleString()}</span>
              </div>

              <div className="surface flex flex-col p-6">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-4">
                  <TrendingUp size={20} />
                  <h3 className="font-semibold text-sm uppercase tracking-wider">Confiance Moyenne</h3>
                </div>
                <span className="text-4xl font-semibold tracking-tight text-sky-600 dark:text-sky-400">{report?.average_confidence}</span>
              </div>

              {/* Decision Breakdown (Export, Local, Rejet) */}
              <div className="surface col-span-1 p-8 md:col-span-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Répartition des Décisions</h3>
                <div className="grid grid-cols-3 gap-4 h-full items-end pb-2">
                  {['Export', 'Local', 'Rejet'].map((status) => (
                    <div key={status} className={`p-4 rounded-lg border ${getBadgeStyle(status)} flex flex-col items-center justify-center text-center`}>
                      <span className="text-2xl font-black mb-1 ">{report?.decision_breakdown?.[status] || 0}</span>
                      <span className="text-xs font-bold uppercase">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Production Table */}
            <div className="surface overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <Clock3 className="text-gray-400" size={24} />
                <h2 className="text-xl font-bold">Production Mensuelle</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold border-b border-gray-200 dark:border-gray-800">Mois</th>
                      <th className="p-4 font-semibold border-b border-gray-200 dark:border-gray-800">Total</th>
                      <th className="p-4 font-semibold border-b border-gray-200 dark:border-gray-800 text-green-600 dark:text-green-500">Export</th>
                      <th className="p-4 font-semibold border-b border-gray-200 dark:border-gray-800 text-orange-600 dark:text-orange-500">Local</th>
                      <th className="p-4 font-semibold border-b border-gray-200 dark:border-gray-800 text-red-600 dark:text-red-500">Rejet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {report?.monthly_production?.length > 0 ? (
                      report.monthly_production.map((monthData, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="p-4 font-medium">{monthData.month}</td>
                          <td className="p-4 font-bold">{monthData.total.toLocaleString()}</td>
                          <td className="p-4">{monthData.export.toLocaleString()}</td>
                          <td className="p-4">{monthData.local.toLocaleString()}</td>
                          <td className="p-4">{monthData.rejet.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                          Aucune donnée trouvée pour cette période.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
