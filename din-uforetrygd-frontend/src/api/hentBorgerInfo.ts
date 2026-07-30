import { baseUrl } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from './getOboToken'

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

  if (process.env.NODE_ENV === 'development') {
    headers['X-Mock-Scenario'] = process.env.MOCK_SCENARIO || 'default'
  }

  const response = await fetch(`${baseUrl}/api/borgerinfo`, {
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
