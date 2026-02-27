'use client'

import { faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import logger from '@/utils/logger'

export default function InitializeFaro() {
  if (typeof window === 'undefined' || faro.api) return null

  try {
    const faro = initializeFaro({
      url: process.env.NEXT_PUBLIC_FARO_URL,
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
