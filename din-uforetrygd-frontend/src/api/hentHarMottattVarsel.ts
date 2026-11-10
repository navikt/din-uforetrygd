import { headers as nextHeaders } from 'next/headers'
import { hentData } from '@/api/common'
import { env } from '@/env'

export const hentHarMottattVarsel = async (): Promise<boolean> => {
  const clientHeaders = await nextHeaders()
  const body = env('MODE') === 'veileder' ? { fnr: clientHeaders.get('x-kryptert-pid') } : undefined

  const headers = new Headers()

  const result = await hentData<HarMottattVarselResponse>(
    `${env('UFORE_VARSLER')}/api/varsler/status`,
    'POST',
    headers,
    env('UFORE_VARSLER_SCOPE'),
    body && JSON.stringify(body)
  )
  if (!result.ok) return false
  return result.data.harMottattVarsel
}

interface HarMottattVarselResponse {
  harMottattVarsel: boolean
}
