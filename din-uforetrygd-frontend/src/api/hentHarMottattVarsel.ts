import { headers } from 'next/headers'
import { getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getUforeVarslerOboToken } from '@/api/getOboToken'
import { env } from '@/env'

export const hentHarMottattVarsel = async (): Promise<boolean> => {
  const oboToken = await getUforeVarslerOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const nextHeaders = await headers()
  const body = env('MODE') === 'veileder' ? { fnr: nextHeaders.get('x-kryptert-pid') } : undefined

  const fullmaktCookie = await getFullmaktCookie()

  const headere: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    Cookie: fullmaktCookie as string,
    'Content-Type': 'application/json',
  }

  const mockScenario = await getMockScenario()
  if (mockScenario) {
    headere['X-Mock-Scenario'] = mockScenario
  }

  const response = await fetch(`${env('UFORE_VARSLER')}/api/varsler/status`, {
    method: 'POST',
    headers: headere,
    cache: 'no-store',
    body: body && JSON.stringify(body),
  })

  if (!response.ok) return false

  const json = await response.json()
  return json.harMottattVarsel
}
