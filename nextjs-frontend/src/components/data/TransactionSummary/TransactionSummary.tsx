'use client';

import React from 'react';
import { Card } from '@/components/generic/Card/Card';
import { getTransactionSummary } from '@/services/api';
import type { TransactionSummary as TransactionSummaryType } from '@/types';
import styles from './my.module.scss';

export const TransactionSummary: React.FC = () => {
  const [summary, setSummary] = React.useState<TransactionSummaryType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getTransactionSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Card><div className={styles.loading}>Loading summary...</div></Card>;
  }

  if (!summary) return null;

  return (
    <div className={styles.grid}>
      <Card className={styles.card}>
        <div className={styles.label}>Total Income</div>
        <div className={`${styles.value} ${styles.income}`}>
          +€{summary.totalIncome.toFixed(2)}
        </div>
      </Card>
      <Card className={styles.card}>
        <div className={styles.label}>Total Expense</div>
        <div className={`${styles.value} ${styles.expense}`}>
          -€{summary.totalExpense.toFixed(2)}
        </div>
      </Card>
      <Card className={styles.card}>
        <div className={styles.label}>Balance</div>
        <div className={`${styles.value} ${summary.balance >= 0 ? styles.positive : styles.negative}`}>
          €{summary.balance.toFixed(2)}
        </div>
      </Card>
    </div>
  );
};