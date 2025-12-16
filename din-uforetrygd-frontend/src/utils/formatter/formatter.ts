import { format, parseISO } from 'date-fns'
import { nb } from 'date-fns/locale'

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

export const formatDate = (date?: string): string | undefined => {
  return date ? format(parseISO(date), 'dd.MM.yyyy') : undefined
}

export const formatterDatoTekst = (dateString?: string): string | undefined => {
  if (!dateString) return undefined
  return format(parseISO(dateString), 'd. MMM yyyy', { locale: nb })
}