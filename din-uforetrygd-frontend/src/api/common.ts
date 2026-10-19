import { headers } from 'next/headers'

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

export const getMockScenario = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return undefined
  }

  const clientHeaders = await headers()
  return clientHeaders.get('x-mock-scenario') || process.env.MOCK_SCENARIO || 'default'
}
