import { components } from '@/api/api'
import { lagBehandlingTittel, lagSteg } from './saksoversiktUtil'

export interface SaksoversiktType {
  aktiveBehandlinger: BehandlingType[]
  avsluttedeBehandlinger: BehandlingType[]
}

export interface BehandlingType {
  tittel: string
  kravGjelder: string
  arsak: string | null
  vedtakstype: string | null
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
  arstall?: number
}

export interface StegType {
  tittel: string
  undertekst?: string | null
  dato: string | null
}

export const mapTilSaksoversiktType = (fra: components['schemas']['SaksoversiktResponse']): SaksoversiktType => {
  return {
    aktiveBehandlinger: fra.aktiveBehandlinger.map((aktivBehandling) => mapTilBehandling(aktivBehandling, true)),
    avsluttedeBehandlinger: fra.avsluttedeBehandlinger.map((it) => mapTilBehandling(it, false)),
  }
}

const mapTilBehandling = (fra: components['schemas']['Behandling'], aktivBehandling: boolean): BehandlingType => {
  return {
    tittel: lagBehandlingTittel(fra.kravGjelder, fra.arsak ?? null, fra.vedtakstype ?? null, fra.etteroppgjor?.arstall),
    kravGjelder: fra.kravGjelder,
    arsak: fra.arsak ?? null,
    vedtakstype: fra.vedtakstype ?? null,
    mottattDato: fra.mottattDato,
    ferdigstiltDato: fra.ferdigstiltDato,
    avslag: fra.avslag,
    etteroppgjor: fra.etteroppgjor,
    steg: lagSteg(
      fra.kravGjelder,
      fra.arsak ?? null,
      fra.vedtakstype ?? null,
      fra.mottattDato,
      fra.ferdigstiltDato ?? null,
      fra.avslag,
      aktivBehandling
    ),
    vedtakId: fra.vedtakId,
    avslattForutgaendeMedlemskap: fra.avslattForutgaendeMedlemskap,
  }
}
