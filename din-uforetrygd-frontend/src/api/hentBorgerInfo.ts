import { hentDataOgLeggTilPid } from '@/api/common'
import { env } from '@/env'

export const hentBorgerInfo = async () => {
  const result = await hentDataOgLeggTilPid<BorgerInfo>(`${env('DIN_UFORETRYGD_BACKEND')}/api/borgerinfo`, 'GET')
  if (!result.ok) return undefined
  return result.data
}

export interface BorgerInfo {
  pid: string
  navn: string
}
