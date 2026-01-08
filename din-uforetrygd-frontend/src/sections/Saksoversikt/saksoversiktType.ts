import { components } from '@/api/api'

export interface SaksoversiktType {
  aktivBehandling?: BehandlingType
  avsluttedeBehandlinger: BehandlingType[]
}

export interface BehandlingType {
  mottattDato: string
  ferdigstiltDato?: string | null
  avslag: boolean
  etteroppgjor?: EtteroppgjorType | null
  tekster: Tekster
}

export interface EtteroppgjorType {
  etterbetaling: number
  tilbakekreving: number
}

export interface Tekster {
  tittel: string,
  mottatt: string,
  ferdigBehandlet: string,
  ferdigBehandletUndertekst?: string | null
}

export const mapTilSaksoversiktType = (fra: components['schemas']['SaksoversiktResponse']): SaksoversiktType => {
  return {
    aktivBehandling: fra.aktivBehandling && mapTilBehandling(fra.aktivBehandling),
    avsluttedeBehandlinger: fra.avsluttedeBehandlinger.map((it) => mapTilBehandling(it)),
  }
}

//TODO: trenger vi mappingen, feks etteroppgjor mappes auto
const mapTilBehandling = (fra: components['schemas']['Behandling']): BehandlingType => {
  return {
    mottattDato: fra.mottattDato,
    ferdigstiltDato: fra.ferdigstiltDato,
    avslag: fra.avslag,
    etteroppgjor: fra.etteroppgjor,
    tekster: fra.tekster
  }
}
