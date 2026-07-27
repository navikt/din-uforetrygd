import { type BackendError, baseUrl } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import type { BehandlingType, Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'

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

  const queryParams = new URLSearchParams({ saksid: saksid.toString() })
  const response = await fetch(`${baseUrl}/api/saksoversikt?${queryParams}`, {
    headers,
    cache: 'no-store',
  })

  const json = await response.json()
  if (!response.ok && response.status === 403) {
    return { backendError: json as BackendError }
  }
  return { saksoversiktResponse: json as SaksoversiktResponse }
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
