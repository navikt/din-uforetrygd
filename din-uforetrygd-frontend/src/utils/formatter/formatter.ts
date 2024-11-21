export const formatInntekt = (amount?: number | string | null): string => {
  if (amount === null || amount === undefined || amount === '') return ''
  const integerAmount = typeof amount === 'string' ? parseInt(amount.replace(/\D+/g, ''), 10) : amount

  return !isNaN(integerAmount)
    ? Intl.NumberFormat('nb-NO', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(integerAmount)
    : ''
}
