/** biome-ignore-all lint/suspicious/noConsole: TODO Vi bruker console for logging, bør fikse sånn at vi kan bruke logger */
import { getDinUforetrygdBackendOboToken, getUforeVarslerOboToken } from '@/api/getOboToken'
import type { BehandlingType, Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { getFullmaktCookie } from './getFullmaktCookie'

const baseUrl = process.env.NODE_ENV !== 'development' ? process.env.DIN_UFORETRYGD_BACKEND : 'http://localhost:8080'

// TODO: Gjør finere
type BackendError = {
  message: string
}

export interface DittUforevedtak {
  uforegrad: number
  virkFom?: string
  uforetidspunkt?: string
  inntektsgrense?: number
  inntektstak?: number
  inntektFraSkatt: number
  kompensasjonsgrad?: number
  nettoUtbetalingMnd: number
  sumAvForventedeInntekter?: number
  hasBarnetilleggFellesBarn: boolean
  hasBarnetilleggSaerkullsbarn: boolean
  hasGjenlevendeTillegg: boolean
  hasVarigTilrettelagtArbeid: boolean
}
export interface Dokument {
  tittel?: string
  dokumentInfoId?: string
  filstorrelse?: number
  variant?: 'ARKIV' | 'SLADDET'
}

export interface Journalpost {
  id?: string
  tittel?: string
  opprettetAv?: 'BRUKER' | 'FULLMEKTIG' | 'SAKSBEHANDLER' | 'AUTOMATISK_PROSESS' | 'UKJENT' | 'NAV'
  opprettetDato?: string
  dokumenter?: Dokument[]
}

export interface Sak {
  status?: 'OPPRETTET' | 'TIL_BEHANDLING' | 'AVSLUTTET' | 'LOPENDE'
  sakId?: number
}

export interface UforetrygdResponse {
  pid?: string
  loggetInnSom?: string
  sak?: Sak
  hasIverksattVedtak: boolean
  uforevedtak?: DittUforevedtak
  innloggingstype: 'LEVEL4' | 'LEVEL3' | 'NAV' | 'SYSTEM'
  journalposter: Journalpost[]
  behandling?: Behandling
  verge: boolean
}

export const initate = async (pid: string | undefined) => {
  const oboToken = await getDinUforetrygdBackendOboToken().catch((error) => {
    console.error('Error: ', error)
  })

  const fullmaktCookie = await getFullmaktCookie()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    pid: pid || '',
    Cookie: fullmaktCookie as string,
  }

  if (process.env.NODE_ENV === 'development') {
    headers['X-Mock-Scenario'] = process.env.MOCK_SCENARIO || 'default'
  }

  const response = await fetch(`${baseUrl}/api/initiate`, { headers })
  const json = await response.json()

  if (!response.ok && response.status === 403) {
    return { backendError: json as BackendError }
  }
  return { uforetrygdResponse: json as UforetrygdResponse }
}

export interface Etteroppgjor {
  arstall: number
  avviksbelop: number
  type: string
}

export interface Beregning {
  nettoUforetrygdPerManed: number
}

export interface Behandling {
  type: BehandlingType
  status: Status
  mottattDato: string
  avslattForutgaendeMedlemskap: boolean
  ferdigstiltDato?: string
  etteroppgjor?: Etteroppgjor
  beregning: Beregning | null
}

export interface SaksoversiktResponse {
  aktiveBehandlinger: Behandling[]
  avsluttedeBehandlinger: Behandling[]
}

export const hentSaksoversikt = async (saksid: number, pid: string | undefined) => {
  const oboToken = await getDinUforetrygdBackendOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const fullmaktCookie = await getFullmaktCookie()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    pid: pid || '',
    Cookie: fullmaktCookie as string,
  }

  if (process.env.NODE_ENV === 'development') {
    headers['X-Mock-Scenario'] = process.env.MOCK_SCENARIO || 'default'
  }

  const response = await fetch(`${baseUrl}/api/saksoversikt`, {
    headers,
    body: JSON.stringify({ saksid }),
  })

  const json = await response.json()
  if (!response.ok && response.status === 403) {
    return { backendError: json as BackendError }
  }
  return { saksoversiktResponse: json as SaksoversiktResponse }
}

export const hentHarMottattVarsel = async (): Promise<boolean> => {
  const oboToken = await getUforeVarslerOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
  }

  const url = process.env.NODE_ENV !== 'development' ? process.env.UFORE_VARSLER : 'http://localhost:8080'

  const response = await fetch(`${url}/api/varsler/status`, { headers })
  if (!response.ok) return false

  const json = await response.json()
  return json.harMottattVarsel
}
