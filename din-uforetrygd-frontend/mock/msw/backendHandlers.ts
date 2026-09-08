import { HttpResponse, http } from 'msw'
import { mockData } from '../mockData'
import { mockJournalposterData } from '../mockJournalposterData'
import { mockSaksoversiktData } from '../mockSaksoversiktData'
import { mockUforevedtakData } from '../mockUforevedtakData'
import { mockVarslerData } from '../mockVarslerData'
import { mockErVergeData } from '../mockErVergeData'
import { createDefaultScenarioHandler } from './createDefaultScenarioHandler'
import { getScenario } from './getScenario'

export const backendHandlers = [
  http.get('http://localhost:8080/api/initiate', ({ request }) => {
    const scenario = getScenario(request)
    if (scenario === 'forbidden') {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          error: 'FORBIDDEN',
          message: 'LOGIN_LEVEL_TOO_LOW',
          path: '/api/initiate',
        },
        { status: 403 }
      )
    }
    return HttpResponse.json(mockData[scenario] || mockData.default)
  }),
  createDefaultScenarioHandler('get', '/api/journalposter', mockJournalposterData),
  createDefaultScenarioHandler('get', '/api/uforevedtak', mockUforevedtakData),
  createDefaultScenarioHandler('get', '/api/saksoversikt', mockSaksoversiktData),
  createDefaultScenarioHandler('post', '/api/varsler/status', mockVarslerData),
  createDefaultScenarioHandler('get', '/api/er-verge', mockErVergeData),
]
