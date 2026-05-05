'use client';

import React from 'react';
import { Select } from '@/components/generic/Select/Select';
import { getAccounts } from '@/services/api';

interface AccountSelectProps {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  error?: string;
}

export const AccountSelect: React.FC<AccountSelectProps> = ({
  label = 'Account',
  value,
  onChange,
  error,
}) => {
  const [accounts, setAccounts] = React.useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const options = accounts.map((a) => ({ value: a.id, label: a.name }));

  return (
    <Select
      label={label}
      options={[{ value: '', label: 'Select account...' }, ...options]}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={loading}
      error={error}
    />
  );
};