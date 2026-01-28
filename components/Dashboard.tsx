import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Pencil, Check, X } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  initialBalance?: number;
  onUpdateInitialBalance?: (amount: number) => void;
}

const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  initialBalance = 0, 
  onUpdateInitialBalance 
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState(initialBalance.toString());

  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = initialBalance + totalIncome - totalExpense;

  // Prepare data for Pie Chart (Expenses by Category)
  const expenseByCategory = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expenseByCategory).map((key) => ({
    name: key,
    value: expenseByCategory[key],
  }));

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format number with thousand separator (dot)
  const formatNumberInput = (value: string): string => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // If empty, return empty string
    if (!numericValue) return '';
    
    // Add thousand separators (dots)
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Parse formatted number back to plain number
  const parseFormattedNumber = (value: string): number => {
    const numericValue = value.replace(/\./g, '');
    return parseFloat(numericValue) || 0;
  };

  const handleBalanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Extract digits only from both current and new value
    const currentDigits = tempBalance.replace(/\D/g, '');
    const newDigits = inputValue.replace(/\D/g, '');
    
    // If no change in digits, don't update (prevents cursor jump)
    if (currentDigits === newDigits) {
      return;
    }
    
    // Format the new digit-only value
    const formatted = formatNumberInput(newDigits);
    setTempBalance(formatted);
  };

  const handleSaveBalance = () => {
    if (onUpdateInitialBalance) {
      const val = parseFormattedNumber(tempBalance);
      onUpdateInitialBalance(val);
    }
    setIsEditingBalance(false);
  };

  const handleCancelBalance = () => {
    setTempBalance(formatNumberInput(initialBalance.toString()));
    setIsEditingBalance(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Interactive Balance Card */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 relative group">
          <div className="p-3 bg-indigo-100 rounded-full text-secondary flex-shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center">
               <p className="text-sm text-slate-500 font-medium truncate">
                 {isEditingBalance ? 'Set Modal Awal' : 'Saldo Total'}
               </p>
               {!isEditingBalance && (
                 <button 
                  onClick={() => {
                    setTempBalance(formatNumberInput(initialBalance.toString()));
                    setIsEditingBalance(true);
                  }}
                  className="text-slate-300 hover:text-indigo-500 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                  title="Ubah Modal Awal"
                 >
                   <Pencil className="w-4 h-4" />
                 </button>
               )}
            </div>
            
            {isEditingBalance ? (
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="text"
                  inputMode="numeric"
                  value={tempBalance}
                  onChange={handleBalanceInputChange}
                  placeholder="0"
                  className="w-full px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button onClick={handleSaveBalance} className="text-success hover:bg-green-50 p-1 rounded">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={handleCancelBalance} className="text-danger hover:bg-red-50 p-1 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-lg md:text-xl font-bold text-slate-800 truncate">
                {formatRupiah(currentBalance)}
              </p>
            )}
            {initialBalance > 0 && !isEditingBalance && (
                <p className="text-[10px] text-slate-400 mt-1">
                  Termasuk modal: {formatRupiah(initialBalance)}
                </p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-full text-success flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 font-medium truncate">Pemasukan</p>
            <p className="text-lg md:text-xl font-bold text-success truncate">{formatRupiah(totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full text-danger flex-shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 font-medium truncate">Pengeluaran</p>
            <p className="text-lg md:text-xl font-bold text-danger truncate">{formatRupiah(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Expense Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 min-h-[300px] md:min-h-[350px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Pengeluaran</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatRupiah(value)} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-[200px] md:h-[250px] items-center justify-center text-slate-400 text-sm">
               Belum ada data pengeluaran
             </div>
          )}
        </div>

        {/* Income vs Expense Bar */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 min-h-[300px] md:min-h-[350px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Ringkasan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'Pemasukan', amount: totalIncome },
                { name: 'Pengeluaran', amount: totalExpense },
              ]}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
              <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => formatRupiah(value)} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {
                   [totalIncome, totalExpense].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                   ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;