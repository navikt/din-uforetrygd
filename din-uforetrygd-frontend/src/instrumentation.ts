import logger from './utils/logger'

export function onRequestError(
  err: { digest?: string } & Error,
  request: { path: string; method: string; headers: Record<string, string> }
) {
  logger.error({
    message: err.message,
    http: {
      request: {
        method: request.method,
        path: request.path,
        host: request.headers['host'] ?? '',
      },
    },
  })
}
