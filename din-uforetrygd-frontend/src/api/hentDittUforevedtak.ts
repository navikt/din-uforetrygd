import { getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import { env } from '@/env'
import { z } from 'zod'

export const hentDittUforevedtak = async (pid?: string): Promise<DittUforevedtak | null> => {
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

  const response = await fetch(`${env('DIN_UFORETRYGD_BACKEND')}/api/uforevedtak`, { headers, cache: 'no-store' })

  if (!response.ok) return null

  const json: unknown = await response.json().catch(() => null)
  if (!json) return null

  return dittUforevedtakSchema.parse(json)
}

export const dittUforevedtakSchema = z.object({
  uforegrad: z.number(),
  virkFom: z.string().nullable(),
  uforetidspunkt: z.string().nullable(),
  bunnfradrag: z.number().nullable(),
  inntektstak: z.number().nullable(),
  inntektFraSkatt: z.number(),
  reduksjonsprosent: z.number().nullable(),
  nettoUtbetalingMnd: z.number(),
  sumAvForventedeInntekter: z.number().nullable(),
  hasBarnetilleggFellesBarn: z.boolean(),
  hasBarnetilleggSaerkullsbarn: z.boolean(),
  hasGjenlevendeTillegg: z.boolean(),
  hasVarigTilrettelagtArbeid: z.boolean(),
})

export type DittUforevedtak = z.infer<typeof dittUforevedtakSchema>
