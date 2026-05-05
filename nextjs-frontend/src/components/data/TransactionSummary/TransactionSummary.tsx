'use client';

import React from 'react';
import { Card } from '@/components/generic/Card/Card';
import { getTransactionSummary } from '@/services/api';
import type { TransactionSummary as TransactionSummaryType } from '@/types';
import styles from './my.module.scss';

const formatAmount = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return '0.00';
  return value.toFixed(2);
};

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

  const totalInflows = summary.totalInflows ?? 0;
  const totalOutflows = summary.totalOutflows ?? 0;
  const netBalance = summary.netBalance ?? 0;

  return (
    <div className={styles.grid}>
      <Card className={styles.card}>
        <div className={styles.label}>Total Income</div>
        <div className={`${styles.value} ${styles.income}`}>
          +€{formatAmount(totalInflows)}
        </div>
      </Card>
      <Card className={styles.card}>
        <div className={styles.label}>Total Expense</div>
        <div className={`${styles.value} ${styles.expense}`}>
          -€{formatAmount(totalOutflows)}
        </div>
      </Card>
      <Card className={styles.card}>
        <div className={styles.label}>Balance</div>
        <div className={`${styles.value} ${netBalance >= 0 ? styles.positive : styles.negative}`}>
          €{formatAmount(netBalance)}
        </div>
      </Card>
    </div>
  );
};