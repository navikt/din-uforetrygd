import { getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from './getOboToken'
import { env } from '@/env'

export const hentBorgerInfo = async (kryptertPid: string) => {
  const oboToken = await getDinUforetrygdBackendOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const fullmaktCookie = await getFullmaktCookie()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    pid: kryptertPid || '',
    Cookie: fullmaktCookie as string,
  }

  const mockScenario = await getMockScenario()
  if (mockScenario) {
    headers['X-Mock-Scenario'] = mockScenario
  }

  const response = await fetch(`${env('DIN_UFORETRYGD_BACKEND')}/api/borgerinfo`, {
    headers,
    cache: 'no-store',
  })

  const json = await response.json().catch(() => undefined)

  return json as BorgerInfo
}

export interface BorgerInfo {
  pid: string
  navn: string
}
