import { hentJournalposter } from '@/api/hentJournalposter'
import { formatDate } from '@/utils/formatter/formatter'
import { mapOpprettetAv } from '@/utils/mapOpprettetAv/mapOpprettetAv'
import { DokumenterView } from './DokumenterView'

interface IDokumenterProps {
  pid?: string
}

export const Dokumenter = async ({ pid }: IDokumenterProps) => {
  const journalposterResponse = await hentJournalposter(pid)

  const journalposter = journalposterResponse.map((journalpost) => {
    const formattedDate = formatDate(journalpost.opprettetDato)
    if (!formattedDate) throw Error('Invalid date')

    return {
      tittel: journalpost.tittel ?? '',
      formattedDate: formattedDate,
      createdBy: mapOpprettetAv(journalpost.opprettetAv),
      sortDate: journalpost.opprettetDato ?? '',
      id: journalpost.id ?? '',
      dokumenter: (journalpost.dokumenter ?? [])
        .filter((d) => d.tittel !== undefined && d.dokumentInfoId !== undefined)
        .map((d) => ({
          tittel: d.tittel as string,
          dokumentInfoId: d.dokumentInfoId as string,
          filstorrelse: d.filstorrelse,
          variant: d.variant as string,
        })),
    }
  })

  return <DokumenterView pid={pid} journalposter={journalposter} />
}
