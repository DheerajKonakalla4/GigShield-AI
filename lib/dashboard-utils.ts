/**
 * Formats a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formats a number as a percentage
 * @param value - The number to format (0-1 or 0-100)
 * @param isDecimal - Whether the value is already in decimal form (0-1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, isDecimal = true): string {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(2)}%`;
}

/**
 * Formats a date to a readable string
 * @param date - The date to format
 * @param format - The format to use (default: 'short')
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Calculates the percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Generates mock dashboard data for charts
 * @param days - Number of days of data to generate
 * @returns Array of mock data points
 */
export function generateMockChartData(days: number = 30) {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    value: Math.floor(Math.random() * 1000) + 500,
    revenue: Math.floor(Math.random() * 5000) + 2000,
  }));
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
