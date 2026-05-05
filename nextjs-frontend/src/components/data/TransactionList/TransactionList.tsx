'use client';

import React from 'react';
import { Table } from '@/components/generic/Table/Table';
import { Badge } from '@/components/generic/Badge/Badge';
import { getTransactions, deleteTransaction } from '@/services/api';
import type { Transaction } from '@/types';
import styles from './my.module.scss';

interface TransactionListProps {
  onDelete?: (id: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onDelete }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        onDelete?.(id);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'INFLOW' ? '+' : '-';
    return `${prefix}€${amount.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  if (loading) {
    return <div className={styles.loading}>Loading transactions...</div>;
  }

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (item: Transaction) => formatDate(item.date),
    },
    {
      key: 'concept',
      header: 'Concept',
    },
    {
      key: 'category',
      header: 'Category',
      render: (item: Transaction) => item.categoryName,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: Transaction) => (
        <span className={item.type === 'INFLOW' ? styles.inflow : styles.outflow}>
          {formatAmount(item.amount, item.type)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item: Transaction) => (
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
        >
          ×
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={transactions}
      keyExtractor={(item) => item.id}
    />
  );
};