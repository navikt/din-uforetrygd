import { components } from '@/api/api'
import { DokumenterView } from './DokumenterView'
import { formatDate } from '@/utils/formatter/formatter'
import { mapOpprettetAv } from '@/utils/mapOpprettetAv'
import { Visningskriterier } from '@/const'

interface IDokumenterProps {
  pid?: string
  journalposter: components['schemas']['Journalpost'][]
  visningskriterier: Visningskriterier[]
}

export const Dokumenter: React.FC<IDokumenterProps> = (props) => {
  if (props.visningskriterier.includes(Visningskriterier.IngenUforesak)) {
    return <></>
  }

  const journalposter = props.journalposter.map((journalpost) => {
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

  return <DokumenterView pid={props.pid} journalposter={journalposter} />
}
