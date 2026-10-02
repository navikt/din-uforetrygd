import { setupServer } from 'msw/node'
import { unleashHandlers } from './unleashHandlers'
import { backendHandlers } from './backendHandlers'

export const server = setupServer(...unleashHandlers)
// export const server = setupServer(...unleashHandlers, ...backendHandlers)

// server.events.on('request:match', ({ request }) => {
//   console.log('[MSW ✅ matched]', request.method, request.url)
// })
// server.events.on('request:unhandled', ({ request }) => {
//   console.log('[MSW ⏭️ bypass ]', request.method, request.url)
// })
