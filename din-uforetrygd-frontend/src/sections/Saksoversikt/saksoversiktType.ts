import { components } from '@/api/api'

export interface SaksoversiktType {
  aktiveBehandlinger: BehandlingType[]
  avsluttedeBehandlinger: BehandlingType[]
}

export interface BehandlingType {
  tittel: string
  mottattDato: string
  ferdigstiltDato?: string | null
  avslag: boolean
  etteroppgjor?: EtteroppgjorType | null
  steg: StegType[]
  vedtakId?: number | null
  avslattForutgaendeMedlemskap: boolean
}

export interface EtteroppgjorType {
  etterbetaling: number
  tilbakekreving: number
}

export interface StegType {
  aktiv: boolean
  utfort: boolean
  tittel: string
  undertekst?: string | null
}

export const mapTilSaksoversiktType = (fra: components['schemas']['SaksoversiktResponse']): SaksoversiktType => {
  return {
    aktiveBehandlinger: fra.aktiveBehandlinger.map((aktivBehandling) => mapTilBehandling(aktivBehandling)),
    avsluttedeBehandlinger: fra.avsluttedeBehandlinger.map((it) => mapTilBehandling(it)),
  }
}

const mapTilBehandling = (fra: components['schemas']['Behandling']): BehandlingType => {
  return {
    tittel: fra.tittel,
    mottattDato: fra.mottattDato,
    ferdigstiltDato: fra.ferdigstiltDato,
    avslag: fra.avslag,
    etteroppgjor: fra.etteroppgjor,
    steg: fra.steg,
    vedtakId: fra.vedtakId,
    avslattForutgaendeMedlemskap: fra.avslattForutgaendeMedlemskap
  }
}
