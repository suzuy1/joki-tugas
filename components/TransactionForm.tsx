import React, { useState } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { suggestCategory } from '../services/geminiService';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const categories = type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Format number with thousand separator (dot)
  const formatNumberInput = (value: string): string => {
    // Remove all non-digit characters first
    const numericValue = value.replace(/\D/g, '');
    
    // If empty, return empty string
    if (!numericValue) return '';
    
    // Add thousand separators (dots)
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Parse formatted number back to plain number
  const parseFormattedNumber = (value: string): number => {
    const numericValue = value.replace(/\D/g, '');
    return parseFloat(numericValue) || 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Extract digits only from both current and new value
    const currentDigits = amount.replace(/\D/g, '');
    const newDigits = inputValue.replace(/\D/g, '');
    
    // If no change in digits, don't update (prevents cursor jump)
    if (currentDigits === newDigits) {
      return;
    }
    
    // Format the new digit-only value
    const formatted = formatNumberInput(newDigits);
    setAmount(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAddTransaction({
      description,
      amount: parseFormattedNumber(amount),
      type,
      category,
      date: new Date(date).toISOString(),
    });

    setDescription('');
    setAmount('');
  };

  const handleAutoCategorize = async () => {
    if (!description) return;
    setIsSuggesting(true);
    const suggested = await suggestCategory(description, type);
    if (suggested && categories.includes(suggested)) {
      setCategory(suggested);
    }
    setIsSuggesting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-primary" />
        Tambah Transaksi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type Selection */}
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => {
              setType(TransactionType.INCOME);
              setCategory(INCOME_CATEGORIES[0]);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg w-full transition-colors ${
              type === TransactionType.INCOME
                ? 'bg-success text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pemasukan
          </button>
          <button
            type="button"
            onClick={() => {
              setType(TransactionType.EXPENSE);
              setCategory(EXPENSE_CATEGORIES[0]);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg w-full transition-colors ${
              type === TransactionType.EXPENSE
                ? 'bg-danger text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Jumlah</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 font-medium">Rp</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Description & AI Button */}
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-slate-600 mb-1">Deskripsi</label>
           <div className="relative">
             <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => { if(description && !isSuggesting) handleAutoCategorize(); }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
              placeholder="Contoh: Makan siang nasi padang"
              required
            />
            <button
              type="button"
              onClick={handleAutoCategorize}
              disabled={isSuggesting || !description}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 disabled:opacity-50"
              title="Auto-Kategori dengan AI"
            >
              {isSuggesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            </button>
           </div>
           <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
             <Sparkles className="w-3 h-3" /> Ketik deskripsi, AI akan menebak kategori.
           </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
      >
        Simpan Transaksi
      </button>
    </form>
  );
};

export default TransactionForm;