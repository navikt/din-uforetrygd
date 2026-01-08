import { components } from '@/api/api'

export interface SaksoversiktType {
  aktivBehandling?: BehandlingType
  avsluttedeBehandlinger: BehandlingType[]
}

export interface BehandlingType {
  visningstittel: string
  mottattDato: string
  ferdigstiltDato?: string | null
  avslag: boolean
  etteroppgjor?: EtteroppgjorType | null
}

export interface EtteroppgjorType {
  etterbetaling: number
  tilbakekreving: number
  frist: string
}

export const mapTilSaksoversiktType = (fra: components['schemas']['SaksoversiktResponse']): SaksoversiktType => {
  return {
    aktivBehandling: fra.aktivBehandling && mapTilBehandling(fra.aktivBehandling),
    avsluttedeBehandlinger: fra.avsluttedeBehandlinger.map((it) => mapTilBehandling(it)),
  }
}

const mapTilBehandling = (fra: components['schemas']['Behandling']): BehandlingType => {
  return {
    visningstittel: fra.visningstittel,
    mottattDato: fra.mottattDato,
    ferdigstiltDato: fra.ferdigstiltDato,
    avslag: fra.avslag,
    etteroppgjor: fra.etteroppgjor,
  }
}
