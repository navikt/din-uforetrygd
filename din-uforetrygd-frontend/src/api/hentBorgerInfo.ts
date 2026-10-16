import { getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from './getOboToken'
import { env } from '@/env'
import { z } from 'zod'

const borgerInfoSchema = z.object({
  pid: z.string(),
  navn: z.string(),
})

export type BorgerInfo = z.infer<typeof borgerInfoSchema>

export const hentBorgerInfo = async (kryptertPid: string): Promise<BorgerInfo> => {
  const oboToken = await getDinUforetrygdBackendOboToken().catch((error) => {
    console.error('Error: ', error)
    return
  })

  const fullmaktCookie = await getFullmaktCookie()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    pid: kryptertPid || '',
    Cookie: fullmaktCookie as string,
  }

  const mockScenario = await getMockScenario()
  if (mockScenario) {
    headers['X-Mock-Scenario'] = mockScenario
  }

  const response = await fetch(`${env('DIN_UFORETRYGD_BACKEND')}/api/borgerinfo`, {
    headers,
    cache: 'no-store',
  })

  const json = await response.json().catch(() => undefined)

  return borgerInfoSchema.parse(json)
}
