import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import logger from './utils/logger'
import { unleashSessionIdKey } from '@/utils/unleash'

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

  const response = NextResponse.next()

  if (!request.cookies.has(unleashSessionIdKey)) {
    const sessionId = `${Math.floor(Math.random() * 1_000_000_000)}`
    response.cookies.set(unleashSessionIdKey, sessionId, { path: '/' })
  }

  return response
}

export const config = {
  matcher: '/',
}
