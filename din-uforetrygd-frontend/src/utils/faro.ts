import { type Faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import getEnv from '@/utils/env'
import logger from '@/utils/logger'

let faro: Faro | null = null

export function initFaro(): void {
  if (typeof window === 'undefined' || faro !== null) {
    logger.info({ message: `Setter ikke opp faro siden window er null eller faro er ulik null` })
    return
  }
  const faroUrl = getEnv('FARO_URL')
  logger.info({ message: `Setter opp Faro med URL ${faroUrl}` })
  faro = initializeFaro({
    url: faroUrl,
    app: {
      name: 'din-uforetrygd',
    },
    instrumentations: [...getWebInstrumentations()],
  })
  logger.info({ message: 'Faro initialized success' })
}
