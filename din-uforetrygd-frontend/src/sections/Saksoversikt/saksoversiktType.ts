import type { Behandling, Etteroppgjor, SaksoversiktResponse } from '@/api/endpoints'
import { BehandlingType, Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'

export interface SaksoversiktType {
  aktiveBehandlinger: SaksoversiktBehandling[]
  avsluttedeBehandlinger: SaksoversiktBehandling[]
}

export interface SaksoversiktBehandling {
  tittel: string
  mottattDato: string
  ferdigstiltDato?: string | null
  avslag: boolean
  etteroppgjør: EtteroppgjorType | null
  steg: StegType[]
  avslattForutgaendeMedlemskap: boolean
}

export interface EtteroppgjorType {
  etterbetaling: number
  tilbakekreving: number
}

export interface StegType {
  tittel: string
  undertekst?: string | null
  dato?: string
}

export const mapTilSaksoversiktType = (fra: SaksoversiktResponse): SaksoversiktType => {
  return {
    aktiveBehandlinger: fra.aktiveBehandlinger.map((aktivBehandling) => mapTilBehandling(aktivBehandling)),
    avsluttedeBehandlinger: fra.avsluttedeBehandlinger.map((it) => mapTilBehandling(it)),
  }
}

const mapTilBehandling = (fra: Behandling): SaksoversiktBehandling => {
  return {
    tittel: lagBehandlingTittel(fra.type, fra.etteroppgjor?.arstall),
    mottattDato: fra.mottattDato,
    ferdigstiltDato: fra.ferdigstiltDato,
    avslag: fra.status === 'AVSLAG',
    etteroppgjør: fra.etteroppgjor ? lagEtteroppgjørRad(fra.etteroppgjor) : null,
    steg: lagSteg(fra.type, fra.status, fra.mottattDato, fra.ferdigstiltDato),
    avslattForutgaendeMedlemskap: fra.avslattForutgaendeMedlemskap,
  }
}

const lagSteg = (
  behandlingType: BehandlingType,
  status: Status,
  mottattDato: string,
  ferdigstiltDato?: string
): StegType[] => {
  switch (behandlingType) {
    case BehandlingType.EKSPORT:
    case BehandlingType.SØKNAD_UFØRETRYGD:
    case BehandlingType.SLUTTBEHANDLING:
    case BehandlingType.SØKNAD_ENDRING_UFØREGRAD:
    case BehandlingType.SØKNAD_UNG_UFØR:
    case BehandlingType.SØKNAD_YRKESSKADE:
    case BehandlingType.MELLOMBEHANDLING:
    case BehandlingType.SØKNAD_BARNETILLEGG:
    case BehandlingType.ENDRING_IFU:
      return [
        { tittel: 'Søknad er mottatt og ligger i behandlingskø', dato: mottattDato },
        {
          tittel: 'Søknad er ferdig behandlet',
          dato: ferdigstiltDato,
          undertekst: status === Status.AVSLAG ? 'Søknaden er avslått' : 'Søknaden er innvilget',
        },
      ]
    case BehandlingType.INNTEKTSENDRING:
      return [
        {
          tittel: 'Opplysninger om endret inntekt er mottatt og ligger i behandlingskø',
          dato: mottattDato,
        },
        { tittel: 'Inntektsendring er ferdig behandlet', dato: ferdigstiltDato },
      ]
    case BehandlingType.REGULERING:
      return [
        {
          tittel: 'Regulering av uføretrygden er igangsatt',
          dato: mottattDato,
        },
        { tittel: 'Regulering av uføretrygden er ferdig behandlet', dato: ferdigstiltDato },
      ]
    case BehandlingType.ETTEROPPGJØR:
      return [
        {
          tittel: 'Etteroppgjør er igangsatt',
          dato: mottattDato,
        },
        { tittel: 'Etteroppgjør er ferdig behandlet', dato: ferdigstiltDato },
      ]
  }

  return []
}

function lagBehandlingTittel(type: BehandlingType, etteroppgjorArstall?: number | null): string {
  switch (type) {
    case BehandlingType.SØKNAD_UFØRETRYGD:
      return 'Søknad om uføretrygd'
    case BehandlingType.SØKNAD_ENDRING_UFØREGRAD:
      return 'Søknad om endring av uføregrad'
    case BehandlingType.SØKNAD_BARNETILLEGG:
      return 'Søknad om barnetillegg'
    case BehandlingType.SØKNAD_UNG_UFØR:
      return 'Søknad om ung ufør'
    case BehandlingType.SØKNAD_YRKESSKADE:
      return 'Søknad om yrkesskade'
    case BehandlingType.EKSPORT:
      return 'Eksport av uføretrygd til utlandet'
    case BehandlingType.INNTEKTSENDRING:
      return 'Inntektsendring'
    case BehandlingType.ETTEROPPGJØR:
      return `Etteroppgjør${etteroppgjorArstall ? ` for ${etteroppgjorArstall}` : ''}`
    case BehandlingType.ENDRING_IFU:
      return 'Endring av inntekt før uførhet'
    case BehandlingType.MELLOMBEHANDLING:
      return 'Søknad om uføretrygd - opplysninger fra utlandet'
    case BehandlingType.SLUTTBEHANDLING:
      return 'Søknad om uføretrygd - endelig vedtak'
    case BehandlingType.REGULERING:
      return 'Regulering i forbindelse med nytt grunnbeløp'
    default:
      return 'Behandling'
  }
}

function lagEtteroppgjørRad(etteroppgjør: Etteroppgjor): EtteroppgjorType {
  return {
    tilbakekreving: etteroppgjør.type === 'TILBAKEKR' ? Math.abs(etteroppgjør.avviksbelop) : 0,
    etterbetaling: etteroppgjør.type === 'ETTERBET' ? Math.abs(etteroppgjør.avviksbelop) : 0,
  }
}
