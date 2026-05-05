'use client';

import React from 'react';
import { Select } from '@/components/generic/Select/Select';
import { getCategories } from '@/services/api';
import type { TransactionType } from '@/types';

interface CategorySelectProps {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: TransactionType;
  error?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  label = 'Category',
  value,
  onChange,
  type,
  error,
}) => {
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCategories()
      .then((cats) => {
        const filtered = type ? cats.filter((c) => c.type === type) : cats;
        setCategories(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  const options = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Select
      label={label}
      options={[{ value: '', label: 'Select category...' }, ...options]}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={loading}
      error={error}
    />
  );
};