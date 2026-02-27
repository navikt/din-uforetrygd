'use client'

import { faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import logger from '@/utils/logger'

interface Props {
  url: string | undefined
}

export default function InitializeFaro({ url }: Props) {
  if (typeof window === 'undefined' || faro.api || !url) {
    logger.error({ message: 'Klarte ikke initialisere Faro' })
    return null
  }

  try {
    const faro = initializeFaro({
      url: url,
      app: {
        name: 'din-uforetrygd',
      },
      instrumentations: [...getWebInstrumentations()],
    })
  } catch (e: any) {
    logger.error({ message: e.message })
    return null
  }
  return null
}
