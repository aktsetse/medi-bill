/**
 * Format a number as USD currency
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Compact format for chart axis labels
 */
export function formatCurrencyCompact(value: number): string {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
    }
    return formatCurrency(value);
}
