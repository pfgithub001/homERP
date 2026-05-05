import axios from 'axios';
import type { Transaction, TransactionRequest, Category, Account, TransactionSummary } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/api/transactions');
  return response.data;
};

export const createTransaction = async (data: TransactionRequest): Promise<Transaction> => {
  const response = await api.post('/api/transactions', data);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/api/transactions/${id}`);
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/categories');
  return response.data;
};

// Accounts
export const getAccounts = async (): Promise<Account[]> => {
  const response = await api.get('/api/accounts');
  return response.data;
};

// Summary
export const getTransactionSummary = async (): Promise<TransactionSummary> => {
  const response = await api.get('/api/transactions/summary');
  return response.data;
};

export default api;