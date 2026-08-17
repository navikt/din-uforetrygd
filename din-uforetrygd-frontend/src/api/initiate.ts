import { type BackendError, baseUrl, getMockScenario } from '@/api/common'
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

  const mockScenario = await getMockScenario()
  if (mockScenario) {
    headers['X-Mock-Scenario'] = mockScenario
  }

  const response = await fetch(`${baseUrl}/api/initiate`, { headers, cache: 'no-store' })
  const json = await response.json().catch(() => undefined)

  if (!response.ok) {
    return { backendError: json as BackendError }
  }
  return { uforetrygdResponse: json as UforetrygdResponse }
}

export interface Dokument {
  tittel?: string
  dokumentInfoId?: string
  filstorrelse?: number
  variant?: 'ARKIV' | 'SLADDET'
}

export interface Sak {
  status?: 'OPPRETTET' | 'TIL_BEHANDLING' | 'AVSLUTTET' | 'LOPENDE'
  sakId?: number
}

export interface UforetrygdResponse {
  pid?: string
  sak?: Sak
  hasIverksattVedtak: boolean
  uforegrad?: number
  innloggingstype: 'LEVEL4' | 'LEVEL3' | 'NAV' | 'SYSTEM'
  behandling?: Behandling
  erVerge: boolean
}
