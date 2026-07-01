'use client'

import { faro, getWebInstrumentations, initializeFaro, type TransportItem } from '@grafana/faro-web-sdk'
import { useEffect } from 'react'

interface Props {
  url: string | undefined
  appName: string | undefined
}

export default function InitializeFaro({ url, appName }: Props) {
  useEffect(() => {
    if (faro.config || !url || !appName) {
      return
    }

    try {
      initializeFaro({
        paused: window.location.hostname.includes('localhost'),
        url: url,
        app: {
          name: appName,
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
    } catch (e) {
      console.warn('Faro initialiseringen feilet', e)
    }
  }, [url, appName])

  return null
}
