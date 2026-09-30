'use client'

import { useApmRouteTracking } from '@nais/apm/react'
import { usePathname, useSearchParams } from 'next/navigation'

export function ApmRouteTracker() {
  useApmRouteTracking(usePathname(), useSearchParams())
  return null
}
