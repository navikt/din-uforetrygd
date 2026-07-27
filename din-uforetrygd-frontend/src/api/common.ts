export const baseUrl =
  process.env.NODE_ENV !== 'development' ? process.env.DIN_UFORETRYGD_BACKEND : 'http://localhost:8080'

export type BackendError = {
  message: string
}
