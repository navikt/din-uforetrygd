import { randomUUID } from 'crypto'
import logger from './logger'

export const fetchLogger = (input: Request): Promise<Response> => {
  const correlationIdName = 'Nav-Call-Id'
  const correlationId = randomUUID()
  const url = new URL(input.url)
  const startTime = Date.now()

  const log = (timedelta: number) => ({
    method: input.method,
    host: url.origin,
    path: url.pathname,
    correlationId: correlationId,
    [correlationIdName]: correlationId,
    duration: timedelta,
  })

  input.headers.set(correlationIdName, correlationId)

  return fetch(input).then((response) => {
    const endTime = Date.now()
    const timeDelta = endTime - startTime // Timedelta in ms

    if (response.ok) {
      logger.info(`API request: ${url.pathname}`, log(timeDelta))
    } else {
      logger.error(`API request ${url.pathname}`, log(timeDelta))
    }
    return response
  })
}

export default fetchLogger
