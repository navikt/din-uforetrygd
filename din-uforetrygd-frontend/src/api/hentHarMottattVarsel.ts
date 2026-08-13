import { headers } from 'next/headers'
import { getUforeVarslerOboToken } from '@/api/getOboToken'
import getEnv from '@/utils/env'

export const hentHarMottattVarsel = async (): Promise<boolean> => {
  const mode = getEnv('MODE') as 'borger' | 'veileder'

  const oboToken = await getUforeVarslerOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const nextHeaders = await headers()

  const body = mode === 'veileder' ? { fnr: nextHeaders.get('x-kryptert-pid') } : undefined

  const headere: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
  }

  const url = process.env.NODE_ENV !== 'development' ? process.env.UFORE_VARSLER : 'http://localhost:8080'

  const response = await fetch(`${url}/api/varsler/status`, {
    method: 'POST',
    headers: headere,
    cache: 'no-store',
    body: body && JSON.stringify(body),
  })

  if (!response.ok) return false

  const json = await response.json()
  return json.harMottattVarsel
}
