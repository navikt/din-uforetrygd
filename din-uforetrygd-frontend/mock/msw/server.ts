import { setupServer } from 'msw/node'
import { backendHandlers } from './backendHandlers'
import { unleashHandlers } from './unleashHandlers'

export const server = setupServer(...backendHandlers, ...unleashHandlers)

// Logging for MSW for å se hvilke nettverkskall som matches og ikke
server.events.on('request:match', ({ request }) => {
  console.log('[MSW ✅ matched]', request.method, request.url)
})
server.events.on('request:unhandled', ({ request }) => {
  console.log('[MSW ⏭️ bypass ]', request.method, request.url)
})
