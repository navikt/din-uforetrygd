import type { components, paths } from '@/api/api'
import createClient from 'openapi-fetch'
import getOboToken from '@/api/getOboToken'
import { getFullmaktCookie } from './getFullmaktCookie'
import fetchLogger from '@/utils/fetchLogger'

const client = createClient<paths>({
  baseUrl: process.env.UFORETRYGD_BACKEND,
  fetch: fetchLogger,
})

export type BackendError = {
  message: string
}

export const initate = async (pid: string | undefined) => {
  const oboToken = await getOboToken().catch((error) => {
    console.error('Error: ', error)
  })

  const fullmaktCookie = await getFullmaktCookie()

  return await client
    .GET('/api/initiate', {
      headers: {
        Authorization: `Bearer ${oboToken}`,
        pid: pid,
        Cookie: fullmaktCookie,
      },
      cache: 'no-store',
    })
    .then((res) => {
      if (!res.response.ok && res.response.status === 403) {
        return { backendError: res.error! as BackendError }
      }
      return { uforetrygdResponse: res.data as components['schemas']['UforetrygdResponse'] }
    })
}
