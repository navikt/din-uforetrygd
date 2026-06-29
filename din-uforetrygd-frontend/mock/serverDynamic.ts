import cors from 'cors'
import express from 'express'
import { mockData } from './mockData'
import { mockSaksoversiktData } from './mockSaksoversiktData'
import { mockVarslerData } from './mockVarslerData'

const app = express()
const PORT = process.env.PORT || 8080

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      callback(null, true)
    },
  })
)

app.get('/api/initiate', (req, res) => {
  const requestedScenario = (req.headers['x-mock-scenario'] as string) || 'default'
  const data = mockData[requestedScenario] || mockData.default

  console.log(`Responding with scenario: ${requestedScenario}`)
  res.status(200).json(data)
})

app.get('/api/saksoversikt', (req, res) => {
  const requestedScenario = (req.headers['x-mock-scenario'] as string) || 'default'

  const data = mockSaksoversiktData[requestedScenario] || mockSaksoversiktData.default

  console.log(`Responding with saksoversikt scenario: ${requestedScenario}`)
  res.status(200).json(data)
})

app.get('/api/varsler/status', (req, res) => {
  const requestedScenario = (req.headers['x-mock-scenario'] as string) || 'default'
  const data = mockVarslerData[requestedScenario] || mockVarslerData.default

  console.log(`Responding with varsler scenario: ${requestedScenario}`)
  res.status(200).json(data)
})

app.listen(PORT, () => {
  console.log(`Dynamic mock server running on port ${PORT}`)
  console.log(`Available scenarios: ${Object.keys(mockData).join(', ')}`)
})
