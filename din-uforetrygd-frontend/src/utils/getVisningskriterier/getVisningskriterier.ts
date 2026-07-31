import type { UforetrygdResponse } from '@/api/initiate'
import { Visningskriterier } from '@/const'

export const getVisningskriterier = (init: UforetrygdResponse) => {
  const sak = init.sak
  const visningskriterier: Visningskriterier[] = []

  if (init.erVerge) {
    visningskriterier.push(Visningskriterier.ErVerge)
  }

  if (!sak || sak.status === 'OPPRETTET') {
    visningskriterier.push(Visningskriterier.IngenUforesak)
    return visningskriterier
  }

  if (init.hasIverksattVedtak) {
    if (init.uforegrad && init.uforegrad !== 100) {
      visningskriterier.push(Visningskriterier.GradertUfore)
    }
    visningskriterier.push(Visningskriterier.Uforetrygd)
  } else if (sak.status === 'LOPENDE') {
    visningskriterier.push(Visningskriterier.Uforetrygd)
  }

  if (sak.status === 'AVSLUTTET') {
    visningskriterier.push(Visningskriterier.AvsluttetUforetrygdSak)
  }

  if (sak.status === 'TIL_BEHANDLING') {
    visningskriterier.push(Visningskriterier.SakTilBehandling)
  }

  return visningskriterier
}
