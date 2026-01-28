
import React, { useState, useRef } from 'react';
import { CATEGORIES, CURRENCY_SYMBOL } from '../constants';
import { Transaction, TransactionType } from '../types';
import { parseReceipt } from '../services/geminiService';
import { Card } from './ui/Card';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAdd({
      amount: parseFloat(amount),
      type,
      category,
      date,
      description: description || category
    });

    // Reset
    setAmount('');
    setDescription('');
    setCategory('');
  };

  const handleReceiptScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const data = await parseReceipt(base64);
      if (data) {
        setAmount(data.amount.toString());
        setDate(data.date);
        setDescription(data.description);
        // Basic category matching
        const available = CATEGORIES.expense.map(c => c.value);
        if (available.includes(data.category.toLowerCase())) {
          setCategory(data.category.toLowerCase());
        }
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex p-1 bg-slate-900/50 rounded-lg">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-md transition-all ${type === 'expense' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-md transition-all ${type === 'income' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Income
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{CURRENCY_SYMBOL}</span>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-100"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-100"
            >
              <option value="">Select Category</option>
              {CATEGORIES[type].map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-100"
            placeholder="What was this for?"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
          >
            Add Transaction
          </button>
          {type === 'expense' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className={`px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center justify-center ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Scan Receipt"
            >
              {isScanning ? (
                 <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              )}
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleReceiptScan}
        />
      </form>
    </Card>
  );
};
