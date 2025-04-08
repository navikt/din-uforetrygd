'use client'

import { useEffect } from 'react'

interface ITaskAnalytics {
  id: string
  shouldRun: boolean
}

export const TaskAnalytics: React.FC<ITaskAnalytics> = (props) => {
  useEffect(() => {
    // Task analytic Spørreundersøkelse for gammel og ny vedtaksbrev

    setTimeout(() => {
      //@ts-ignore Ukjent TA type
      if (typeof window.TA === 'function' && props.shouldRun) {
        //@ts-ignore Ukjent TA type
        window.TA('start', props.id)
      }
    }, 1000)
  })

  return null
}
