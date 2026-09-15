import { initialize } from 'unleash-client'

export const unleash = initialize({
  url: `${process.env.UNLEASH_SERVER_API_URL}/api`,
  appName: 'din-uforetrygd-frontend',
  environment: process.env.UNLEASH_SERVER_API_ENV,
  customHeaders: {
    Authorization: process.env.UNLEASH_SERVER_API_TOKEN ?? '',
  },
})
