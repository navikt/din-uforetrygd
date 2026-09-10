import { HttpResponse, http } from 'msw'

const baseUrl = process.env.UNLEASH_SERVER_API_URL
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

export const unleashHandlers = [
  http.get(`${baseUrl}/api/client/features`, () => {
    return HttpResponse.json({ version: 1, features })
  }),
  http.post(`${baseUrl}/api/client/metrics`, () => {
    return HttpResponse.json(null, { status: 202 })
  }),
]
