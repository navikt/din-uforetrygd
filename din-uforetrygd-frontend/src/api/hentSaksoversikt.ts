import { type ApiResult, getMockScenario } from '@/api/common'
import { env } from '@/env'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import { z } from 'zod'

export const hentSaksoversikt = async (
  saksid: number,
  pid: string | undefined
): Promise<ApiResult<SaksoversiktResponse>> => {
  const oboToken = await getDinUforetrygdBackendOboToken().catch((error) => {
    console.error('Error: ', error)
    return
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

  const queryParams = new URLSearchParams({ saksid: saksid.toString() })
  const response = await fetch(`${env('DIN_UFORETRYGD_BACKEND')}/api/saksoversikt?${queryParams}`, {
    headers,
    cache: 'no-store',
  })

  const json = await response.json().catch(() => undefined)
  if (!response.ok) {
    return {
      ok: false,
      error: json.message,
    }
  }

  const result = saksoversiktSchema.safeParse(json)

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

export const behandlingTypeSchema = z.enum([
  'SØKNAD_UFØRETRYGD',
  'SØKNAD_ENDRING_UFØREGRAD',
  'SØKNAD_BARNETILLEGG',
  'SØKNAD_UNG_UFØR',
  'SØKNAD_YRKESSKADE',
  'EKSPORT',
  'INNTEKTSENDRING',
  'ETTEROPPGJØR',
  'ENDRING_IFU',
  'MELLOMBEHANDLING',
  'SLUTTBEHANDLING',
  'REGULERING',
])
export const BehandlingType = behandlingTypeSchema.enum
export type BehandlingType = z.infer<typeof behandlingTypeSchema>

export const statusSchema = z.enum(['MOTTATT', 'INNVILGET', 'AVSLAG'])
export const Status = statusSchema.enum
export type Status = z.infer<typeof statusSchema>

const etteroppgjorSchema = z.object({
  arstall: z.number(),
  avviksbelop: z.number(),
  type: z.string(),
})
export type Etteroppgjor = z.infer<typeof etteroppgjorSchema>

const beregningSchema = z.object({
  nettoUforetrygdPerManed: z.number(),
  nettoBarnetilleggPerManed: z.number().nullable(),
  uforegrad: z.number().nullable(),
})
export type Beregning = z.infer<typeof beregningSchema>

export const behandlingSchema = z.object({
  type: behandlingTypeSchema,
  status: statusSchema,
  mottattDato: z.string(),
  avslattForutgaendeMedlemskap: z.boolean(),
  ferdigstiltDato: z.string().nullable(),
  etteroppgjor: etteroppgjorSchema.nullable(),
  beregning: beregningSchema.nullable(),
})
export type Behandling = z.infer<typeof behandlingSchema>

const saksoversiktSchema = z.object({
  aktiveBehandlinger: z.array(behandlingSchema),
  avsluttedeBehandlinger: z.array(behandlingSchema),
})
export type SaksoversiktResponse = z.infer<typeof saksoversiktSchema>
