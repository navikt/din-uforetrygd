export const getScenario = (request: Request) => {
  return request.headers.get('x-mock-scenario') ?? 'default'
}
