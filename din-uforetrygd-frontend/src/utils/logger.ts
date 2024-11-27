interface ILogger {
  '@timestamp': Date
  message: Record<string, string | number>
  'log.level': 'info' | 'warning' | 'error' | 'fatal'
}

const log = (message: Record<string, string | number>, level: 'info' | 'warning' | 'error' | 'fatal'): void => {
  const logEntry: ILogger = {
    '@timestamp': new Date(),
    message,
    'log.level': level,
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(logEntry))
}

export const info = (message: Record<string, string | number>) => {
  log(message, 'info')
}

export const error = (message: Record<string, string | number>) => {
  log(message, 'error')
}

export const warning = (message: Record<string, string | number>) => {
  log(message, 'warning')
}

export const fatal = (message: Record<string, string | number>) => {
  log(message, 'fatal')
}

export default { info, error, warning, fatal }
