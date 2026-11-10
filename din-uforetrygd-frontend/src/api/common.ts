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

export const hentDataOgLeggTilPid = async <T>(url: string, method: Method, body?: string): Promise<Result<T>> => {
  const clientHeaders = await nextHeaders()
  const pid = clientHeaders.get('x-kryptert-pid')
  const headers = new Headers()
  if (pid) headers.set('pid', pid)

  return hentData(url, method, headers, env('DIN_UFORETRYGD_BACKEND_SCOPE'), body)
}

export const hentData = async <T>(
  url: string,
  method: Method,
  headers: Headers,
  tokenScope: string,
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
      cache: 'no-store',
    })
    const json = await response.json()

    if (!response.ok) {
      const errorCode = json.message ?? ErrorCode.GENERIC_ERROR
      return { ok: false, error: errorCode }
    }
    return { ok: true, data: json }
  } catch {
    return { ok: false, error: ErrorCode.GENERIC_ERROR }
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ErrorCode }

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export enum ErrorCode {
  LOGIN_LEVEL_TOO_LOW,
  VEILEDER_UNAUTHORIZED,
  NO_FULLMAKT_PRESENT,
  NO_PID_PRESENT,
  GENERIC_ERROR,
}
