import { components } from '@/api/api'

export interface ForsideBehandling {
  type: string
  status: string
  tittel: string
  statusTekst: string
  søknadTekst: string
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
    søknadTekst: lagSøknadTekst(fra.type),
    lenker: lagLenker(fra.type),
  }
}

function lagSøknadTekst(type: string): string {
  switch (type) {
    case 'SØKNAD_UFØRETRYGD':
      return 'Søknaden din om uføretrygd venter på behandling.'
    case 'SØKNAD_ENDRING_UFØREGRAD':
      return 'Søknaden din om endring av uføregrad venter på behandling.'
    case 'SØKNAD_BARNETILLEGG':
      return 'Søknaden din om barnetillegg venter på behandling.'
    case 'SØKNAD_UNG_UFØR':
      return 'Søknaden din om ung ufør venter på behandling.'
    case 'SØKNAD_YRKESSKADE':
      return 'Søknaden din om yrkesskade venter på behandling.'
    default:
      return 'Søknaden din venter på behandling.'
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
