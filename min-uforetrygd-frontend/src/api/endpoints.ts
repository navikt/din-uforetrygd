import type { paths } from '@/api/api'
import createClient from 'openapi-fetch'
import getOboToken from '@/api/getOboToken'
import { getFullmaktCookie } from './getFullmaktCookie'

const client = createClient<paths>({
  baseUrl: process.env.UFORETRYGD_BACKEND,
})

export const initate = async (pid: string | undefined) => {
  const oboToken = await getOboToken().catch((error) => {
    console.error('Error:', error)
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
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error:', error)
    })
}
