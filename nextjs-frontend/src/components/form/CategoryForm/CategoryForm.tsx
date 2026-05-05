'use client';

import React from 'react';
import { Card } from '@/components/generic/Card/Card';
import { Input } from '@/components/generic/Input/Input';
import { Select } from '@/components/generic/Select/Select';
import { Button } from '@/components/generic/Button/Button';
import type { TransactionType } from '@/types';
import styles from './my.module.scss';

interface CategoryFormProps {
  onSuccess?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess }) => {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<TransactionType>('OUTFLOW');
  const [color, setColor] = React.useState('#3B82F6');
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
      // TODO: Replace with actual API call when category POST endpoint is available
      console.log('Creating category:', { name, type, color });

      setName('');
      setType('OUTFLOW');
      setColor('#3B82F6');
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Category">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Enter category name"
        />

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
          label="Color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <Button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : 'Save Category'}
        </Button>
      </form>
    </Card>
  );
};