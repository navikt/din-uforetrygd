import { hentDataOgLeggTilPid } from '@/api/common'
import { env } from '@/env'
import type { Dokument } from '@/api/initiate'

export const hentJournalposter = async (): Promise<Journalpost[]> => {
  const result = await hentDataOgLeggTilPid<Journalpost[]>(`${env('DIN_UFORETRYGD_BACKEND')}/api/journalposter`, 'GET')
  if (!result.ok) return []
  return result.data
}

export interface Journalpost {
  id?: string
  tittel?: string
  opprettetAv?: 'BRUKER' | 'FULLMEKTIG' | 'SAKSBEHANDLER' | 'AUTOMATISK_PROSESS' | 'UKJENT' | 'NAV'
  opprettetDato?: string
  dokumenter?: Dokument[]
}
