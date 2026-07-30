import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { unleashSessionIdKey } from '@/utils/unleash'
import logger from './utils/logger'

export function proxy(request: NextRequest) {
  const url = new URL(request.url)
  logger.info({
    message: `Request ${url.pathname}`,
    http: {
      request: {
        method: request.method,
        host: url.origin,
        path: url.pathname,
      },
    },
  })

  const pid = request.nextUrl.searchParams.get('pid')
  const headers = new Headers(request.headers)
  if (pid) headers.set('x-kryptert-pid', pid)

  const response = NextResponse.next({ request: { headers } })

  if (!request.cookies.has(unleashSessionIdKey)) {
    const sessionId = `${Math.floor(Math.random() * 1_000_000_000)}`
    response.cookies.set(unleashSessionIdKey, sessionId, { path: '/' })
  }

  return response
}

export const config = {
  matcher: '/',
}
