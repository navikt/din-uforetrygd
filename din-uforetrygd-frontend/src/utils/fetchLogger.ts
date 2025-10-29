import logger, { ILogEntry } from './logger'

export const fetchLogger = (input: Request): Promise<Response> => {
  const correlationIdName = 'Nav-Call-Id'
  const correlationId = crypto.randomUUID()
  const url = new URL(input.url)
  const startTime = Date.now()

  const log = (timedelta: number, status_code: number): ILogEntry => ({
    message: `API request: ${url.pathname}`,
    http: {
      request: {
        host: url.origin,
        method: input.method,
        path: url.pathname,
      },
      response: {
        status_code: status_code,
        duration: timedelta,
      },
    },
    correlationId: correlationId,
    'Nav-Call-Id': correlationId,
  })

  input.headers.set(correlationIdName, correlationId)

  return fetch(input).then((response) => {
    const endTime = Date.now()
    const timeDelta = endTime - startTime // Timedelta in ms

    if (response.ok) {
      logger.info(log(timeDelta, response.status))
    } else {
      logger.error(log(timeDelta, response.status))
    }
    return response
  })
}

export default fetchLogger
