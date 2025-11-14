import express from 'express'
import cors from 'cors'
import { mockData } from './mockData'

const app = express()
const PORT = process.env.PORT || 8080

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true)
    },
  })
)

app.get('/api/initiate', (req, res) => {
  const requestedScenario = req.headers['x-mock-scenario'] as string || 'default'
  const data = mockData[requestedScenario] || mockData.default

  console.log(`Responding with scenario: ${requestedScenario}`)
  res.status(200).json(data)
})


app.listen(PORT, () => {
  console.log(`Dynamic mock server running on port ${PORT}`)
  console.log(`Available scenarios: ${Object.keys(mockData).join(', ')}`)
})