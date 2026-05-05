'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Table } from '@/components/generic/Table/Table';
import { getTransactions, deleteTransaction } from '@/services/api';
import type { Transaction } from '@/types';
import styles from './my.module.scss';

const PAGE_SIZE = 25;

interface TransactionListProps {
  onDelete?: (id: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onDelete }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sortDesc, setSortDesc] = React.useState(true);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) =>
      sortDesc
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions, sortDesc]);

  const visibleTransactions = useMemo(() => {
    return sortedTransactions.slice(0, displayedCount);
  }, [sortedTransactions, displayedCount]);

  const hasMore = displayedCount < transactions.length;

  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount((prev) => prev + PAGE_SIZE);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: '100px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

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

  const toggleSort = () => setSortDesc(!sortDesc);

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
    <>
      <div className={styles.header}>
        <span className={styles.count}>{transactions.length} transactions</span>
        <button onClick={toggleSort} className={styles.sortBtn}>
          {sortDesc ? '↓ Newest first' : '↑ Oldest first'}
        </button>
      </div>
      <Table
        columns={columns}
        data={visibleTransactions}
        keyExtractor={(item) => item.id}
      />
      <div ref={sentinelRef} className={styles.sentinel} />
      {isLoadingMore && <div className={styles.loadingMore}>Loading more...</div>}
    </>
  );
};