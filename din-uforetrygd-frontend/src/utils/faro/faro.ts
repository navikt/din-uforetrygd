'use client'

import { faro, getWebInstrumentations, initializeFaro, type TransportItem } from '@grafana/faro-web-sdk'
import logger from '@/utils/logger'

interface Props {
  url: string | undefined
}

export default function InitializeFaro({ url }: Props) {
  if (typeof window === 'undefined' || faro.api || !url) {
    return null
  }

  try {
    const faro = initializeFaro({
      paused: window.location.hostname.includes('localhost'),
      url: url,
      app: {
        name: 'din-uforetrygd',
      },
      instrumentations: [...getWebInstrumentations()],
      beforeSend: (event: TransportItem) => {
        if (event.meta?.page?.url) {
          const pageUrl = new URL(event.meta.page.url)
          pageUrl.search = ''
          event.meta.page.url = pageUrl.toString()
        }
        return event
      },
    })
  } catch (e: any) {
    logger.error({ message: e.message })
    return null
  }
  return null
}
