import { stengForReguleringMiddleware } from '@navikt/steng-for-regulering/express'
import express from 'express'
import next from 'next'
import { initialize } from 'unleash-client'
import { serverEnv } from '../src/env'

const isDev = serverEnv.NODE_ENV !== 'production'
const PORT = serverEnv.PORT || 3000
const app = next({ dev: isDev })
const handle = app.getRequestHandler()
const server = express()

// Dette Unleash-oppsettet brukes kun for stengForReguleringMiddleware
// Unleash for resten av appen ligger i utils/unleash.ts
const unleashUrl = `${serverEnv.UNLEASH_SERVER_API_URL}/api`
const unleashToken = serverEnv.UNLEASH_SERVER_API_TOKEN
const unleashEnv = serverEnv.UNLEASH_SERVER_API_ENV
const unleash = initialize({
  disableAutoStart: !(unleashToken && unleashUrl),
  url: unleashUrl ?? '',
  appName: 'din-uforetrygd-frontend',
  environment: unleashEnv,
  customHeaders: {
    Authorization: unleashToken ?? '',
  },
})

unleash.on('synchronized', () => {
  console.log('Unleash synchronized')
})

unleash.on('error', (err) => {
  console.error('Unleash error:', err)
})

app
  .prepare()
  .then(() => {
    server.use(stengForReguleringMiddleware({ env: isDev ? 'dev' : 'prod', unleashClient: unleash }))
    server.get(/(.*)/, (req, res) => {
      return handle(req, res)
    })

    server.listen(PORT, () => {
      console.log(`Server ready on port ${PORT}`)
    })
  })
  .catch((exception) => {
    console.error(exception.stack)
    process.exit(1)
  })
