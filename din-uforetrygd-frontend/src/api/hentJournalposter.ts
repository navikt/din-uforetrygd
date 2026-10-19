import { hentData } from '@/api/common'
import { env } from '@/env'
import type { Dokument } from '@/api/initiate'
import { headers as nextHeaders } from 'next/dist/server/request/headers'

export const hentJournalposter = async (): Promise<Journalpost[]> => {
  const clientHeaders = await nextHeaders()
  const pid = clientHeaders.get('x-kryptert-pid')
  const headers = new Headers()
  if (pid) headers.set('pid', pid)

  const result = await hentData<Journalpost[]>(`${env('DIN_UFORETRYGD_BACKEND')}/api/journalposter`, 'GET', headers)
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
