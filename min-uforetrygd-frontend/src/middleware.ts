import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import logger from './utils/logger'

export function middleware(request: NextRequest) {
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
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
