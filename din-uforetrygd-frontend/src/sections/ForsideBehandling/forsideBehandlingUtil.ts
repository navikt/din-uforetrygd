export interface ForsideBehandling {
  status: Status
  tittel: string
  statusTekst: string
  lenker: Lenke[]
  beregninger: BeregningRad[]
  dato: string
  avslattForutgaendeMedlemskap: boolean
}

export enum Status {
  MOTTATT = 'MOTTATT',
  INNVILGET = 'INNVILGET',
  AVSLAG = 'AVSLAG',
}

export enum BehandlingType {
  SØKNAD_UFØRETRYGD = 'SØKNAD_UFØRETRYGD',
  SØKNAD_ENDRING_UFØREGRAD = 'SØKNAD_ENDRING_UFØREGRAD',
  SØKNAD_BARNETILLEGG = 'SØKNAD_BARNETILLEGG',
  SØKNAD_UNG_UFØR = 'SØKNAD_UNG_UFØR',
  SØKNAD_YRKESSKADE = 'SØKNAD_YRKESSKADE',
  EKSPORT = 'EKSPORT',
  INNTEKTSENDRING = 'INNTEKTSENDRING',
  ETTEROPPGJØR = 'ETTEROPPGJØR',
  ENDRING_IFU = 'ENDRING_IFU',
  MELLOMBEHANDLING = 'MELLOMBEHANDLING',
  SLUTTBEHANDLING = 'SLUTTBEHANDLING',
  REGULERING = 'REGULERING',
}

export interface Lenke {
  href: string
  visningstekst: string
}

export interface BeregningRad {
  label: string
  verdi: string
}
