import { hentDataOgLeggTilPid } from '@/api/common'
import { env } from '@/env'

export const sjekkOmErVerge = async (): Promise<boolean> => {
  const result = await hentDataOgLeggTilPid<boolean>(`${env('DIN_UFORETRYGD_BACKEND')}/api/er-verge`, 'GET')
  if (!result.ok) return false
  return result.data
}
