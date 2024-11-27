const log = (
  message: string,
  fields: Record<string, string | number>,
  level: 'Info' | 'Warning' | 'Error' | 'Fatal'
): void => {
  const logEntry = {
    '@timestamp': new Date(),
    ...fields,
    message,
    http: {
      request: {
        method: 'TEST',
        status_code: 200,
        duration: 92,
        path: '/bla/bla',
      },
    },
    level: level,
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(logEntry))
}

export const info = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'Info')
}

export const error = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'Error')
}

export const warning = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'Warning')
}

export const fatal = (message: string, fields: Record<string, string | number>) => {
  log(message, fields, 'Fatal')
}

export default { info, error, warning, fatal }
