'use client';

import React from 'react';
import { Card } from '@/components/generic/Card/Card';
import { Input } from '@/components/generic/Input/Input';
import { Select } from '@/components/generic/Select/Select';
import { Button } from '@/components/generic/Button/Button';
import type { Account } from '@/types';
import styles from './my.module.scss';

interface AccountFormProps {
  onSuccess?: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ onSuccess }) => {
  const [name, setName] = React.useState('');
  const [balance, setBalance] = React.useState('0');
  const [currency, setCurrency] = React.useState('EUR');
  const [type, setType] = React.useState<'CASH' | 'BANK'>('BANK');
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call when account POST endpoint is available
      console.log('Creating account:', { name, balance: parseFloat(balance), currency, type });

      setName('');
      setBalance('0');
      setCurrency('EUR');
      setType('BANK');
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Account">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Enter account name"
        />

        <Input
          label="Initial Balance"
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="0.00"
        />

        <Select
          label="Currency"
          options={[
            { value: 'EUR', label: 'EUR - Euro' },
            { value: 'USD', label: 'USD - US Dollar' },
            { value: 'GBP', label: 'GBP - British Pound' },
          ]}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />

        <Select
          label="Type"
          options={[
            { value: 'BANK', label: 'Bank Account' },
            { value: 'CASH', label: 'Cash' },
          ]}
          value={type}
          onChange={(e) => setType(e.target.value as 'CASH' | 'BANK')}
        />

        <Button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : 'Save Account'}
        </Button>
      </form>
    </Card>
  );
};