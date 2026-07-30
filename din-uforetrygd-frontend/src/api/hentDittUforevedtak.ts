import { baseUrl } from '@/api/common'
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  await sleep(1000)

  const fullmaktCookie = await getFullmaktCookie()

  const headers: Record<string, string> = {
    Authorization: `Bearer ${oboToken}`,
    pid: pid || '',
    Cookie: fullmaktCookie as string,
  }

  if (process.env.NODE_ENV === 'development') {
    headers['X-Mock-Scenario'] = process.env.MOCK_SCENARIO || 'default'
  }

  const response = await fetch(`${baseUrl}/api/uforevedtak`, { headers, cache: 'no-store' })
  if (!response.ok) return null
  return response.json()
}
