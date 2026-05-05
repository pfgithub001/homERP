'use client';

import React from 'react';
import styles from './my.module.scss';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

export function Table<T>({ columns, data, keyExtractor, onRowClick }: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={`${styles.tr} ${onRowClick ? styles.clickable : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}