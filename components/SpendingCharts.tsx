
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Card } from './ui/Card';

interface SpendingChartsProps {
  transactions: Transaction[];
}

export const SpendingCharts: React.FC<SpendingChartsProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Prepare data for Pie Chart (Category distribution)
  const categoryData = CATEGORIES.expense.map(cat => ({
    name: cat.label,
    value: expenseTransactions
      .filter(t => t.category === cat.value)
      .reduce((acc, curr) => acc + curr.amount, 0),
    color: cat.color
  })).filter(data => data.value > 0);

  // Prepare data for Bar Chart (Daily trend - last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const trendData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
    amount: expenseTransactions
      .filter(t => t.date === date)
      .reduce((acc, curr) => acc + curr.amount, 0)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Spending by Category">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {categoryData.slice(0, 4).map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{cat.name}</span>
                </div>
            ))}
        </div>
      </Card>

      <Card title="Daily Spending">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#334155' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
