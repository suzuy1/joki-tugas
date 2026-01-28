import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, PieChart, BrainCircuit } from 'lucide-react';
import { Transaction, AppView, TransactionType } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIAdvisor from './components/AIAdvisor';
import { PWAPrompt } from './components/PWAPrompt';

// Temporary mock data if local storage is empty
import { MOCK_TRANSACTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('dompetCerdasTransactions');
    const savedBalance = localStorage.getItem('dompetCerdasInitialBalance');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedBalance) {
      setInitialBalance(parseFloat(savedBalance));
    }

    setInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('dompetCerdasTransactions', JSON.stringify(transactions));
      localStorage.setItem('dompetCerdasInitialBalance', initialBalance.toString());
    }
  }, [transactions, initialBalance, initialized]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calculate current balance: Initial Capital + Income - Expense
  const calculateCurrentBalance = () => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    return initialBalance + totalIncome - totalExpense;
  };

  const currentBalance = calculateCurrentBalance();
  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* PWA Install Prompt & Offline Indicator */}
      <PWAPrompt />
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex justify-between items-center shadow-sm">
         <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <PieChart className="w-6 h-6 text-secondary" />
            DompetCerdas
          </h1>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${currentBalance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {formatRupiah(currentBalance)}
          </span>
      </div>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-shrink-0 sticky top-0 h-screen z-10 flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <PieChart className="w-8 h-8 text-secondary" />
            DompetCerdas
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kelola Keuangan dengan AI</p>
        </div>

        <div className="px-4 space-y-2 flex-1">
          <button
            onClick={() => setView(AppView.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === AppView.DASHBOARD
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setView(AppView.TRANSACTIONS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === AppView.TRANSACTIONS
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <List className="w-5 h-5" />
            Transaksi
          </button>
           <button
            onClick={() => setView(AppView.ADVISOR)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === AppView.ADVISOR
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            AI Advisor
          </button>
        </div>

        <div className="p-6 border-t border-slate-100">
           <div className="bg-slate-900 rounded-lg p-4 text-white shadow-lg">
              <p className="text-xs text-slate-400 mb-1">Saldo Saat Ini</p>
              <p className="text-lg font-bold">
                 {formatRupiah(currentBalance)}
              </p>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pb-28 md:pb-10 overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Desktop Title Header */}
          <div className="hidden md:flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold text-slate-800">
               {view === AppView.DASHBOARD && 'Ringkasan Keuangan'}
               {view === AppView.TRANSACTIONS && 'Daftar Transaksi'}
               {view === AppView.ADVISOR && 'Konsultasi Cerdas'}
             </h2>
          </div>

          {view === AppView.DASHBOARD && (
             <>
               <Dashboard 
                  transactions={transactions} 
                  initialBalance={initialBalance}
                  onUpdateInitialBalance={setInitialBalance}
               />
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <TransactionForm onAddTransaction={addTransaction} />
                 </div>
                 <div>
                    <AIAdvisor transactions={transactions} />
                 </div>
               </div>
             </>
          )}

          {view === AppView.TRANSACTIONS && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-1 order-2 lg:order-1">
                 <TransactionForm onAddTransaction={addTransaction} />
               </div>
               <div className="lg:col-span-2 order-1 lg:order-2">
                 <TransactionList transactions={transactions} onDelete={deleteTransaction} />
               </div>
            </div>
          )}

           {view === AppView.ADVISOR && (
             <div className="max-w-3xl mx-auto">
               <AIAdvisor transactions={transactions} />
               <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-slate-700">Data Terkini</h3>
                  <TransactionList transactions={transactions.slice(0, 5)} onDelete={deleteTransaction} />
               </div>
             </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView(AppView.DASHBOARD)} 
          className={`flex flex-col items-center gap-1 p-2 rounded-lg w-full transition-colors ${view === AppView.DASHBOARD ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
           <LayoutDashboard className="w-6 h-6" />
           <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button 
          onClick={() => setView(AppView.TRANSACTIONS)} 
          className={`flex flex-col items-center gap-1 p-2 rounded-lg w-full transition-colors ${view === AppView.TRANSACTIONS ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
           <List className="w-6 h-6" />
           <span className="text-[10px] font-medium">Transaksi</span>
        </button>
        <button 
          onClick={() => setView(AppView.ADVISOR)} 
          className={`flex flex-col items-center gap-1 p-2 rounded-lg w-full transition-colors ${view === AppView.ADVISOR ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
           <BrainCircuit className="w-6 h-6" />
           <span className="text-[10px] font-medium">Advisor</span>
        </button>
      </div>

    </div>
  );
};

export default App;