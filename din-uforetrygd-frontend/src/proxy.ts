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

  const headers = new Headers(request.headers)

  const pid = request.nextUrl.searchParams.get('pid')
  if (pid) headers.set('x-kryptert-pid', pid)

  if (process.env.ENABLE_MSW === 'true') {
    // Sett mock-scenario header basert på URL-parameter eller miljøvariabel
    const scenario = request.nextUrl.searchParams.get('scenario') ?? process.env.MOCK_SCENARIO ?? 'default'
    headers.set('x-mock-scenario', scenario)
  }

  const response = NextResponse.next({ request: { headers } })

  if (!request.cookies.has(unleashSessionIdKey)) {
    const sessionId = `${Math.floor(Math.random() * 1_000_000_000)}`
    response.cookies.set(unleashSessionIdKey, sessionId, { path: '/' })
  }

  return response
}

export const config = {
  // Kjør proxyen på alle sider og undersiden utenom /api, /health, _next og robots.txt
  matcher: ['/((?!api|health|_next|robots.txt).*)'],
}
