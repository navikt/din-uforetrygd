import { getMockScenario } from '@/api/common'
import { env } from '@/env'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getDinUforetrygdBackendOboToken } from '@/api/getOboToken'
import { z } from 'zod'

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

  const response = await fetch(`${env('DIN_UFORETRYGD_BACKEND')}/api/journalposter`, { headers, cache: 'no-store' })
  if (!response.ok) return []

  const json = await response.json().catch(() => [])

  return journalpostSchema.array().parse(json)
}

const dokumentSchema = z.object({
  tittel: z.string().nullable(),
  dokumentInfoId: z.string().nullable(),
  filstorrelse: z.number().nullable(),
  variant: z.enum(['ARKIV', 'SLADDET']).nullable(),
})

const journalpostSchema = z.object({
  id: z.string(),
  tittel: z.string().nullable(),
  opprettetAv: z.enum(['BRUKER', 'FULLMEKTIG', 'SAKSBEHANDLER', 'AUTOMATISK_PROSESS', 'UKJENT', 'NAV']),
  opprettetDato: z.string(),
  dokumenter: z.array(dokumentSchema),
})

export type Journalpost = z.infer<typeof journalpostSchema>
export type Dokument = z.infer<typeof dokumentSchema>
