import getEnv, { Env } from '@/utils/env'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload'

export interface GetUrlInput {
  urlFromEnv: Env
  pid?: string
  isFullmektig?: boolean
  innloggingstype?: string
}

export const getUrl = async ({
  urlFromEnv,
  pid = '',
  isFullmektig = false,
  innloggingstype = undefined,
}: GetUrlInput) => {
  if (getEnv('MODE') === 'veileder' && pid) {
    const parse = await getAzureUserPayload()
    return getEnv(urlFromEnv)?.replace('PID', pid).replace('USER', parse.name)
  }
  if (getEnv('MODE') === 'borger' && urlFromEnv.startsWith('LINK_SOKNAD')) {
    return isFullmektig || innloggingstype === 'LEVEL3'
      ? getEnv(urlFromEnv) + '?sub=paper'
      : getEnv(urlFromEnv) + '?sub=digital'
  }
  return getEnv(urlFromEnv)
}
