'use client'

import { useEffect } from 'react'
import { faro, getWebInstrumentations, initializeFaro, type TransportItem } from '@grafana/faro-web-sdk'

interface Props {
  url: string | undefined
  appName: string | undefined
}

export default function InitializeFaro({ url, appName }: Props) {
  useEffect(() => {
    if (faro.api || !url || !appName) {
      return
    }

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
  }, [url, appName])

  return null
}
