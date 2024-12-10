export const resolveErrorText = (type?: string) => {
  switch (type) {
    case 'LOGIN_LEVEL_TOO_LOW':
      return 'Du må logge inn med et høyere sikkerhetsnivå for å få tilgang til denne siden. Du kan for eksempel bruke BankID.'
    case 'VEILEDER_UNAUTHORIZED':
    case 'NO_FULLMAKT_PRESENT':
      return 'Du har ikke tilgang til denne siden.'
    default:
      return 'Noe gikk galt. Prøv igjen senere'
  }
}
