import { hentDataOgLeggTilPid, Result } from '@/api/common'
import type { Behandling } from '@/api/hentSaksoversikt'
import { env } from '@/env'
import { Innloggingstype } from '@/const'

export const initiate = async (): Promise<Result<UforetrygdResponse>> => {
  return await hentDataOgLeggTilPid<UforetrygdResponse>(`${env('DIN_UFORETRYGD_BACKEND')}/api/initiate`, 'GET')
}

export interface Dokument {
  tittel?: string
  dokumentInfoId?: string
  filstorrelse?: number
  variant?: 'ARKIV' | 'SLADDET'
}

export interface Sak {
  status?: 'OPPRETTET' | 'TIL_BEHANDLING' | 'AVSLUTTET' | 'LOPENDE'
  sakId?: string
}

export interface UforetrygdResponse {
  pid?: string
  sak?: Sak
  hasIverksattVedtak: boolean
  uforegrad?: number
  innloggingstype: Innloggingstype
  behandling?: Behandling
}
