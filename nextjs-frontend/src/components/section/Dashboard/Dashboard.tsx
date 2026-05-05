'use client';

import React from 'react';
import { TransactionSummary } from '@/components/data/TransactionSummary/TransactionSummary';
import { TransactionList } from '@/components/data/TransactionList/TransactionList';
import { TransactionForm } from '@/components/form/TransactionForm/TransactionForm';
import styles from './my.module.scss';

export const Dashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>

      <section className={styles.summarySection}>
        <TransactionSummary key={refreshKey} />
      </section>

      <div className={styles.mainContent}>
        <section className={styles.formSection}>
          <TransactionForm onSuccess={handleSuccess} />
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Recent Transactions</h2>
          </div>
          <TransactionList key={refreshKey} onDelete={handleSuccess} />
        </section>
      </div>
    </div>
  );
};