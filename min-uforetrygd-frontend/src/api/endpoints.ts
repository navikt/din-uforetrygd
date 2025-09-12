import type { components, paths } from '@/api/api'
import createClient from 'openapi-fetch'
import getOboToken from '@/api/getOboToken'
import { getFullmaktCookie } from './getFullmaktCookie'
import fetchLogger from '@/utils/fetchLogger'

const client = createClient<paths>({
  baseUrl: process.env.UFORETRYGD_BACKEND,
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
    Cookie: fullmaktCookie,
  }

  if (process.env.NODE_ENV === 'development') {
    headers['X-Mock-Scenario'] = process.env.MOCK_SCENARIO || 'default'
  }

  const backendUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:8080/api/initiate`
    : '/api/initiate'

  return await client
    .GET(backendUrl, {
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
