export const formatPrice = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

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
  const endFormatted = end.toLocaleDateString(locale, options)

  return `${startFormatted} — ${endFormatted}`
}
