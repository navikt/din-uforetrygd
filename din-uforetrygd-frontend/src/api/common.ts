import { headers as nextHeaders } from 'next/headers'
import { env } from '@/env'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getOboToken } from '@/api/getOboToken'

export type BackendError = {
  message: string
}

export const getMockScenario = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return undefined
  }

  const clientHeaders = await nextHeaders()
  return clientHeaders.get('x-mock-scenario') || process.env.MOCK_SCENARIO || 'default'
}

export const hentData = async <T>(
  url: string,
  method: Method,
  headers: Headers,
  tokenScope: string = env('DIN_UFORETRYGD_BACKEND_SCOPE'),
  body?: string
): Promise<Result<T>> => {
  try {
    const mockScenario = await getMockScenario()
    if (mockScenario) headers.append('X-Mock-Scenario', mockScenario)

    const oboToken = await getOboToken(tokenScope)
    if (oboToken) headers.append('Authorization', `Bearer ${oboToken}`)

    const fullmaktCookie = await getFullmaktCookie()
    if (fullmaktCookie) headers.append('Cookie', fullmaktCookie)

    const response = await fetch(url, {
      method: method,
      credentials: 'include',
      headers: headers,
      body: body,
    })

    if (!response.ok) {
      const json = await response.json()
      const errorCode = json.message ?? ErrorCode.GENERIC_ERROR
      return { ok: false, error: errorCode }
    }

    const data = await response.json()

    return { ok: true, data: data }
  } catch {
    return { ok: false, error: ErrorCode.GENERIC_ERROR }
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ErrorCode }

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

enum ErrorCode {
  LOGIN_LEVEL_TOO_LOW,
  VEILEDER_UNAUTHORIZED,
  NO_FULLMAKT_PRESENT,
  NO_PID_PRESENT,
  GENERIC_ERROR,
}
