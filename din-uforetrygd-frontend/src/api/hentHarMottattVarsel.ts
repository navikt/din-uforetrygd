import { getUforeVarslerOboToken } from '@/api/getOboToken'

export const hentHarMottattVarsel = async (): Promise<boolean> => {
  const oboToken = await getUforeVarslerOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
  }

  const url = process.env.NODE_ENV !== 'development' ? process.env.UFORE_VARSLER : 'http://localhost:8080'

  const response = await fetch(`${url}/api/varsler/status`, { headers })
  if (!response.ok) return false

  const json = await response.json()
  return json.harMottattVarsel
}
