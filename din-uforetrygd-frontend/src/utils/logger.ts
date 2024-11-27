const log = (
  message: string,
  fields: Record<string, string | number>,
  level: 'info' | 'warning' | 'error' | 'fatal'
): void => {
  const logEntry = {
    '@timestamp': new Date(),
    ...fields,
    message,
    severity: level,
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(logEntry))
}

export const info = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'info')
}

export const error = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'error')
}

export const warning = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'warning')
}

export const fatal = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'fatal')
}

export default { info, error, warning, fatal }
