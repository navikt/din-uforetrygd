export const mapSakCodeToSak = (input: string): string | undefined => {
  const saktyper = {
    ALDER: 'alderspensjon',
    AFP: 'AFP',
    AFP_PRIVAT: 'AFP Privat',
    OMSORG: 'omsorgsopptjening',
    GJENLEV: 'gjenlevendepensjon',
    KRIGSP: 'krigspensjon',
    UFOREP: 'uføretrygd',
    FAM_PL: 'familiepleierytelse',
    GAM_YRK: 'gammel yrkesskade',
  }

  return saktyper[input as keyof typeof saktyper]
}
