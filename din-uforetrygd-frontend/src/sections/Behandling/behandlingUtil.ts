import { components } from '@/api/api'
import { formatInntekt } from '@/utils/formatter/formatter'

export interface ForsideBehandling {
  status: Status
  tittel: string
  statusTekst: string
  lenker: Lenke[]
  beregninger: BeregningRad[]
  dato: string
}

export enum Status {
  MOTTATT = 'MOTTATT',
  INNVILGET = 'INNVILGET',
  AVSLAG = 'AVSLAG',
}

enum BehandlingType {
  SØKNAD_UFØRETRYGD = 'SØKNAD_UFØRETRYGD',
  SØKNAD_ENDRING_UFØREGRAD = 'SØKNAD_ENDRING_UFØREGRAD',
  SØKNAD_BARNETILLEGG = 'SØKNAD_BARNETILLEGG',
  SØKNAD_UNG_UFØR = 'SØKNAD_UNG_UFØR',
  SØKNAD_YRKESSKADE = 'SØKNAD_YRKESSKADE',
  INGEN = 'SØKNAD_YRKESSKADE',
}

export interface Lenke {
  href: string
  visningstekst: string
}

interface BeregningRad {
  label: string
  verdi: string
}

export function toForsideBehandling(fra: components['schemas']['ForsideBehandling']): ForsideBehandling | null {
  if (fra.type != BehandlingType.SØKNAD_UFØRETRYGD) return null

  return {
    status: fra.status as Status,
    tittel: lagTittel(fra.type as BehandlingType),
    statusTekst: lagStatusTekst(fra.status as Status),
    lenker: lagLenker(fra.status as Status, fra.type as BehandlingType),
    beregninger: lagBeregning(fra.beregning, fra.status as Status),
    dato: fra.dato,
  }
}

export function lagTittel(type: BehandlingType): string {
  switch (type) {
    case BehandlingType.SØKNAD_UFØRETRYGD:
      return 'Søknaden om uføretrygd'
    case BehandlingType.SØKNAD_ENDRING_UFØREGRAD:
      return 'Søknaden om endring av uføregrad'
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

function lagLenker(status: Status, behandlingType: BehandlingType) {
  switch (status) {
    case Status.MOTTATT:
      return lagLenkerMottatt(behandlingType)
    case Status.INNVILGET:
      return lagLenkerInnvilget(behandlingType)
    default:
      return []
  }
}

function lagLenkerMottatt(behandlingType: BehandlingType): Lenke[] {
  const lenker = [
    {
      href: 'http://nav.no/saksbehandlingstider#uforetrygd',
      visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
    },
  ]

  if (behandlingType === BehandlingType.SØKNAD_BARNETILLEGG) {
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

function lagLenkerInnvilget(behandlingType: BehandlingType): Lenke[] {
  const lenker = []

  if (behandlingType === BehandlingType.SØKNAD_UFØRETRYGD || behandlingType === BehandlingType.SØKNAD_UNG_UFØR) {
    lenker.push(
      {
        href: 'https://www.nav.no/uforetrygd#etteroppgjor',
        visningstekst: 'Slik kan etteroppgjøret påvirke deg (åpnes i ny fane)',
      },
      {
        href: 'https://www.nav.no/uforetrygd#inntektsplanlegger',
        visningstekst: 'Hvordan bruke Inntektsplanlegger (åpnes i ny fane)',
      },
      {
        href: 'https://www.nav.no/uforetrygd#jobb',
        visningstekst: 'Du kan jobbe ved siden av uføretrygd (åpnes i ny fane)',
      }
    )
  }

  lenker.push({
    href: 'https://www.nav.no/dokumentarkiv',
    visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
  })

  return lenker
}

function lagBeregning(beregning: components['schemas']['Beregning'] | null, status: Status): BeregningRad[] {
  if (status !== Status.INNVILGET || beregning == null) return []

  const beregninger: BeregningRad[] = []

  if (beregning.nettoUforetrygdPerManed)
    beregninger.push({ label: 'Uføretrygd', verdi: formatInntekt(beregning.nettoUforetrygdPerManed) + ' kroner' })
  return beregninger
}
