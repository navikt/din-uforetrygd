export interface ILogEntry {
  message: string
  correlationId?: string
  'Nav-Call-Id'?: string
  http?: {
    request?: {
      method: string
      path: string
      host: string
    }
    response?: {
      status_code: number
      duration?: number
    }
  }
}

interface IInternalLogEntry extends ILogEntry {
  '@timestamp': Date
  message: string
  level: 'Info' | 'Warning' | 'Error' | 'Fatal'
}
const log = (entiry: ILogEntry, level: 'Info' | 'Warning' | 'Error' | 'Fatal'): void => {
  const logEntry: IInternalLogEntry = {
    '@timestamp': new Date(),
    ...entiry,
    level: level,
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(logEntry))
}

export const info = (entry: ILogEntry) => {
  log(entry, 'Info')
}

export const error = (entry: ILogEntry) => {
  log(entry, 'Error')
}

export const warning = (entry: ILogEntry) => {
  log(entry, 'Warning')
}

export const fatal = (entry: ILogEntry) => {
  log(entry, 'Fatal')
}

export default { info, error, warning, fatal }
