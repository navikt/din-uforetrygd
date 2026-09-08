import { env } from '@/env'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload/getAzureUserPayload'

export const leggTilPidHvisVeileder = (url: string, pid?: string): string => {
  if (env().MODE === 'veileder' && pid) {
    return url.replace('PID', pid)
  } else {
    return url
  }
}

export const leggTilInnloggaBrukerNavn = async (url: string): Promise<string> => {
  if (env().MODE === 'veileder') {
    const parse = await getAzureUserPayload()
    return url.replace('USER', parse.name)
  } else {
    return url
  }
}
