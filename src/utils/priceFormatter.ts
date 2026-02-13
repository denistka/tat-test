/**
 * Utility for formatting price amounts into currency strings.
 * Uses locale-aware formatting via Intl.NumberFormat.
 * 
 * @param amount - The numeric amount to format.
 * @param currency - The currency code (e.g., 'usd').
 * @returns A formatted currency string.
 */
export const formatPrice = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Utility for formatting a date range.
 * 
 * @param startDate - The ISO date string for the start.
 * @param endDate - The ISO date string for the end.
 * @returns A formatted date range string.
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short' 
  };

  // Using Ukrainian locale as per the example in .po file "15 лют — 22 лют"
  // If we want to be dynamic, we could detect locale, but sticking to the requirement.
  const locale = 'uk-UA'; 
  
  const startFormatted = start.toLocaleDateString(locale, options);
  const endFormatted = end.toLocaleDateString(locale, options);

  return `${startFormatted} — ${endFormatted}`;
};
