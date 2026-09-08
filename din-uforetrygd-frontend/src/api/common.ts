import { headers } from 'next/headers'
import { serverEnv } from '@/env'

export const baseUrl = serverEnv.NODE_ENV !== 'development' ? serverEnv.DIN_UFORETRYGD_BACKEND : 'http://localhost:8080'

export type BackendError = {
  message: string
}

export const getMockScenario = async () => {
  if (serverEnv.NODE_ENV !== 'development') {
    return undefined
  }

  const clientHeaders = await headers()
  return clientHeaders.get('x-mock-scenario') || serverEnv.MOCK_SCENARIO || 'default'
}
