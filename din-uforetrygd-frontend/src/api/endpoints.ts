/** biome-ignore-all lint/suspicious/noConsole: TODO Vi bruker console for logging, bør fikse sånn at vi kan bruke logger */
import createClient from 'openapi-fetch'
import type { components, paths } from '@/api/api'
import { getDinUforetrygdBackendOboToken, getUforeVarslerOboToken } from '@/api/getOboToken'
import fetchLogger from '@/utils/fetchLogger'
import { getFullmaktCookie } from './getFullmaktCookie'

const client = createClient<paths>({
  baseUrl: process.env.NODE_ENV !== 'development' ? process.env.DIN_UFORETRYGD_BACKEND : 'http://localhost:8080',
  fetch: fetchLogger,
})

const uforeVarslerClient = createClient<paths>({
  baseUrl: process.env.NODE_ENV !== 'development' ? process.env.UFORE_VARSLER : 'http://localhost:8080',
  fetch: fetchLogger,
})

type BackendError = {
  message: string
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

  return await client
    .GET('/api/initiate', {
      headers,
      cache: 'no-store',
    })
    .then((res) => {
      if (!res.response.ok && res.response.status === 403) {
        // biome-ignore lint/style/noNonNullAssertion: skal aldri være null når error
        return { backendError: res.error! as BackendError }
      }
      return { uforetrygdResponse: res.data as components['schemas']['UforetrygdResponse'] }
    })
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

  return await client
    .GET('/api/saksoversikt', {
      headers,
      cache: 'no-store',
      params: {
        query: { saksid },
      },
    })
    .then((res) => {
      if (!res.response.ok && res.response.status === 403) {
        // biome-ignore lint/style/noNonNullAssertion: TODO: se på typen, refaktorer
        return { backendError: res.error! as BackendError }
      }
      return { saksoversiktResponse: res.data as components['schemas']['SaksoversiktResponse'] }
    })
}

export const hentHarMottattVarsel = async (): Promise<boolean> => {
  const oboToken = await getUforeVarslerOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
  }

  const response = await fetch(`${process.env.UFORE_VARSLER}/api/varsler/status`, { headers })
  if (!response.ok) return false

  const json = await response.json()
  return json.harMottattVarsel
}
