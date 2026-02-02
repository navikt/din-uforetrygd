import { components } from '@/api/api'

export interface ForsideBehandling {
  type: string
  status: string
  tittel: string
  statusTekst: string
  lenker: Lenke[]
}

export interface Lenke {
  href: string
  visningstekst: string
}

export function toForsideBehandling(fra: components['schemas']['ForsideBehandling']): ForsideBehandling {
  return {
    type: fra.type,
    status: fra.status,
    tittel: lagTittel(fra.type),
    statusTekst: lagStatus(fra.status),
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

export function lagStatus(status: string): string {
  switch (status) {
    case 'MOTTATT':
      return 'Søknad mottatt'
    case 'INNVILGET':
      return 'Søknad innvilget'
    case 'AVSLAG':
      return 'Søknad avslått'
    default:
      console.error('Ukjent status ' + status)
      return ''
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
        href: 'https://www.nav.no/no/person/familie/barn-og-unnskap/barnetillegg',
        visningstekst: 'Viktig informasjon om inntekt og barnetillegg (åpnes i ny fane).',
      },
    ]
  }

  return lenker
}
