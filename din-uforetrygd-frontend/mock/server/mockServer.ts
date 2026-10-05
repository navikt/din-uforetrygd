import express from 'express'
import { mockData } from '../mockData'
import { mockErVergeData } from '../mockErVergeData'
import { mockJournalposterData } from '../mockJournalposterData'
import { mockSaksoversiktData } from '../mockSaksoversiktData'
import { mockUforevedtakData } from '../mockUforevedtakData'
import { mockVarslerData } from '../mockVarslerData'
import { registerUnleashHandlers } from './unleashHandlers'

const port = 8080
const server = express()

const mockResponse =
  <T>(data: Record<string, T>) =>
  (request: express.Request, response: express.Response) => {
    const scenario = request.header('x-mock-scenario') ?? 'default'
    response.json(data[scenario] ?? data.default)
  }

server.get('/api/initiate', (request, response) => {
  const scenario = request.header('x-mock-scenario') ?? 'default'
  if (scenario === 'forbidden') {
    response.status(403).json({
      timestamp: new Date().toISOString(),
      status: 403,
      error: 'FORBIDDEN',
      message: 'LOGIN_LEVEL_TOO_LOW',
      path: '/api/initiate',
    })
    return
  }

  response.json(mockData[scenario] ?? mockData.default)
})

server.get('/api/journalposter', mockResponse(mockJournalposterData))
server.get('/api/uforevedtak', mockResponse(mockUforevedtakData))
server.get('/api/saksoversikt', mockResponse(mockSaksoversiktData))
server.post('/api/varsler/status', mockResponse(mockVarslerData))
server.get('/api/er-verge', mockResponse(mockErVergeData))

registerUnleashHandlers(server)

server.listen(port, () => {
  console.log(`Mock server ready on port ${port}`)
})
