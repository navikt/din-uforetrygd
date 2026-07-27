import { type BackendError, baseUrl } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import type { Behandling } from '@/api/hentSaksoversikt'

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

  const response = await fetch(`${baseUrl}/api/initiate`, { headers, cache: 'no-store' })
  const json = await response.json()

  if (!response.ok && response.status === 403) {
    return { backendError: json as BackendError }
  }
  return { uforetrygdResponse: json as UforetrygdResponse }
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
