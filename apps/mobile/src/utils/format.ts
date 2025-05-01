export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrencyInput = (input: string): string => {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  // Convert to number and divide by 100 to handle cents
  const amount = parseInt(digitsOnly || '0', 10) / 100;
  return formatCurrency(amount);
};

export const stripCurrency = (formatted: string): string => {
  return formatted.replace(/[^0-9.]/g, '');
};

export const isValidCurrencyAmount = (amount: string): boolean => {
  const value = parseFloat(stripCurrency(amount));
  return !isNaN(value) && value >= 0 && value <= 1000000; // Max $1M per category
}; 