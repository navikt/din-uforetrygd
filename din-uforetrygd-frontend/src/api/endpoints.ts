import type { paths } from '@/api/api'
import createClient from 'openapi-fetch'
import getOboToken from '@/api/getOboToken'
import { cookies } from 'next/headers'

const client = createClient<paths>({
  baseUrl: process.env.UFORETRYGD_BACKEND,
})

// Hent fullmaktscookie dersom dennes finnes
const getFullmaktCookie = async () => {
  const cookie = await cookies()
  const fullmaktCookie = cookie.get('nav-obo')
  if (!fullmaktCookie) return undefined

  const parsedCookie = `${fullmaktCookie.name}=${fullmaktCookie.value}`
  return parsedCookie
}

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

export const dittUforevedtak = async (pid: string | undefined) => {
  const oboToken = await getOboToken().catch((error) => {
    console.error('Error:', error)
  })
  const fullmaktCookie = await getFullmaktCookie()
  return await client
    .GET('/api/ditt-uforevedtak', {
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
