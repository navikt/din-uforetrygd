import winston from 'winston'
import { ecsFormat } from '@elastic/ecs-winston-format'
import { randomUUID } from 'crypto'

const logger = winston.createLogger({
  format: ecsFormat({
    convertReqRes: true,
  }),
  transports: [new winston.transports.Console()],
})

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
      logger.info(log(timeDelta))
    } else {
      logger.error(log(timeDelta))
    }
    return response
  })
}

export default logger
