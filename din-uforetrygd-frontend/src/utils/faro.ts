import { type Faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import getEnv from '@/utils/env'

let faro: Faro | null = null

export function initFaro(): void {
  if (typeof window === 'undefined' || faro !== null) return
  const faroUrl = getEnv('FARO_URL')
  faro = initializeFaro({
    url: faroUrl,
    app: {
      name: 'din-uforetrygd',
    },
    instrumentations: [...getWebInstrumentations()],
  })
}
