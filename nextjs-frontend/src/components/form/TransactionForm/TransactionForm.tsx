'use client';

import React from 'react';
import { Card } from '@/components/generic/Card/Card';
import { Input } from '@/components/generic/Input/Input';
import { Select } from '@/components/generic/Select/Select';
import { Button } from '@/components/generic/Button/Button';
import { CategorySelect } from '@/components/data/CategorySelect/CategorySelect';
import { AccountSelect } from '@/components/data/AccountSelect/AccountSelect';
import { createTransaction } from '@/services/api';
import type { TransactionType } from '@/types';
import styles from './my.module.scss';

interface TransactionFormProps {
  onSuccess?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const [type, setType] = React.useState<TransactionType>('OUTFLOW');
  const [concept, setConcept] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = React.useState<number>(0);
  const [accountId, setAccountId] = React.useState<number>(0);
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!concept.trim()) newErrors.concept = 'Concept is required';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Amount must be positive';
    if (!date) newErrors.date = 'Date is required';
    if (!categoryId) newErrors.category = 'Category is required';
    if (!accountId) newErrors.account = 'Account is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createTransaction({
        concept,
        amount: parseFloat(amount),
        type,
        date,
        notes: notes || undefined,
        categoryId,
        accountId,
      });

      // Reset form
      setConcept('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId(0);
      setAccountId(0);
      setNotes('');
      setErrors({});

      onSuccess?.();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Transaction">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Select
          label="Type"
          options={[
            { value: 'OUTFLOW', label: 'Expense' },
            { value: 'INFLOW', label: 'Income' },
          ]}
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
        />

        <Input
          label="Concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          error={errors.concept}
          placeholder="Enter concept"
        />

        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          placeholder="0.00"
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />

        <CategorySelect
          label="Category"
          value={categoryId}
          onChange={setCategoryId}
          type={type}
          error={errors.category}
        />

        <AccountSelect
          label="Account"
          value={accountId}
          onChange={setAccountId}
          error={errors.account}
        />

        <Input
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
        />

        <Button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </form>
    </Card>
  );
};