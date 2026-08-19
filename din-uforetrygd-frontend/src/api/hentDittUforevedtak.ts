import { baseUrl, getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'

export interface DittUforevedtak {
  uforegrad: number
  virkFom?: string
  uforetidspunkt?: string
  inntektsgrense?: number
  inntektstak?: number
  inntektFraSkatt: number
  kompensasjonsgrad?: number
  nettoUtbetalingMnd: number
  sumAvForventedeInntekter?: number
  hasBarnetilleggFellesBarn: boolean
  hasBarnetilleggSaerkullsbarn: boolean
  hasGjenlevendeTillegg: boolean
  hasVarigTilrettelagtArbeid: boolean
}

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

  const response = await fetch(`${baseUrl}/api/uforevedtak`, { headers, cache: 'no-store' })
  if (!response.ok) return null
  return response.json()
}
