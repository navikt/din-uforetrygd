export const mapOpprettetAv = (opprettetAv?: string): string | undefined => {
  switch (opprettetAv) {
    case 'BRUKER':
      return 'deg'
    case 'FULLMEKTIG':
      return 'Fullmektig'
    case 'SAKSBEHANDLER':
    case 'NAV':
    case 'AUTOMATISK_PROSESS':
      return 'Nav'
    default:
      return undefined
  }
}
