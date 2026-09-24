import { env } from '@/env'

export const leggTilPidHvisVeileder = (url: string, pid?: string): string => {
  if (env('MODE') === 'veileder' && pid) {
    return url.replace('PID', pid)
  } else {
    return url
  }
}
