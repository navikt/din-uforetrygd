import { hentDataOgLeggTilPid } from '@/api/common'
import { env } from '@/env'

export interface DittUforevedtak {
  uforegrad: number
  virkFom?: string
  uforetidspunkt?: string
  bunnfradrag?: number
  inntektstak?: number
  inntektFraSkatt: number
  reduksjonsprosent?: number
  nettoUtbetalingMnd: number
  sumAvForventedeInntekter?: number
  hasBarnetilleggFellesBarn: boolean
  hasBarnetilleggSaerkullsbarn: boolean
  hasGjenlevendeTillegg: boolean
  hasVarigTilrettelagtArbeid: boolean
}

export const hentDittUforevedtak = async (): Promise<DittUforevedtak | null> => {
  const result = await hentDataOgLeggTilPid<DittUforevedtak>(`${env('DIN_UFORETRYGD_BACKEND')}/api/uforevedtak`, 'GET')

  if (!result.ok) return null
  return result.data
}
