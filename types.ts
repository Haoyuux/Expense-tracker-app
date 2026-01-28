
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
}

// Fix: Added missing SpendingInsight interface for AI-generated financial insights
export interface SpendingInsight {
  title: string;
  description: string;
  type: 'saving' | 'warning' | 'tip';
}

// Fix: Added missing ReceiptData interface for receipt parsing results
export interface ReceiptData {
  amount: number;
  category: string;
  date: string;
  description: string;
}
