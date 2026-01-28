
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, SpendingInsight } from './types';
import { STORAGE_KEY, CURRENCY_SYMBOL } from './constants';
import { getSpendingInsights } from './services/geminiService';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SpendingCharts } from './components/SpendingCharts';
import { AIInsights } from './components/AIInsights';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const refreshInsights = useCallback(async () => {
    if (transactions.length < 3) return;
    setLoadingInsights(true);
    const newInsights = await getSpendingInsights(transactions);
    setInsights(newInsights);
    setLoadingInsights(false);
  }, [transactions]);

  // Initial insights load
  useEffect(() => {
    refreshInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalBalance = transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0
  );
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen pb-12">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter text-sm">BT</div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Blaise Tracker</h1>
          </div>
          <div className="text-sm font-medium text-slate-400">
            {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
            <h2 className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
              {CURRENCY_SYMBOL}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M11 20H6.5a1 1 0 01-1-1v-5a1 1 0 011-1h4.414l5.293-5.293a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414L13.828 15H17.5a1 1 0 011 1v3a1 1 0 01-1 1h-4.414L7.793 25.293a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414L11 20z"/></svg>
            </div>
            <p className="text-emerald-400/80 text-sm font-medium mb-1">Income</p>
            <h2 className="text-3xl font-bold text-emerald-400">
              +{CURRENCY_SYMBOL}{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 4h4.5a1 1 0 011 1v5a1 1 0 01-1 1h-4.414l-5.293 5.293a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414L10.172 9H6.5a1 1 0 01-1-1V5a1 1 0 011-1h4.414l5.293-5.293a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414L13 4z"/></svg>
            </div>
            <p className="text-rose-400/80 text-sm font-medium mb-1">Expenses</p>
            <h2 className="text-3xl font-bold text-rose-400">
              -{CURRENCY_SYMBOL}{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forms & List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <TransactionForm onAdd={handleAddTransaction} />
               <AIInsights 
                insights={insights} 
                loading={loadingInsights} 
                onRefresh={refreshInsights} 
               />
            </div>
            
            <SpendingCharts transactions={transactions} />
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-4 flex flex-col">
            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction} 
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 text-center text-slate-600 text-xs">
        <p>© {new Date().getFullYear()} Blaise Financial Assistant. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
