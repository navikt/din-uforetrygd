import { serverEnv } from '@/env'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload/getAzureUserPayload'

export const leggTilPidHvisVeileder = (url: string, pid?: string): string => {
  if (serverEnv.MODE === 'veileder' && pid) {
    return url.replace('PID', pid)
  } else {
    return url
  }
}

export const leggTilInnloggaBrukerNavn = async (url: string): Promise<string> => {
  if (serverEnv.MODE === 'veileder') {
    const parse = await getAzureUserPayload()
    return url.replace('USER', parse.name)
  } else {
    return url
  }
}
