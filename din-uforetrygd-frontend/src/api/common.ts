import { headers } from 'next/headers'

export const baseUrl =
  process.env.NODE_ENV !== 'development' ? process.env.DIN_UFORETRYGD_BACKEND : 'http://localhost:8080'

export type BackendError = {
  message: string
}

export const getMockScenario = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return undefined
  }

  const clientHeaders = await headers()
  return clientHeaders.get('x-mock-scenario') || process.env.MOCK_SCENARIO || 'default'
}
