
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, headerAction }) => {
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
          {headerAction}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
