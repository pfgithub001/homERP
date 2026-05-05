export type TransactionType = 'INFLOW' | 'OUTFLOW';

export interface Transaction {
  id: number;
  concept: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
  accountId: number;
  accountName?: string;
  categoryId: number;
  categoryName?: string;
  userId?: number;
  createdAt?: string;
}

export interface TransactionRequest {
  concept: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
  accountId: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  createdAt?: string;
}

export interface Account {
  id: number;
  name: string;
  balance: number;
  currency: string;
  type: 'CASH' | 'BANK';
  createdAt?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}