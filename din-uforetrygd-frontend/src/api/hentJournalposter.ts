import { baseUrl, getMockScenario } from '@/api/common'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import { Dokument } from '@/api/initiate'

export const hentJournalposter = async (pid?: string): Promise<Journalpost[]> => {
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

  const response = await fetch(`${baseUrl}/api/journalposter`, { headers, cache: 'no-store' })
  if (!response.ok) return []
  return response.json()
}

export interface Journalpost {
  id?: string
  tittel?: string
  opprettetAv?: 'BRUKER' | 'FULLMEKTIG' | 'SAKSBEHANDLER' | 'AUTOMATISK_PROSESS' | 'UKJENT' | 'NAV'
  opprettetDato?: string
  dokumenter?: Dokument[]
}
