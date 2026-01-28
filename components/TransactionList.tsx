import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500">Belum ada transaksi yang dicatat.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Riwayat Transaksi</h3>
      </div>
      <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        <AnimatePresence mode="popLayout">
          {sortedTransactions.map((transaction) => (
            <motion.div
              layout
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 bg-white"
            >
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden min-w-0 flex-1">
                <div className={`flex-shrink-0 ${transaction.type === TransactionType.INCOME ? 'text-success' : 'text-danger'}`}>
                  {transaction.type === TransactionType.INCOME ? (
                    <ArrowUpCircle className="w-8 h-8 md:w-10 md:h-10" />
                  ) : (
                    <ArrowDownCircle className="w-8 h-8 md:w-10 md:h-10" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 text-sm md:text-base truncate pr-2">
                    {transaction.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">{transaction.category}</span>
                    <span className="hidden xs:inline">•</span>
                    <span className="whitespace-nowrap">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4 ml-2 flex-shrink-0">
                <span className={`font-semibold text-sm md:text-base whitespace-nowrap ${transaction.type === TransactionType.INCOME ? 'text-success' : 'text-danger'}`}>
                  {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatRupiah(transaction.amount)}
                </span>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-slate-300 hover:text-danger hover:bg-red-50 transition-colors p-2 rounded-full"
                  title="Hapus"
                  aria-label="Hapus transaksi"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionList;