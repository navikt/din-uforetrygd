import { BehandlingType, BeregningRad, Lenke, Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { components } from '@/api/api'
import { formatInntekt } from '@/utils/formatter/formatter'

export const forsideKortTitler: Record<BehandlingType, string> = {
  SØKNAD_UFØRETRYGD: 'Søknaden om uføretrygd',
  SØKNAD_ENDRING_UFØREGRAD: 'Søknaden om endring av uføregrad',
  EKSPORT: '',
  ENDRING_IFU: '',
  ETTEROPPGJØR: '',
  INNTEKTSENDRING: '',
  MELLOMBEHANDLING: '',
  REGULERING: '',
  SLUTTBEHANDLING: '',
  SØKNAD_BARNETILLEGG: '',
  SØKNAD_UNG_UFØR: '',
  SØKNAD_YRKESSKADE: '',
}

export const statusTekst: Record<Status, string> = {
  MOTTATT: 'Søknad mottatt',
  INNVILGET: 'Søknad innvilget',
  AVSLAG: 'Søknad avslått',
}

export const lenker = (behandlingType: BehandlingType): Lenke[] => {
  const dokumentArkivLenke = {
    href: 'https://www.nav.no/dokumentarkiv',
    visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
  }

  if (behandlingType === BehandlingType.SØKNAD_UFØRETRYGD || behandlingType === BehandlingType.SØKNAD_UNG_UFØR) {
    return [
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
      },
      dokumentArkivLenke,
    ]
  }

  return [dokumentArkivLenke]
}

export const beregning = (behandling: components['schemas']['Behandling']): BeregningRad[] => {
  const status = behandling.status
  if (status !== Status.INNVILGET || behandling.beregning == null) return []

  if (behandling.beregning.nettoUforetrygdPerManed) {
    return [{ label: 'Uføretrygd', verdi: formatInntekt(behandling.beregning.nettoUforetrygdPerManed) + ' kroner' }]
  } else {
    return []
  }
}
