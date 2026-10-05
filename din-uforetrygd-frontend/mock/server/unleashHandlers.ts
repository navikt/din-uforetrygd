import type { Express } from 'express'

const localFlags = {
  'din-uforetrygd.barnetillegg': true,
  'din-uforetrygd.dine-muligheter': true,
  'din.uforetrygd.forside.snarvei.regelverksendringer2026': true,
}

const features = Object.entries(localFlags).map(([name, enabled]) => ({
  name,
  enabled,
  strategies: [],
  variants: [],
  impressionData: false,
}))

export const registerUnleashHandlers = (server: Express) => {
  server.get('/api/client/features', (_request, response) => {
    response.json({ version: 1, features })
  })
  server.post('/api/client/metrics', (_request, response) => {
    response.sendStatus(202)
  })
}
