
import React from 'react';
import { SpendingInsight } from '../types';
import { Card } from './ui/Card';

interface AIInsightsProps {
  insights: SpendingInsight[];
  loading: boolean;
  onRefresh: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, loading, onRefresh }) => {
  return (
    <Card 
      title="Blaise AI Insights" 
      headerAction={
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-8 space-y-3">
             <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-sm text-slate-400 animate-pulse">Blaise is analyzing your patterns...</p>
          </div>
        ) : insights.length > 0 ? (
          insights.map((insight, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/30 group hover:border-indigo-500/30 transition-colors">
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                insight.type === 'saving' ? 'bg-emerald-500/20 text-emerald-400' :
                insight.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                'bg-indigo-500/20 text-indigo-400'
              }`}>
                {insight.type === 'saving' ? '💰' : insight.type === 'warning' ? '⚠️' : '💡'}
              </div>
              <div>
                <h4 className="font-medium text-slate-100 mb-1">{insight.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">Add more transactions to get personalized insights.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
