
import React from 'react';
import { Transaction } from '../types';
import { CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import { Card } from './ui/Card';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const getCategoryLabel = (type: string, value: string) => {
    const list = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    return list.find(c => c.value === value)?.label || 'Other';
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card title="Recent Transactions" className="flex-1">
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No transactions yet.
          </div>
        ) : (
          sortedTransactions.map((t) => (
            <div 
              key={t.id} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {t.type === 'income' ? '↓' : '↑'}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-100">{t.description}</h4>
                  <p className="text-xs text-slate-500">
                    {getCategoryLabel(t.type, t.category)} • {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${
                  t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{CURRENCY_SYMBOL}{t.amount.toFixed(2)}
                </span>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
