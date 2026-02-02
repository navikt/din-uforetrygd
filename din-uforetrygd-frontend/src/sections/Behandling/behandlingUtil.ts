import { components } from '@/api/api'
import { BEHANDLING_CONFIG, BehandlingType, Status, Lenke } from './behandlingConfig'

export interface ForsideBehandling {
  status: Status
  tittel: string
  statusTekst: string
  beskrivelse: string
  lenker: Lenke[]
  beregninger: BeregningRad[]
}

interface BeregningRad {
  label: string
  verdi: string
}

export function toForsideBehandling(fra: components['schemas']['ForsideBehandling']): ForsideBehandling | undefined {
  const status = fra.status as Status
  const behandlingType = fra.type as BehandlingType

  const config = BEHANDLING_CONFIG[behandlingType]?.[status]
  if (!config) {
    console.error('Kunne ikke mappe til riktig behandling data')
    return undefined
  }

  return {
    status: status,
    tittel: config.tittel,
    statusTekst: config.statusTekst,
    beskrivelse: config.beskrivelse,
    lenker: config.lenker,
    beregninger: lagBeregning(fra.beregning, status),
  }
}

function lagBeregning(beregning: components['schemas']['Beregning'], status: Status): BeregningRad[] {
  if (status !== Status.INNVILGET) return []

  const beregninger: BeregningRad[] = []

  if (beregning.nettoUforetrygdPerManed)
    beregninger.push({ label: 'Uføretrygd', verdi: beregning.nettoUforetrygdPerManed.toString() + ' kroner' })
  return beregninger
}
