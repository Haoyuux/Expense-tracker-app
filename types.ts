
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
}

export interface SpendingInsight {
  title: string;
  description: string;
  type: 'saving' | 'warning' | 'tip';
}

export interface ReceiptData {
  amount: number;
  category: string;
  date: string;
  description: string;
}
