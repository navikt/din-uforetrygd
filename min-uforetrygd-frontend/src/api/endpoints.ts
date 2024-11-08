import type { paths } from '@/api/api'
import createClient from 'openapi-fetch'
import getOboToken from '@/api/getOboToken'

const client = createClient<paths>({
  baseUrl: process.env.UFORETRYGD_BACKEND,
})

export const initate = async (pid: string | undefined) => {
  const oboToken = await getOboToken()
  return await client
    .GET('/api/initiate', {
      headers: {
        Authorization: `Bearer ${oboToken}`,
      },
      cache: 'no-store',
      pid: pid,
    })
    .then((response) => response.data)
}

export const dittUforevedtak = async (pid: string | undefined) => {
  const oboToken = await getOboToken()
  return await client
    .GET('/api/ditt-uforevedtak', {
      headers: {
        Authorization: `Bearer ${oboToken}`,
      },
      cache: 'no-store',
      pid: pid,
    })
    .then((response) => response.data)
}
