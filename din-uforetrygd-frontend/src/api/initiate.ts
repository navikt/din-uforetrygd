import { type ApiResult, getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import { behandlingSchema } from '@/api/hentSaksoversikt'
import { env } from '@/env'
import { z } from 'zod'

export const initate = async (pid: string | undefined): Promise<ApiResult<UforetrygdResponse>> => {
  const oboToken = await getDinUforetrygdBackendOboToken().catch((error) => {
    console.error('Error: ', error)
  })

  const fullmaktCookie = await getFullmaktCookie()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    pid: pid || '',
    Cookie: fullmaktCookie as string,
  }

  const mockScenario = await getMockScenario()
  if (mockScenario) {
    headers['X-Mock-Scenario'] = mockScenario
  }

  const response = await fetch(`${env('DIN_UFORETRYGD_BACKEND')}/api/initiate`, { headers, cache: 'no-store' })
  const json = await response.json().catch(() => undefined)

  const result = uforetrygdResponseSchema.safeParse(json)

  if (!result.success) {
    return {
      ok: false,
      error: 'Noe gikk galt.',
    }
  }

  return {
    ok: true,
    data: result.data,
  }
}

const innloggingstypeSchema = z.enum(['LEVEL4', 'LEVEL3', 'NAV', 'SYSTEM', 'IKKE_INNLOGGET'])
export const Innloggingstype = innloggingstypeSchema.enum
export type Innloggingstype = z.infer<typeof innloggingstypeSchema>

const sakSchema = z.object({
  status: z.enum(['OPPRETTET', 'TIL_BEHANDLING', 'AVSLUTTET', 'LOPENDE']),
  sakId: z.string().nullable(),
})
export type Sak = z.infer<typeof sakSchema>

const uforetrygdResponseSchema = z.object({
  pid: z.string(),
  sak: sakSchema.nullable(),
  hasIverksattVedtak: z.boolean(),
  uforegrad: z.number().nullable(),
  innloggingstype: innloggingstypeSchema,
  behandling: behandlingSchema.nullable(),
})
export type UforetrygdResponse = z.infer<typeof uforetrygdResponseSchema>
