import { components } from '@/api/api'

export interface SaksoversiktType {
  aktivBehandling?: BehandlingType
  avsluttedeBehandlinger: BehandlingType[]
}

export interface BehandlingType {
  visningstittel: string
  status: BehandlingStatus
  mottattDato: string
  ferdigstiltDato?: string | null
}

enum BehandlingStatus {
  // TODO verifiser
  FERDIGSTILT = 'FERDIGSTILT',
  INNVILGET = 'INNVILGET',
  AVSLATT = 'AVSLATT',
  UNDER_BEHANDLING = 'UNDER_BEHANDLING',
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
    status: fra.status as BehandlingStatus,
    mottattDato: fra.mottattDato,
    ferdigstiltDato: fra.ferdigstiltDato,
  }
}
