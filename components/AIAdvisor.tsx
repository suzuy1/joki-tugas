import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvice = async () => {
    if (transactions.length === 0) {
      setAdvice("Silakan tambahkan beberapa transaksi terlebih dahulu agar saya bisa memberikan analisis.");
      return;
    }
    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch on mount if data exists
    if(transactions.length > 0) {
        fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to run only once on mount per view

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Analisis Keuangan AI</h3>
        </div>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Menganalisis...' : 'Analisis Ulang'}
        </button>
      </div>

      <div className="bg-white/80 p-4 rounded-lg border border-indigo-50 min-h-[150px] prose prose-sm max-w-none text-slate-700">
        {loading ? (
           <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
             <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
             <p>Sedang mempelajari data keuangan Anda...</p>
           </div>
        ) : (
          <ReactMarkdown>{advice}</ReactMarkdown>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-3 text-right">
        Didukung oleh Gemini AI models
      </p>
    </div>
  );
};

export default AIAdvisor;