import { HttpResponse, http, type JsonBodyType } from 'msw'
import { getScenario } from './getScenario'

const BASE_URL = 'http://localhost:8080'

export const createDefaultScenarioHandler = <T extends JsonBodyType>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data: Record<string, T>
) => {
  return http[method](`${BASE_URL}${url}`, ({ request }) => {
    const scenario = getScenario(request)
    return HttpResponse.json(data[scenario] ?? data.default)
  })
}
