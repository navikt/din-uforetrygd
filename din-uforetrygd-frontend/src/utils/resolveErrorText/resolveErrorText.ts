import { ErrorCode } from '@/api/common'

export const resolveErrorText = (type?: ErrorCode) => {
  switch (type) {
    case ErrorCode.LOGIN_LEVEL_TOO_LOW:
      return 'Du må logge inn med et høyere sikkerhetsnivå for å få tilgang til denne siden. Du kan for eksempel bruke BankID.'
    case ErrorCode.VEILEDER_UNAUTHORIZED:
    case ErrorCode.NO_FULLMAKT_PRESENT:
      return 'Du har ikke tilgang til denne siden.'
    default:
      return 'Noe gikk galt. Prøv igjen senere'
  }
}
