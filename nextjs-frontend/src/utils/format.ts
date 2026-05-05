export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatMoneyWithSign = (amount: number, type: 'INFLOW' | 'OUTFLOW'): string => {
  const formatted = formatMoney(Math.abs(amount));
  return type === 'INFLOW' ? `+${formatted}` : `-${formatted}`;
};