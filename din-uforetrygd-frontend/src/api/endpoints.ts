import createClient from 'openapi-fetch'
import type { components, paths } from '@/api/api'
import getOboToken from '@/api/getOboToken'
import fetchLogger from '@/utils/fetchLogger'
import { getFullmaktCookie } from './getFullmaktCookie'

const client = createClient<paths>({
  baseUrl: process.env.NODE_ENV !== 'development' ? process.env.DIN_UFORETRYGD_BACKEND : 'http://localhost:8080',
  fetch: fetchLogger,
})

type BackendError = {
  message: string
}

export const initate = async (pid: string | undefined) => {
  const oboToken = await getOboToken().catch((error) => {
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
        return { backendError: res.error! as BackendError }
      }
      return { uforetrygdResponse: res.data as components['schemas']['UforetrygdResponse'] }
    })
}

export const hentSaksoversikt = async (saksid: number, pid: string | undefined) => {
  const oboToken = await getOboToken().catch((error) => {
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
        return { backendError: res.error! as BackendError }
      }
      return { saksoversiktResponse: res.data as components['schemas']['SaksoversiktResponse'] }
    })
}
