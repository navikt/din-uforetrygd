import { components } from '@/api/api'

export interface ForsideBehandling {
  type: string
  status: Status
  tittel: string
  statusTekst: string
  lenker: Lenke[]
}

export enum Status {
  MOTTATT = 'MOTTATT',
  INNVILGET = 'INNVILGET',
  AVSLAG = 'AVSLAG',
}

export interface Lenke {
  href: string
  visningstekst: string
}

export function toForsideBehandling(fra: components['schemas']['ForsideBehandling']): ForsideBehandling {
  return {
    type: fra.type,
    status: fra.status as Status,
    tittel: lagTittel(fra.type),
    statusTekst: lagStatusTekst(fra.status as Status),
    lenker: lagLenker(fra.type),
  }
}

export function lagTittel(type: string): string {
  switch (type) {
    case 'SØKNAD_UFØRETRYGD':
      return 'Søknad om uføretrygd'
    default:
      return ''
  }
}

export function lagStatusTekst(status: Status): string {
  switch (status) {
    case Status.MOTTATT:
      return 'Søknad mottatt'
    case Status.INNVILGET:
      return 'Søknad innvilget'
    case Status.AVSLAG:
      return 'Søknad avslått'
  }
}

function lagLenker(behandlingType: string): Lenke[] {
  const lenker = [
    {
      href: 'http://nav.no/saksbehandlingstider#uforetrygd',
      visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
    },
  ]

  if (behandlingType === 'SØKNAD_BARNETILLEGG') {
    return [
      ...lenker,
      {
        href: 'https://www.nav.no/fyllut/nav121501',
        visningstekst: 'Viktig informasjon om inntekt og barnetillegg (åpnes i ny fane).',
      },
    ]
  }

  return lenker
}
