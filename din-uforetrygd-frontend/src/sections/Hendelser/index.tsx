import { components } from '@/api/api'
import { mapHendelseCode } from '@/utils/mapHendelseCodesToHendelse'
import { formatDate } from '@/utils/formatter/formatter'
import { HendelserView } from './HendelserView'
import { mapOpprettetAv } from '@/utils/mapOpprettetAv'
import { mapKravDescription } from '@/utils/mapKravDescription'

interface IHendelserProps {
  hendelser: components['schemas']['SakHendelse'][]
  sakstype: string
}

interface Hendelse {
  type: string
  description?: string
  createdBy?: string
  formattedDate?: string
  sortDate: string
}

const Hendelser: React.FC<IHendelserProps> = (props) => {
  const hendelser = props.hendelser.reduce<Hendelse[]>((acc, hendelse) => {
    const hasDescription = hendelse.gjelder && hendelse.arsak
    const hendelsestype = mapHendelseCode(hendelse.type!, props.sakstype)
    if (hendelsestype) {
      acc.push({
        type: hendelsestype,
        description: hasDescription ? mapKravDescription(hendelse.gjelder!, hendelse.arsak!, props.sakstype) : undefined,
        createdBy: mapOpprettetAv(hendelse.opprettetAv),
        formattedDate: formatDate(hendelse.endretDato),
        sortDate: hendelse.endretDato!!,
      })
    }
    return acc
  }, [])

  return <HendelserView hendelser={hendelser} />
}

export default Hendelser
